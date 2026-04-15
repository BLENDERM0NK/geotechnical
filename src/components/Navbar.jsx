// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [user, setUser] = useState(null);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Clean up on unmount
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth'); // Navigate to auth page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav style={styles.navbar}>
      <h3 style={styles.title}>Engineering Tools</h3>
      {user && (
        <div style={styles.userSection}>
          <span style={styles.email}>{user.email}</span>
          <button onClick={handleLogout} style={styles.button}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#0077cc',
    color: '#fff',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  email: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#fff',
  },
  button: {
    backgroundColor: '#fff',
    color: '#0077cc',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Navbar;
