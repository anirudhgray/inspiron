import React, { useState } from 'react';
import { MediaQuery, Drawer, Button } from '@mantine/core';
import Sidebar from './Sidebar';
import { HamburgerMenuIcon } from '@modulz/radix-icons';

export default function SidebarMechanism() {
  const [sidebarOpened, setSidebarOpened] = useState(false);
  return (
    <>
      <MediaQuery smallerThan="sm" className="p-0" styles={{ display: 'none' }}>
        <div className="lg:col-3 md:col-4">
          <Sidebar></Sidebar>
        </div>
      </MediaQuery>
      <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
        <div>
          <Drawer
            opened={sidebarOpened}
            onClose={() => setSidebarOpened(false)}
          >
            <Sidebar></Sidebar>
          </Drawer>
          <Button
            color="green"
            variant="filled"
            className="fixed z-5 top-0 left-0 m-3 px-3"
            onClick={() => setSidebarOpened(true)}
          >
            <HamburgerMenuIcon />
          </Button>
        </div>
      </MediaQuery>
    </>
  );
}
