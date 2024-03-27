import {
    Footer,
    Navbar,
  } from '@/components';
  import React from 'react';
  import OverviewList from '@/components/OverviewList';

  export default function Overview() {
    return (
      <div className="h-full main_bg text-white overflow-hidden" id="top">
        <Navbar />
        <OverviewList />
        <Footer />
      </div>
    );
  };
  