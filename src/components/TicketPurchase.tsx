import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

interface ScheduleItem {
  date: string;
  time: string;
  tickets: number;
  ticketsSold: number;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  imageUrl: string;
  schedule: ScheduleItem[];
  isActive: boolean;
}

interface TicketPurchaseData {
  eventId: string;
  eventDate: string;
  eventTime: string;
  quantity: number;
  customerEmail: string;
  currency: string;
}

export default function TicketPurchase() {
  // Route param is :id (not :eventId) — see App.tsx path="/events/:id/purchase"
  const { id: eventId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getAccessTokenSilently, user } = useAuth0();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerEmail, setCustomerEmail] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEvent(eventId);
    }
    // Pre-populate from EventDetailsPage state
    const state = location.state as { selectedSchedule?: { date: string; time: string }; ticketQuantity?: number } | null;
    if (state?.selectedSchedule) {
      setSelectedDate(state.selectedSchedule.date);
      setSelectedTime(state.selectedSchedule.time);
    }
    if (state?.ticketQuantity) {
      setQuantity(state.ticketQuantity);
    }
  }, [eventId]);

  useEffect(() => {
    if (user?.email) {
      setCustomerEmail(user.email);
    }
  }, [user]);

  const fetchEvent = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/events/${id}`);
      setEvent(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch event');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableTickets = (scheduleItem: ScheduleItem) => {
    return scheduleItem.tickets - scheduleItem.ticketsSold;
  };

  const getNextEventDates = (schedule: ScheduleItem[]) => {
    return schedule
      .filter(item => new Date(item.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const handlePurchase = async () => {
    if (!event || !selectedDate || !selectedTime || !customerEmail) {
      setError('Please fill all fields');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const token = await getAccessTokenSilently();
      const purchaseData: TicketPurchaseData = {
        eventId: event._id,
        eventDate: selectedDate,
        eventTime: selectedTime,
        quantity,
        customerEmail,
        currency: event.currency,
      };

      const response = await axios.post('http://localhost:3000/tickets', purchaseData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { paymentPreference } = response.data;

      // sandboxInitPoint in dev, initPoint in production
      const checkoutUrl = import.meta.env.DEV
        ? paymentPreference.sandboxInitPoint
        : paymentPreference.initPoint;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setError('Payment initialization failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Purchase failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">Cargando detalles del evento...</div>;
  }

  if (error && !event) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!event) {
    return <div className="max-w-6xl mx-auto p-6">Evento no encontrado</div>;
  }

  const nextDates = getNextEventDates(event.schedule);
  const selectedScheduleItem = event.schedule.find(
    item => item.date === selectedDate && item.time === selectedTime
  );
  const availableTickets = selectedScheduleItem ? getAvailableTickets(selectedScheduleItem) : 0;
  const totalPrice = event.price * quantity;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white text-center px-4">
              {event.title}
            </h1>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Event Details */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Detalles del Evento</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.venue}, {event.city}, {event.country}
                </div>
                
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {event.category}
                </div>
              </div>

              <p className="text-gray-700 mb-6">{event.description}</p>

              <div className="text-3xl font-bold text-green-600 mb-6">
                {event.currency} {event.price} por entrada
              </div>
            </div>

            {/* Purchase Form */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Comprar Entradas</h2>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Fecha
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime('');
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccioná una fecha</option>
                    {nextDates.map((item, index) => (
                      <option key={index} value={item.date}>
                        {new Date(item.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seleccionar Horario
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccioná un horario</option>
                      {event.schedule
                        .filter(item => item.date === selectedDate)
                        .map((item, index) => {
                          const available = getAvailableTickets(item);
                          return (
                            <option 
                              key={index} 
                              value={item.time}
                              disabled={available === 0}
                            >
                              {item.time} ({available} entradas disponibles)
                            </option>
                          );
                        })}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={Math.min(availableTickets, 10)}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(availableTickets, parseInt(e.target.value) || 1)))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {event.currency} {totalPrice}
                    </span>
                  </div>

                  <button
                    onClick={handlePurchase}
                    disabled={processing || !selectedDate || !selectedTime || !customerEmail || availableTickets === 0}
                    className="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {processing ? 'Procesando...' : 'Proceder al Pago'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
