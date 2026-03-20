import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole';

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  producer: 'Productor',
  client: 'Cliente',
};

const roleBadgeColor: Record<string, string> = {
  admin: 'bg-red-100 text-red-800',
  producer: 'bg-purple-100 text-purple-800',
  client: 'bg-blue-100 text-blue-800',
};

export default function ProfilePage() {
  const { user } = useAuth0();
  const { userProfile, loading } = useUserRole();
  const navigate = useNavigate();

  if (loading) {
    return <div className="max-w-lg mx-auto p-6">Cargando perfil...</div>;
  }

  if (!user) {
    return <div className="max-w-lg mx-auto p-6">No autenticado</div>;
  }

  const role = userProfile?.role ?? 'client';

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-900 h-24" />
        <div className="px-6 pb-6">
          <div className="-mt-12 mb-4">
            <img
              src={user.picture || ''}
              alt={user.name || 'Usuario'}
              className="w-24 h-24 rounded-full border-4 border-white object-cover shadow"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${roleBadgeColor[role] ?? 'bg-gray-100 text-gray-700'}`}>
              {roleLabels[role] ?? role}
            </span>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/my-tickets')}
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-700 transition-colors"
            >
              Ver Mis Entradas
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              Ir a Eventos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
