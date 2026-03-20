import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

export default function EventGrid() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/events');
      setEvents(response.data.filter((event: Event) => event.isActive));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const getNextEventDate = (schedule: ScheduleItem[]) => {
    const futureDates = schedule
      .filter(item => new Date(item.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return futureDates[0];
  };

  const getAvailableTickets = (scheduleItem: ScheduleItem) => {
    return scheduleItem.tickets - scheduleItem.ticketsSold;
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.category.toLowerCase() === filter.toLowerCase();
  });

  const categories = [...new Set(events.map(event => event.category))];

  if (loading) {
    return <div className="px-6 py-6">Cargando eventos...</div>;
  }

  if (error) {
    return (
      <div className="px-6 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Próximos Eventos</h1>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filtrar por categoría:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No se encontraron eventos.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const nextDate = getNextEventDate(event.schedule);
            const available = nextDate ? getAvailableTickets(nextDate) : 0;
            
            return (
              <div
                key={event._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => navigate(`/events/${event._id}`)}
              >
                <div className="relative h-32 bg-gray-200">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                      {event.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="flex items-center mb-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.venue}, {event.city}
                    </div>
                    {nextDate && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(nextDate.date).toLocaleDateString('es-AR', {
                          month: 'short',
                          day: 'numeric'
                        })} a las {nextDate.time}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-green-600">
                      {event.currency} {event.price}
                    </div>
                    <div className={`text-sm font-medium ${
                      available < 10 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {available} disponibles
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
