'use client';

import Dashboard from '@/components/Dashboard';
import DashboardGeo from '@/components/DashboardGeo';
import { getClientConfig, SEARCH_TYPES } from '@/config/client-config';

export default function Home() {
  const CLIENT_CONFIG = getClientConfig();

  return (
    <>
      {(CLIENT_CONFIG.SEARCH_TYPE.VALUE != SEARCH_TYPES.GEO_LOCATION.VALUE && CLIENT_CONFIG.SEARCH_TYPE.VALUE != SEARCH_TYPES.GEO_LOCATION_SEMANTIC.VALUE) &&
        <Dashboard></Dashboard>
      }
      {(CLIENT_CONFIG.SEARCH_TYPE.VALUE == SEARCH_TYPES.GEO_LOCATION.VALUE || CLIENT_CONFIG.SEARCH_TYPE.VALUE == SEARCH_TYPES.GEO_LOCATION_SEMANTIC.VALUE) &&
        <DashboardGeo></DashboardGeo>
      }
    </>
  );
}