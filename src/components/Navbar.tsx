import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./auth/LoginButton";
import LogoutButton from "./auth/LogoutButton";
import Profile from "./auth/Profile";
import { useUserRole } from "../hooks/useUserRole";

export default function Navbar() {
  const { isAuthenticated } = useAuth0();
  const { isAdmin, isProducer, loading } = useUserRole();
  const navigate = useNavigate();

  if (loading) {
    return (
      <nav style={{ padding: "1rem", background: "#222", color: "#fff" }}>
        <div>Cargando...</div>
      </nav>
    );
  }

  return (
    <nav style={{ padding: "1rem", background: "#222", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <Link to="/" style={{ color: "#fff", marginRight: "1rem" }}>Eventos</Link>
        {(isProducer() || isAdmin()) && (
          <Link to="/events/create" style={{ color: "#fff", marginRight: "1rem" }}>Crear Evento</Link>
        )}
        {isAuthenticated && <Link to="/my-tickets" style={{ color: "#fff", marginRight: "1rem" }}>Mis Entradas</Link>}
        <Link to="/producers" style={{ color: "#fff", marginRight: "1rem" }}>Productores</Link>
        {(isProducer() || isAdmin()) && (
          <Link to="/validate" style={{ color: "#fff", marginRight: "1rem" }}>Validar Entradas</Link>
        )}
        {isAdmin() && <Link to="/admin" style={{ color: "#fff", marginRight: "1rem" }}>Panel Admin</Link>}
        {isAdmin() && <Link to="/producers/create" style={{ color: "#fff" }}>Crear Productor</Link>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {isAuthenticated ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <button
                onClick={() => navigate('/profile')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <Profile />
              </button>
              <LogoutButton />
            </div>
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </nav>
  );
}
