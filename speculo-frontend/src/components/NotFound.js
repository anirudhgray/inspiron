import React from 'react';
import SidebarMechanism from './helper/SidebarMechanism';
import NotFoundExternal from './NotFoundExternal';

export default function NotFound() {
  return (
    <div className="grid h-full">
      <SidebarMechanism />
      <div className="lg:col-9 md:col-8 col-12">
        <NotFoundExternal />
      </div>
    </div>
  );
}
