import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { useState } from 'react';
import '/node_modules/primeflex/primeflex.css';

import {
  MantineProvider,
  ColorSchemeProvider,
  ActionIcon,
} from '@mantine/core';
import { SunIcon, MoonIcon, MagnifyingGlassIcon } from '@modulz/radix-icons';
import { Kbd } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';

import Landing from './components/general/Landing';
import NotFound from './components/NotFound';
import Login from './components/general/Login';
import Register from './components/general/Register';
import NotFoundExternal from './components/NotFoundExternal';
import UserPage from './components/UserPage';

import GuardedRoute from './components/helper/GuardedRoute';
import Guarded404 from './components/helper/Guarded404';
import GuardedJudge from './components/helper/GuardedJudge.js';

function App() {
  const [colorScheme, setColorScheme] = useState('dark');
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  const dark = colorScheme === 'dark';

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colors: {
            dark: [
              '#c6c6c1',
              '#b5b4af',
              '#a4a39c',
              '#939189',
              '#828077',
              '#6f6e66',
              '#373733',
              '#252422',
              '#4a4933',
              '#373733',
            ],
          },
          colorScheme,
        }}
        withGlobalStyles
      >
        <Router>
          <div className="App">
            <div
              className="fixed z-5 top-0 right-0 m-3 grid align-items-center"
              style={{ gap: '0.5rem' }}
            >
              <Kbd>Ctrl</Kbd> + <Kbd>J</Kbd>
              <ActionIcon
                variant="outline"
                color={dark ? 'yellow' : 'blue'}
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
                size="xl"
              >
                {dark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
              </ActionIcon>
            </div>
            <Routes>
              <Route
                path="*"
                element={
                  <Guarded404>
                    <NotFound />
                  </Guarded404>
                }
              />
              <Route path="/not-found" element={<NotFoundExternal />} />
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile"
                element={
                  <GuardedRoute>
                    <UserPage />
                  </GuardedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
