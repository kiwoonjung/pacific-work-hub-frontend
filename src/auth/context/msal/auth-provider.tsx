import { useMemo, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useSetState } from 'minimal-shared/hooks';

import axiosInstance from 'src/lib/axios';

import { AuthContext } from '../auth-context';

import type { AuthState } from '../../types';
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
          console.log('userData', userData);

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
              photoURL = URL.createObjectURL(blob);
            }
          } catch (err) {
            console.warn('Unable to fetch profile photo:', err);
          }

          const email = extractEmail(userData.mail || userData.userPrincipalName);
          const fullName = `${userData.givenName} ${userData.surname}`;
          const displayName = userData.givenName;
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
            full_name: fullName,
            display_name: displayName,
            photo_url: photoURL,
            job_title: jobTitle,
            department,
            role: 'employee', // Default role (adjust as needed)
          };

          // 🔹 Send user data to the backend for update or insert
          try {
            await axiosInstance.post('/api/user/create-user', userPayload);
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
    };

    checkUserSession();
  }, [accounts, instance, setState]);

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [state.user, status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
