import { useMemo, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useSetState } from 'minimal-shared/hooks';

import axiosInstance from 'src/lib/axios';

import { AuthContext } from '../auth-context';

import type { AuthState } from '../../types';

import { loginRequest } from 'src/authConfig';
// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

const extractEmail = (email: string) => {
  // Handle Microsoft tenant email format (e.g., 'user_gmail.com#EXT#@domain.onmicrosoft.com')
  const match = email.match(/^([^#]+)#EXT#@/);
  if (match) {
    // Replace underscore with @ in the extracted part
    return match[1].replace('_', '@');
  }
  return email;
};

export function MsalAuthProvider({ children }: Props) {
  const { instance, accounts } = useMsal();
  const { state, setState } = useSetState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    const checkUserSession = async () => {
      let objectUrl: string | null = null;
      try {
        if (accounts.length > 0) {
          const account = accounts[0];
          instance.setActiveAccount(account);

          // Get access token for Microsoft Graph API
          let response;
          try {
            response = await instance.acquireTokenSilent({
              scopes: ['User.Read', 'User.ReadBasic.All'],
              account,
            });
          } catch (error) {
            // If silent token acquisition fails, try interactive
            response = await instance.acquireTokenPopup({
              scopes: ['User.Read', 'User.ReadBasic.All'],
              account,
            });
          }

          // Fetch user data from Microsoft Graph API
          const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: {
              Authorization: `Bearer ${response.accessToken}`,
            },
          });

          if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
          }

          const userData = await userResponse.json();

          // Try to fetch user's profile photo
          let photoURL = null;
          try {
            const photoResponse = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
              headers: {
                Authorization: `Bearer ${response.accessToken}`,
              },
            });

            if (photoResponse.ok) {
              const blob = await photoResponse.blob();
              objectUrl = URL.createObjectURL(blob);
              photoURL = objectUrl;
            }
          } catch (err) {
            console.warn('Unable to fetch profile photo:', err);
          }

          const email = extractEmail(
            userData.mail || userData.userPrincipalName
          ).toLocaleLowerCase();
          const fullName = `${userData.givenName} ${userData.surname}`;
          const displayName = userData.givenName;
          const firstName = userData.givenName;
          const lastName = userData.surname;
          const azureId = userData.id; // Use this as the primary key in DB
          const jobTitle = userData.jobTitle || null;
          // Determine department based on email domain
          let department = null;
          if (email.endsWith('@pacificfirstaid.ca')) {
            department = 'Pacific First Aid';
          } else if (email.endsWith('@pacificfreshproduce.com')) {
            department = 'Pacific Fresh Produce';
          }

          const userPayload = {
            azure_id: azureId,
            email,
            first_name: firstName,
            last_name: lastName,
            photo_url: photoURL,
            job_title: jobTitle,
            department,
          };

          // 🔹 Send user data to the backend for update or insert
          try {
            await axiosInstance.post('/api/users', userPayload);
          } catch (err) {
            console.error('Failed to sync user with backend:', err);
          }

          setState({
            user: {
              id: azureId,
              email,
              fullName,
              displayName,
              photoURL,
              jobTitle,
              department,
            },
            loading: false,
          });
        } else {
          setState({ user: null, loading: false });
        }
      } catch (error) {
        console.error(error);
        setState({ user: null, loading: false });
      }

      // 🔴 Cleanup: Revoke blob URL to avoid memory leak
      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    };

    const cleanup = checkUserSession();

    return () => {
      if (cleanup instanceof Function) {
        cleanup();
      }
    };

    checkUserSession();
  }, [accounts, instance, setState]);

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  const login = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    try {
      if (isMobile) {
        await instance.loginRedirect(loginRequest);
      } else {
        await instance.loginPopup(loginRequest);
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
    }),
    [state.user, status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
