import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';

// Pages
import Home from './pages/Home';
import Reservar from './pages/Reservar';
import AdminDashboard from './pages/AdminDashboard';
import EncargadoReservas from './pages/EncargadoReservas';
import Paquetes from './pages/Paquetes';
import ServiciosPage from './pages/Servicios';
import Galeria from './pages/Galeria';
import Menus from './pages/Menus';
import Disponibilidad from './pages/Disponibilidad';
import MisReservas from './pages/MisReservas';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" />;
  }

  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/catalogar" element={<Paquetes />} />
        <Route path="/servicios" element={<ServiciosPage />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/menus" element={<Menus />} />
        <Route path="/disponibilidad" element={<Disponibilidad />} />

        {/* Rutas Cliente / Staff */}
        <Route path="/reservar" element={
          <ProtectedRoute allowedRoles={['Cliente', 'Administrador', 'Encargado']}>
            <Reservar />
          </ProtectedRoute>
        } />
        <Route path="/mis-reservas" element={
          <ProtectedRoute allowedRoles={['Cliente', 'Administrador', 'Encargado']}>
            <MisReservas />
          </ProtectedRoute>
        } />

        {/* Rutas Admin */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['Administrador']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Rutas Encargado */}
        <Route path="/encargado" element={
          <ProtectedRoute allowedRoles={['Encargado', 'Administrador']}>
            <EncargadoReservas />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;