import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import PileCalculator from './components/PileCalculator';
import ShallowFoundation from './pages/ShallowFoundation';
import SoilProfile from './pages/SoilProfile';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ paddingBottom: '3rem' }}>
          <Routes>
            {/* ✅ Public Route (Login / Signup) */}
            <Route path="/auth" element={<AuthPage />} />

            {/* ✅ Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pile-calculator"
              element={
                <ProtectedRoute>
                  <PileCalculator />
                </ProtectedRoute>
              }
            />

            <Route
              path="/shallow-foundation"
              element={
                <ProtectedRoute>
                  <ShallowFoundation />
                </ProtectedRoute>
              }
            />

            <Route
              path="/soil-profile"
              element={
                <ProtectedRoute>
                  <SoilProfile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
