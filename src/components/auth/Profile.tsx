import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="loading-text">Loading profile...</div>;
  }

  return (
    isAuthenticated && user ? (
      <img
        src={user.picture || ''}
        alt={user.name || 'Usuario'}
        title={user.name || user.email}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #555',
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    ) : null
  );
};

export default Profile;