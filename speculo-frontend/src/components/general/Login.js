import axios from '../../axios.js';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  PasswordInput,
  TextInput,
  Title,
  Button,
  useMantineColorScheme,
  useMantineTheme,
  Container,
} from '@mantine/core';
import Gavel from '../../images/gavel.png';
// use the checkbox with images ui for signing up usertypes

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const navigate = useNavigate();

  useEffect(() => {
    if (
      localStorage.getItem('token') !== null &&
      localStorage.getItem('token') !== 'undefined'
    ) {
      navigate('/profile');
    }
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', res.data.user.email);
      localStorage.setItem('_id', res.data.user._id);
      localStorage.setItem('name', res.data.user.name);
      localStorage.setItem('userType', res.data.user.userType);
      navigate('/profile');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container>
      <div className="flex flex-column align-items-center">
        <Title className="text-center mt-3" order={1}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span
              style={{
                color:
                  colorScheme === 'dark'
                    ? theme.colors.green[3]
                    : theme.colors.green[7],
              }}
            >
              legal
            </span>
            <span
              style={{
                color:
                  colorScheme === 'dark'
                    ? theme.colors.gray[4]
                    : theme.colors.dark[9],
              }}
            >
              Tracker
            </span>
          </Link>
        </Title>
        <Card className="mt-8 w-10" shadow="xl">
          <Card.Section className="flex">
            <img className="mx-auto w-1 m-4" src={Gavel}></img>
          </Card.Section>
          <Title
            style={{
              color:
                colorScheme === 'dark'
                  ? theme.colors.green[3]
                  : theme.colors.green[7],
            }}
            order={1}
          >
            Login
          </Title>
          <form className="flex flex-column" onSubmit={handleLogin}>
            <TextInput
              className="mt-3"
              label="Email"
              required
              onChange={(e) => setEmail(e.currentTarget.value)}
              type="email"
            ></TextInput>
            <PasswordInput
              className="mt-3"
              label="Password"
              required
              onChange={(e) => setPassword(e.currentTarget.value)}
              type="password"
            ></PasswordInput>
            <Button className="mt-6 mx-auto" color="green" type="submit">
              Login
            </Button>
            <Button
              color="green"
              component={Link}
              to="/register"
              className="mt-3 mx-auto"
              variant="outline"
            >
              Don't have an account? Register.
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}

// emailid, password
// /signup, /login

// token
// authori

// 1. User fills out form.
// 2. POST to /login with email and pwd.
// 3. Do your firebase stuff, and return a token.
// 4. I'll recieve the token, and basically use that to authorize further requests.
