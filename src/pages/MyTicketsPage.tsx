import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

interface Event {
  _id: string;
  title: string;
  venue: string;
  address: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  imageUrl: string;
}

interface Ticket {
  _id: string;
  event: Event;
  eventDate: string;
  eventTime: string;
  quantity: number;
  totalPrice: number;
  currency: string;
  bookingReference: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  emailVerified: boolean;
  qrCode?: string;
  createdAt: string;
}

export default function MyTicketsPage() {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Transfer modal state
  const [transferTicketId, setTransferTicketId] = useState<string | null>(null);
  const [transferEmail, setTransferEmail] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTickets();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchTickets = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get('http://localhost:3000/tickets/my-tickets', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTickets(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const openTransferModal = (ticketId: string) => {
    setTransferTicketId(ticketId);
    setTransferEmail('');
    setTransferError('');
    setTransferSuccess(false);
  };

  const closeTransferModal = () => {
    setTransferTicketId(null);
  };

  const handleTransfer = async () => {
    if (!transferTicketId || !transferEmail) return;
    setTransferLoading(true);
    setTransferError('');
    try {
      const token = await getAccessTokenSilently();
      await axios.post(
        `http://localhost:3000/tickets/${transferTicketId}/transfer`,
        { recipientEmail: transferEmail },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTransferSuccess(true);
      fetchTickets();
    } catch (err: any) {
      setTransferError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setTransferLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId: string) => {
    if (!window.confirm('¿Estás seguro de que querés cancelar esta entrada?')) {
      return;
    }

    setCancellingId(ticketId);
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`http://localhost:3000/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setTickets(tickets.map(ticket => 
        ticket._id === ticketId 
          ? { ...ticket, status: 'cancelled' as const }
          : ticket
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel ticket');
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="px-6 py-6 text-center">
        <h1 className="text-3xl font-bold mb-6">Mis Entradas</h1>
        <p className="text-gray-600 mb-6">Iniciá sesión para ver tus entradas.</p>
        <button
          onClick={() => loginWithRedirect()}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Iniciar sesión
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="px-6 py-6">Cargando tus entradas...</div>;
  }

  const successMessage = location.state?.success;
  const bookingReference = location.state?.bookingReference;

  return (
    <div className="px-6 py-6">
      <h1 className="text-3xl font-bold mb-6">Mis Entradas</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <strong>¡Reserva exitosa!</strong> Tu referencia de reserva es: <strong>{bookingReference}</strong>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {tickets.filter(t => t.event).length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">Todavía no reservaste ninguna entrada.</div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Ver Eventos
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {tickets.filter(t => t.event).map((ticket) => (
            <div key={ticket._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={ticket.event.imageUrl}
                    alt={ticket.event.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{ticket.event.title}</h2>
                      <div className="text-gray-600 mb-2">
                        <p>{ticket.event.venue}</p>
                        <p>{ticket.event.address}</p>
                        <p>{ticket.event.city}, {ticket.event.country}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        ticket.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : ticket.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {{ confirmed: 'Confirmada', cancelled: 'Cancelada', pending: 'Pendiente' }[ticket.status] ?? ticket.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Fecha</div>
                      <div className="font-medium">
                        {new Date(ticket.eventDate).toLocaleDateString('es-AR', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Horario</div>
                      <div className="font-medium">{ticket.eventTime}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Cantidad</div>
                      <div className="font-medium">{ticket.quantity} entrada(s)</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Precio Total</div>
                      <div className="font-medium">{ticket.currency} {ticket.totalPrice}</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Referencia de Reserva</div>
                        <div className="font-mono font-medium">{ticket.bookingReference}</div>
                        <div className="text-xs text-gray-500">
                          Reservado el {new Date(ticket.createdAt).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      {ticket.status === 'confirmed' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openTransferModal(ticket._id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                            Transferir
                          </button>
                          <button
                            onClick={() => handleCancelTicket(ticket._id)}
                            disabled={cancellingId === ticket._id}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                          >
                            {cancellingId === ticket._id ? 'Cancelando...' : 'Cancelar Entrada'}
                          </button>
                        </div>
                      )}
                    </div>

                    {ticket.status === 'confirmed' && ticket.emailVerified && ticket.qrCode && (
                      <div className="mt-4 pt-4 border-t text-center">
                        <div className="text-sm font-medium text-gray-700 mb-2">Tu Código QR</div>
                        <img
                          src={ticket.qrCode}
                          alt="Ticket QR Code"
                          className="w-40 h-40 mx-auto border-2 border-gray-200 rounded-lg"
                        />
                        <p className="text-xs text-gray-500 mt-2">Presentalo en la entrada del evento</p>
                      </div>
                    )}

                    {ticket.status === 'confirmed' && !ticket.emailVerified && (
                      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md px-4 py-3">
                        <p className="text-sm text-yellow-800">
                          Revisá tu email para verificar tu dirección y activar tu código QR.
                        </p>
                      </div>
                    )}

                    {ticket.status === 'pending' && (
                      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md px-4 py-3">
                        <p className="text-sm text-blue-800">Pago pendiente — tu QR aparecerá una vez confirmado.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transfer Modal */}
      {transferTicketId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Transferir Entrada</h2>

            {transferSuccess ? (
              <div>
                <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-4">
                  <p className="text-green-800 font-medium">¡Entrada transferida exitosamente!</p>
                  <p className="text-green-700 text-sm mt-1">
                    El destinatario recibirá un email con su entrada y código QR.
                  </p>
                </div>
                <button
                  onClick={closeTransferModal}
                  className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 text-sm mb-4">
                  Ingresá el email del usuario registrado al que querés transferir esta entrada.
                </p>
                <input
                  type="email"
                  placeholder="destinatario@ejemplo.com"
                  value={transferEmail}
                  onChange={(e) => setTransferEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {transferError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2 mb-3">
                    {transferError}
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={handleTransfer}
                    disabled={transferLoading || !transferEmail}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
                  >
                    {transferLoading ? 'Transfiriendo...' : 'Transferir'}
                  </button>
                  <button
                    onClick={closeTransferModal}
                    disabled={transferLoading}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
