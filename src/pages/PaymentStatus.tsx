import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface PaymentStatus {
  status: 'success' | 'failure' | 'pending';
  reference?: string;
  message?: string;
}

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>({ status: 'pending' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paymentStatus = searchParams.get('status') as 'success' | 'failure' | 'pending';
    const reference = searchParams.get('reference');
    
    setStatus({
      status: paymentStatus || 'pending',
      reference: reference || undefined,
    });
    setLoading(false);
  }, [searchParams]);

  const getStatusConfig = () => {
    switch (status.status) {
      case 'success':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          title: 'Payment Successful!',
          message: 'Your tickets have been confirmed. Check your email for the QR code.',
          actionText: 'View My Tickets',
          actionUrl: '/my-tickets',
        };
      case 'failure':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again.',
          actionText: 'Try Again',
          actionUrl: '/events',
        };
      case 'pending':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          title: 'Payment Pending',
          message: 'Your payment is being processed. You will receive an email confirmation shortly.',
          actionText: 'View Events',
          actionUrl: '/events',
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          title: 'Payment Status Unknown',
          message: 'Please check your email for payment confirmation.',
          actionText: 'View Events',
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
          <p className="text-gray-600">Loading payment status...</p>
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
              <span className="text-sm text-gray-600">Booking Reference: </span>
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
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
