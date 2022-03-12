import axios from '../../axios.js';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  PasswordInput,
  TextInput,
  Title,
  Button,
  useMantineColorScheme,
  useMantineTheme,
  NativeSelect,
  Container,
} from '@mantine/core';
import Gavel from '../../images/gavel.png';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [name, setName] = useState('');

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

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/users', {
        email,
        password,
        userType,
        name,
      });
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
            Register
          </Title>
          <form className="flex flex-column" onSubmit={handleRegister}>
            <TextInput
              className="mt-3"
              label="Name"
              required
              onChange={(e) => setName(e.currentTarget.value)}
              type="text"
            ></TextInput>
            <TextInput
              className="mt-3"
              label="Email"
              required
              onChange={(e) => setEmail(e.currentTarget.value)}
              type="email"
            ></TextInput>
            <NativeSelect
              className="mt-3"
              label="User Type"
              value={userType}
              required
              onChange={(event) => setUserType(event.currentTarget.value)}
              data={[
                'Public User',
                'Plaintiff',
                'Defendant',
                'Lawyer',
                'Judge',
              ]}
            />
            <PasswordInput
              className="mt-3"
              label="Password"
              required
              onChange={(e) => setPassword(e.currentTarget.value)}
              type="password"
            ></PasswordInput>
            <Button className="mt-6 mx-auto" color="green" type="submit">
              Register
            </Button>
            <Button
              color="green"
              component={Link}
              to="/login"
              className="mt-3 mx-auto"
              variant="outline"
            >
              Already have an account? Login.
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}
