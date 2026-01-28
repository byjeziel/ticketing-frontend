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
      setTickets(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId: string) => {
    if (!window.confirm('Are you sure you want to cancel this ticket?')) {
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
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-6">My Tickets</h1>
        <p className="text-gray-600 mb-6">Please log in to view your tickets.</p>
        <button
          onClick={() => loginWithRedirect()}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Log In
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading your tickets...</div>;
  }

  const successMessage = location.state?.success;
  const bookingReference = location.state?.bookingReference;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Tickets</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <strong>Booking Successful!</strong> Your booking reference is: <strong>{bookingReference}</strong>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">You haven't booked any tickets yet.</div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {tickets.map((ticket) => (
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
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Date</div>
                      <div className="font-medium">
                        {new Date(ticket.eventDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Time</div>
                      <div className="font-medium">{ticket.eventTime}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Quantity</div>
                      <div className="font-medium">{ticket.quantity} ticket(s)</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Total Price</div>
                      <div className="font-medium">{ticket.currency} {ticket.totalPrice}</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Booking Reference</div>
                        <div className="font-mono font-medium">{ticket.bookingReference}</div>
                        <div className="text-xs text-gray-500">
                          Booked on {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      {ticket.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelTicket(ticket._id)}
                          disabled={cancellingId === ticket._id}
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                        >
                          {cancellingId === ticket._id ? 'Cancelling...' : 'Cancel Ticket'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
