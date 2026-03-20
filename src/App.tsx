import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventsPage from "./pages/EventsPage";
import Navbar from "./components/Navbar";
import './App.css'
import ProducersPage from "./pages/ProducersPage";
import CreateProducerPage from "./pages/CreateProducerPage";
import EditProducerPage from "./pages/EditProducerPage";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import TicketValidationPage from "./pages/TicketValidationPage";
import PaymentStatus from "./pages/PaymentStatus";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import TicketPurchase from "./components/TicketPurchase";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route 
          path="/events/:id/purchase" 
          element={
            <ProtectedRoute>
              <TicketPurchase />
            </ProtectedRoute>
          } 
        />
        <Route path="/payment/:status" element={<PaymentStatus />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route
          path="/events/create"
          element={
            <ProtectedRoute requiredRoles={['producer', 'admin']}>
              <CreateEventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/edit/:id"
          element={
            <ProtectedRoute requiredRoles={['producer', 'admin']}>
              <EditEventPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/my-tickets" 
          element={
            <ProtectedRoute>
              <MyTicketsPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/producers" element={<ProducersPage />} />
        <Route 
          path="/producers/create" 
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <CreateProducerPage />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/producers/edit/:id"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <EditProducerPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/validate"
          element={
            <ProtectedRoute requiredRoles={['producer', 'admin']}>
              <TicketValidationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App
