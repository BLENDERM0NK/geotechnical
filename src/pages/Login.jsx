// Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Input, Button, Text, Link } from './Login.styles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container>
      <Title>Login</Title>
      <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <br />
      <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <br />
      <Button onClick={handleLogin}>Login</Button>
      <br />
      <Button google onClick={handleGoogleLogin}>Login with Google</Button>
      <Text>Don't have an account? <Link href="/">Sign Up</Link></Text>
    </Container>
  );
};

export default Login;
