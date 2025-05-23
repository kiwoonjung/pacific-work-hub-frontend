import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';

// ----------------------------------------------------------------------

const ProduceListPage = lazy(() => import('src/pages/pfp/produce/list'));
const ProduceCreatePage = lazy(() => import('src/pages/pfp/produce/create'));
const EditProducePage = lazy(() => import('src/pages/pfp/produce/edit'));

// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

export const pfpRoutes: RouteObject[] = [
  {
    path: 'pfp',
    element: CONFIG.auth.skip ? dashboardLayout() : <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      {
        path: 'produces',
        children: [
          {
            path: 'list',
            element: <ProduceListPage />,
          },
          {
            path: 'create',
            element: <ProduceCreatePage />,
          },
          {
            path: 'edit/:id',
            element: <EditProducePage />,
          },
        ],
      },
    ],
  },
];
