'use client';

import Dashboard from '@/components/Dashboard';
import DashboardGeo from '@/components/DashboardGeo';

const LANDING_PAGE = {
  DASHBOARD: "1",
  DASHBOARD_GEO: "2"
}

export default function Home() {
  let LANDING_PAGE_CODE = process.env.NEXT_PUBLIC_LANDING_PAGE_CODE || LANDING_PAGE.DASHBOARD;

  return (
    <>
      {LANDING_PAGE_CODE == LANDING_PAGE.DASHBOARD &&
        <Dashboard></Dashboard>
      }
      {LANDING_PAGE_CODE == LANDING_PAGE.DASHBOARD_GEO &&
        <DashboardGeo></DashboardGeo>
      }
    </>
  );
}