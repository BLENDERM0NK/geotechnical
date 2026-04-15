// Login.styles.js
import styled from 'styled-components';

export const Container = styled.div`
  text-align: center;
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
`;

export const Title = styled.h2`
  color: #1e293b;
  margin-bottom: 1.5rem;
`;

export const Input = styled.input`
  width: 250px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`;

export const Button = styled.button`
  width: 260px;
  padding: 0.6rem;
  margin-top: 0.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  color: white;
  background-color: ${({ google }) => (google ? '#db4437' : '#2563eb')};

  &:hover {
    background-color: ${({ google }) => (google ? '#c23321' : '#1e40af')};
  }
`;

export const Text = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
`;

export const Link = styled.a`
  color: #2563eb;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
