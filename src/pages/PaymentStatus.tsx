import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

interface PaymentStatus {
  status: 'success' | 'failure' | 'pending';
  reference?: string;
  message?: string;
}

export default function PaymentStatus() {
  // status comes from the path param: /payment/:status
  const { status: pathStatus } = useParams<{ status: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>({ status: 'pending' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paymentStatus = (pathStatus as 'success' | 'failure' | 'pending') || 'pending';
    const reference = searchParams.get('reference');

    setStatus({
      status: paymentStatus,
      reference: reference || undefined,
    });
    setLoading(false);
  }, [pathStatus, searchParams]);

  const getStatusConfig = () => {
    switch (status.status) {
      case 'success':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          title: '¡Pago exitoso!',
          message: 'Tus entradas fueron confirmadas. Revisá tu email para ver el código QR.',
          actionText: 'Ver Mis Entradas',
          actionUrl: '/my-tickets',
        };
      case 'failure':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          title: 'Pago fallido',
          message: 'No se pudo procesar tu pago. Por favor intentá de nuevo.',
          actionText: 'Intentar de nuevo',
          actionUrl: '/events',
        };
      case 'pending':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          title: 'Pago pendiente',
          message: 'Tu pago está siendo procesado. Recibirás una confirmación por email en breve.',
          actionText: 'Ver Eventos',
          actionUrl: '/events',
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          title: 'Estado de pago desconocido',
          message: 'Revisá tu email para ver la confirmación de pago.',
          actionText: 'Ver Eventos',
          actionUrl: '/events',
        };
    }
  };

  const config = getStatusConfig();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estado del pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-8 text-center`}>
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white mb-4">
            {status.status === 'success' ? (
              <svg className={`h-8 w-8 ${config.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : status.status === 'failure' ? (
              <svg className={`h-8 w-8 ${config.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className={`h-8 w-8 ${config.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>

          {/* Title */}
          <h1 className={`text-2xl font-bold ${config.textColor} mb-2`}>
            {config.title}
          </h1>

          {/* Message */}
          <p className={`${config.textColor} mb-6`}>
            {config.message}
          </p>

          {/* Reference */}
          {status.reference && (
            <div className="mb-6">
              <span className="text-sm text-gray-600">Referencia de reserva: </span>
              <span className="font-mono font-medium">{status.reference}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => navigate(config.actionUrl)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            {config.actionText}
          </button>
        </div>

        {/* Additional Information */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Si tenés alguna consulta, contactá a nuestro equipo de soporte.
          </p>
        </div>
      </div>
    </div>
  );
}
