import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { AuthCenteredLayout } from 'src/layouts/auth-centered';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

/** **************************************
 * Msal
 *************************************** */
const Msal = {
  SignInPage: lazy(() => import('src/pages/auth/msal/sign-in')),
  // SignUpPage: lazy(() => import('src/pages/auth/jwt/sign-up')),
};

const authMsal = {
  path: 'msal',
  children: [
    {
      path: 'sign-in',
      element: (
        <GuestGuard>
          <Msal.SignInPage />
        </GuestGuard>
      ),
    },
    // {
    //   path: 'sign-up',
    //   element: (
    //     <GuestGuard>
    //       <AuthSplitLayout>
    //         <Jwt.SignUpPage />
    //       </AuthSplitLayout>
    //     </GuestGuard>
    //   ),
    // },
  ],
};

// ----------------------------------------------------------------------

export const authRoutes: RouteObject[] = [
  {
    path: 'auth',
    element: (
      <AuthCenteredLayout>
        <Outlet />
      </AuthCenteredLayout>
    ),
    children: [authMsal],
  },
];
