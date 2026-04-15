import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, db } from '../firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import {
  Container,
  Card,
  Title,
  Subtitle,
  Form,
  Input,
  Button,
  Divider,
  ToggleText,
  ToggleButton,
  LoadingSpinner
} from './AuthPage.styles';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const registerWithEmail = async (e) => {
    e?.preventDefault();
    
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Attempting to create user...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created:', user.uid);

      // Make Firestore write non-blocking with timeout
      const firestorePromise = setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        method: 'email',
        createdAt: new Date().toISOString(),
      }).catch(err => {
        console.error('Firestore error (non-blocking):', err);
      });

      // Set a timeout for Firestore operation (5 seconds max)
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          console.log('Firestore write timeout - continuing anyway');
          resolve();
        }, 5000);
      });

      // Don't block navigation on Firestore write
      Promise.race([firestorePromise, timeoutPromise]).catch(err => {
        console.error('Firestore operation error:', err);
      });

      // Navigate immediately after user creation
      console.log('Navigating to dashboard...');
      navigate('/dashboard');
      
      // Reset loading state after a short delay to allow navigation
      setTimeout(() => {
        setLoading(false);
      }, 100);
      
    } catch (error) {
      console.error('Register error:', error.code, error.message);
      setLoading(false);
      
      let errorMessage = 'Registration failed';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please sign in instead.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled. Please contact support.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        default:
          errorMessage = error.message || 'Registration failed. Please try again.';
      }
      
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const loginWithEmail = async (e) => {
    e?.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      
      let errorMessage = 'Login failed';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please sign up first.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled. Please contact support.';
          break;
        default:
          errorMessage = error.message || 'Login failed. Please try again.';
      }
      
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          method: 'google',
          createdAt: new Date().toISOString(),
        }, { merge: true });
      } catch (firestoreError) {
        console.error('Firestore error:', firestoreError);
        // Don't fail the signin if Firestore write fails
      }

      alert('Signed in with Google!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error.code, error.message);
      
      // Handle popup closed by user gracefully
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('User closed the popup');
        // Silently return - user intentionally closed the popup
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups for this site and try again.');
        alert('Popup was blocked by your browser. Please allow popups for this site and try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.log('Popup request was cancelled');
      } else {
        setError(error.message || 'Google sign-in failed');
        alert(error.message || 'Google sign-in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      registerWithEmail(e);
    } else {
      loginWithEmail(e);
    }
  };

  return (
    <Container>
      <Card>
        <Title>{isSignUp ? 'Create Account' : 'Welcome Back'}</Title>
        <Subtitle>
          {isSignUp 
            ? 'Sign up to get started with your account' 
            : 'Sign in to continue to your account'}
        </Subtitle>
        
        {error && (
          <div style={{ 
            color: '#dc2626', 
            backgroundColor: '#fee2e2', 
            padding: '0.75rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}
        
        <Form as="form" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            required
            minLength={6}
          />
          
          <Button 
            type="submit"
            onClick={isSignUp ? registerWithEmail : loginWithEmail} 
            disabled={loading}
          >
            {loading && <LoadingSpinner />}
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
        </Form>

        <Divider>or</Divider>

        <Button 
          type="button"
          google 
          onClick={signInWithGoogle} 
          disabled={loading}
        >
          {loading && <LoadingSpinner />}
          {loading ? 'Processing...' : 'Continue with Google'}
        </Button>

        <ToggleText>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <ToggleButton 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }} 
            disabled={loading}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </ToggleButton>
        </ToggleText>
      </Card>
    </Container>
  );
}
