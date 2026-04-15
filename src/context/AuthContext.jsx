import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import PileCalculator from '../components/PileCalculator';
import ShallowFoundation from '../pages/ShallowFoundation';
import SoilProfile from '../pages/SoilProfile';
import Footer from '../components/Footer';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

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