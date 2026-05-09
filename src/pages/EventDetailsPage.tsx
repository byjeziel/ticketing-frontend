import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserRole } from '../hooks/useUserRole';

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
  richDescription: string;
  category: string;
  venue: string;
  address: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  imageUrl: string;
  schedule: ScheduleItem[];
  producer: string;
  isActive: boolean;
}

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { hasAnyRole } = useUserRole();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<{ date: string; time: string } | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/events/${id}`);
      setEvent(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch event');
    } finally {
      setLoading(false);
    }
  };

  const handleBookTicket = () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    if (!selectedSchedule) {
      setError('Por favor seleccioná una fecha y horario');
      return;
    }

    navigate(`/events/${id}/purchase`, { 
      state: { 
        selectedSchedule,
        ticketQuantity
      } 
    });
  };

  const getAvailableTickets = (scheduleItem: ScheduleItem) => {
    return scheduleItem.tickets - scheduleItem.ticketsSold;
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">Cargando...</div>;
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-blue-500 hover:text-blue-700"
        >
          ← Volver a Eventos
        </button>
        {hasAnyRole(['producer', 'admin']) && (
          <button
            onClick={() => navigate(`/events/edit/${id}`)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Editar Evento
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-44 md:h-56 bg-gray-200">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {event.category}
                </span>
                <span>{event.city}, {event.country}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {event.currency} {event.price}
              </div>
              <div className="text-sm text-gray-600">por entrada</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Lugar</h3>
              <p className="text-gray-700">{event.venue}</p>
              <p className="text-gray-600">{event.address}</p>
              <p className="text-gray-600">{event.city}, {event.country}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Sobre este evento</h3>
            <p className="text-gray-700 mb-4">{event.description}</p>
            <div 
              className="text-gray-700 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: event.richDescription }}
            />
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Fechas y Horarios Disponibles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.schedule.map((item, index) => {
                const available = getAvailableTickets(item);
                const isDisabled = available === 0;
                
                return (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedSchedule?.date === item.date && selectedSchedule?.time === item.time
                        ? 'border-blue-500 bg-blue-50'
                        : isDisabled
                        ? 'border-gray-200 bg-gray-50 opacity-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => !isDisabled && setSelectedSchedule({ date: item.date, time: item.time })}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {new Date(item.date).toLocaleDateString('es-AR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-gray-600">{item.time}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${available < 10 ? 'text-red-600' : 'text-green-600'}`}>
                          {available} entradas disponibles
                        </div>
                        <div className="text-sm text-gray-600">
                          de {item.tickets} totales
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {selectedSchedule && (
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold">Fecha y Hora Seleccionada</h4>
                  <p className="text-gray-600">
                    {new Date(selectedSchedule.date).toLocaleDateString('es-AR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} a las {selectedSchedule.time}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <span>Cantidad:</span>
                    <select
                      value={ticketQuantity}
                      onChange={(e) => setTicketQuantity(parseInt(e.target.value))}
                      className="border rounded px-3 py-1"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </label>
                  <div className="text-xl font-bold">
                    Total: {event.currency} {(event.price * ticketQuantity).toFixed(2)}
                  </div>

                </div>
              </div>

              <button
                onClick={handleBookTicket}
                className="w-full md:w-auto px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Comprar Entradas
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
