import React from 'react';
import { MediaQuery, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useMantineTheme, useMantineColorScheme } from '@mantine/core';

export default function PageTitle({ title, subtitle, titleLink }) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  return (
    <>
      <MediaQuery
        smallerThan="sm"
        styles={{ marginTop: '3.5rem', marginBottom: '2rem' }}
      >
        <div>
          <Title
            component={Link}
            to={titleLink ? titleLink : '#'}
            className="p-2"
            style={{ textDecoration: 'none' }}
            order={2}
          >
            {title}
          </Title>
          {subtitle ? (
            <Title
              style={{
                color:
                  colorScheme === 'dark'
                    ? theme.colors.green[3]
                    : theme.colors.green[7],
              }}
              className="p-2"
              color="grey"
              order={3}
            >
              {subtitle}
            </Title>
          ) : null}
        </div>
      </MediaQuery>
    </>
  );
}
