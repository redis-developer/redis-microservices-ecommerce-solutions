'use client';

import Dashboard from '@/components/Dashboard';
import DashboardGeo from '@/components/DashboardGeo';
import { CLIENT_CONFIG, SEARCH_TYPES } from '@/config/client-config';

export default function Home() {

  return (
    <>
      {CLIENT_CONFIG.SEARCH_TYPE.VALUE != SEARCH_TYPES.GEO_LOCATION.VALUE &&
        <Dashboard></Dashboard>
      }
      {CLIENT_CONFIG.SEARCH_TYPE.VALUE == SEARCH_TYPES.GEO_LOCATION.VALUE &&
        <DashboardGeo></DashboardGeo>
      }
    </>
  );
}