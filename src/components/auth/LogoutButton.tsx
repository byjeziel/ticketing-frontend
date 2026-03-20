import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className="px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;