import { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserRole } from '../hooks/useUserRole';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';

interface ValidationResult {
  valid: boolean;
  ticket?: {
    bookingReference: string;
    eventTitle: string;
    customerEmail: string;
    quantity: number;
    validatedAt: string;
  };
  message: string;
}

export default function TicketValidationPage() {
  const { getAccessTokenSilently } = useAuth0();
  const { isProducer, isAdmin, loading } = useUserRole();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [scanMode, setScanMode] = useState<'camera' | 'upload'>('camera');
  const [countdown, setCountdown] = useState<number | null>(null);

  const isStaff = () => isProducer() || isAdmin();

  // Mount / unmount camera scanner when tab changes
  useEffect(() => {
    if (scanMode !== 'camera' || loading || !isStaff()) return;

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false,
    );

    scanner.render(
      (decodedText) => {
        scanner.clear().catch(() => {});
        handleValidate(decodedText);
      },
      () => {
        // Ignore per-frame scan failures (normal until QR enters frame)
      },
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch(() => {});
      scannerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanMode, loading]);

  const handleValidate = async (qrData: string) => {
    setIsValidating(true);
    setError('');
    setValidationResult(null);
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.post(
        'http://localhost:3000/tickets/validate',
        { qrData },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setValidationResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to validate ticket');
    } finally {
      setIsValidating(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';

    setIsValidating(true);
    setError('');
    setValidationResult(null);

    const html5Qr = new Html5Qrcode('qr-file-reader');
    try {
      const decodedText = await html5Qr.scanFile(file, false);
      await handleValidate(decodedText);
    } catch {
      setError('Could not read a QR code from the uploaded image. Make sure the image is clear and contains a valid ticket QR.');
    } finally {
      html5Qr.clear();
      setIsValidating(false);
    }
  };

  const handleTabChange = (mode: 'camera' | 'upload') => {
    setValidationResult(null);
    setError('');
    setScanMode(mode);
  };

  const resetScan = () => {
    setValidationResult(null);
    setError('');
    setCountdown(null);
    if (scanMode === 'camera') {
      setScanMode('upload');
      setTimeout(() => setScanMode('camera'), 50);
    }
  };

  // Auto-reset after showing result
  useEffect(() => {
    if (!validationResult && !error) return;

    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    const timeout = setTimeout(() => resetScan(), 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationResult, error]);

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Cargando...</div>;
  }

  if (!isStaff()) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Acceso Denegado</h1>
        <p className="text-gray-600">No tenés permisos para acceder a esta página.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Validación de Entradas</h1>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => handleTabChange('camera')}
          className={`px-5 py-2 rounded-md font-medium transition-colors ${
            scanMode === 'camera'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Cámara
        </button>
        <button
          onClick={() => handleTabChange('upload')}
          className={`px-5 py-2 rounded-md font-medium transition-colors ${
            scanMode === 'upload'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Subir Imagen
        </button>
      </div>

      {/* Camera Mode */}
      {scanMode === 'camera' && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <p className="text-sm text-gray-500 mb-4">
            Apuntá la cámara al código QR del cliente. La entrada se valida automáticamente.
          </p>
          {/* html5-qrcode injects the camera UI here */}
          <div id="qr-reader" className="w-full" />
          {isValidating && (
            <p className="text-center text-sm text-blue-600 mt-3">Validando...</p>
          )}
        </div>
      )}

      {/* Upload Mode */}
      {scanMode === 'upload' && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <p className="text-sm text-gray-500 mb-4">
            Subí una captura o foto del código QR de la entrada.
          </p>
          {/* Required hidden div for Html5Qrcode file scanning */}
          <div id="qr-file-reader" className="hidden" />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isValidating}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {isValidating ? 'Leyendo QR...' : 'Elegir Imagen'}
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
          {countdown !== null && (
            <p className="mt-2 text-gray-400">Reiniciando en {countdown}s...</p>
          )}
        </div>
      )}

      {/* Validation Result */}
      {validationResult && (
        <div
          className={`bg-white rounded-lg shadow p-6 border-l-4 ${
            validationResult.valid ? 'border-green-500' : 'border-red-500'
          }`}
        >
          {validationResult.valid ? (
            <div>
              <div className="flex items-center mb-4">
                <span className="text-green-600 text-3xl mr-3">✓</span>
                <span className="text-xl font-semibold text-green-700">Entrada Válida</span>
              </div>
              {validationResult.ticket && (
                <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-gray-500">Referencia</p>
                      <p className="font-medium">{validationResult.ticket.bookingReference}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Evento</p>
                      <p className="font-medium">{validationResult.ticket.eventTitle}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Cliente</p>
                      <p className="font-medium">{validationResult.ticket.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Cantidad</p>
                      <p className="font-medium">{validationResult.ticket.quantity}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Validada el</p>
                      <p className="font-medium">
                        {new Date(validationResult.ticket.validatedAt).toLocaleString('es-AR')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {countdown !== null && (
                <p className="mt-4 text-center text-sm text-gray-400">Reiniciando en {countdown}s...</p>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-3">
                <span className="text-red-600 text-3xl mr-3">✗</span>
                <span className="text-xl font-semibold text-red-700">Entrada Inválida</span>
              </div>
              <p className="text-red-600 text-sm">{validationResult.message}</p>
              {countdown !== null && (
                <p className="mt-4 text-center text-sm text-gray-400">Reiniciando en {countdown}s...</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
