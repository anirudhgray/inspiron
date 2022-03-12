import React from 'react';
import {
  Blockquote,
  Button,
  Container,
  MediaQuery,
  Text,
  Title,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { Link } from 'react-router-dom';

import axios from '../../axios.js';

export default function Landing() {
  const [data, setData] = useState(false);
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  useEffect(async () => {
    try {
      const res = await axios.get('/courtcases/count');
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <Container>
      <div className="flex flex-column align-items-center">
        <MediaQuery smallerThan="xs" styles={{ paddingTop: '2.5rem' }}>
          <Title className="text-center mt-3" order={1}>
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
            Tracker
          </Title>
        </MediaQuery>

        <Blockquote className="text-5xl my-8" cite="The Creators">
          The Legal Management system for the 21st century.
        </Blockquote>

        <div className="grid" style={{ gap: '1rem' }}>
          <Button
            component={Link}
            to="/login"
            size="lg"
            variant="filled"
            color="green"
          >
            {localStorage.getItem('token') !== null ? 'Enter' : 'Login'}
          </Button>
          <Button size="lg" variant="subtle" color="green">
            More Info
          </Button>
        </div>

        <div className="my-6 w-8 grid">
          <div className="col text-center">
            <Text
              style={{
                color:
                  colorScheme === 'dark'
                    ? theme.colors.green[3]
                    : theme.colors.green[7],
              }}
              className="text-8xl"
            >
              {data.completed}
            </Text>
            <Text className="text-3xl">Completed Cases</Text>
          </div>
          <div className="col text-center">
            <Text
              style={{
                color:
                  colorScheme === 'dark'
                    ? theme.colors.green[3]
                    : theme.colors.green[7],
              }}
              className="text-8xl"
            >
              {data.pending}
            </Text>
            <Text className="text-3xl">Pending Cases</Text>
          </div>
        </div>
      </div>
    </Container>
  );
}
