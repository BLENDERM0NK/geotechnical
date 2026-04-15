// SignUp.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, provider, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Input, Button, Text, Link } from './SignUp.styles';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        method: 'email',
      });
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        method: 'google',
      });
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container>
      <Title>Sign Up</Title>
      <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <br />
      <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <br />
      <Button onClick={handleSignUp}>Sign Up</Button>
      <br />
      <Button google onClick={handleGoogleSignUp}>Sign Up with Google</Button>
      <Text>Already have an account? <Link href="/login">Login</Link></Text>
    </Container>
  );
};

export default SignUp;
