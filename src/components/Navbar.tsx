import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./auth/LoginButton";
import LogoutButton from "./auth/LogoutButton";
import Profile from "./auth/Profile";
import { useUserRole } from "../hooks/useUserRole";

export default function Navbar() {
  const { isAuthenticated } = useAuth0();
  const { isAdmin, isProducer, loading } = useUserRole();

  if (loading) {
    return (
      <nav style={{ padding: "1rem", background: "#222", color: "#fff" }}>
        <div>Loading...</div>
      </nav>
    );
  }

  return (
    <nav style={{ padding: "1rem", background: "#222", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <Link to="/" style={{ color: "#fff", marginRight: "1rem" }}>Events</Link>
        {(isProducer() || isAdmin()) && (
          <Link to="/events/create" style={{ color: "#fff", marginRight: "1rem" }}>Create Event</Link>
        )}
        {isAuthenticated && <Link to="/my-tickets" style={{ color: "#fff", marginRight: "1rem" }}>My Tickets</Link>}
        <Link to="/producers" style={{ color: "#fff", marginRight: "1rem" }}>Producers</Link>
        {(isProducer() || isAdmin()) && (
          <Link to="/validate" style={{ color: "#fff", marginRight: "1rem" }}>Validate Tickets</Link>
        )}
        {isAdmin() && <Link to="/admin" style={{ color: "#fff", marginRight: "1rem" }}>Admin Dashboard</Link>}
        {isAdmin() && <Link to="/producers/create" style={{ color: "#fff" }}>Create Producer</Link>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {isAuthenticated ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Profile />
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