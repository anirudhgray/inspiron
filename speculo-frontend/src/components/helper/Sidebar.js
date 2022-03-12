import { Button, Kbd, Title, Text } from '@mantine/core';
import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useMantineColorScheme, useMantineTheme } from '@mantine/core';
import axios from '../../axios.js';

export default function Sidebar() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${localStorage.getItem('token')}`;
      const res = await axios.post('/users/logout');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (e) {
      console.log(e);
      navigate('/login');
    }
  };

  return (
    <div
      style={{
        background: colorScheme === 'dark' ? `#343e2c` : theme.colors.gray[3],
      }}
      className={`flex flex-column align-items-center w-12 h-full`}
    >
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
      <Text className="mt-6">Logged in as {localStorage.getItem('email')}</Text>
      <Button
        onClick={handleLogout}
        className="w-full mt-2"
        variant="subtle"
        color="red"
      >
        Log Out
      </Button>
      <span className="mt-6">
        <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
      </span>
      <span>to navigate through the site.</span>
      <Button
        className="w-full mt-6"
        variant={location.pathname === '/profile' ? 'filled' : 'subtle'}
        color="green"
        component={Link}
        to="/profile"
      >
        Profile
      </Button>
      <Button
        className="w-full mt-1"
        variant={location.pathname === '/cases' ? 'filled' : 'subtle'}
        color="green"
        component={Link}
        to="/cases"
      >
        All Cases
      </Button>
      {localStorage.getItem('userType') === 'Judge' ? (
        <Button
          className="w-full mt-1"
          variant={location.pathname === '/registercase' ? 'filled' : 'subtle'}
          color="green"
          component={Link}
          to="/registercase"
        >
          Register Case
        </Button>
      ) : null}
    </div>
  );
}
