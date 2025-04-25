import { useMemo, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useSetState } from 'minimal-shared/hooks';

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

          const firstLetter = userData.displayName?.charAt(0).toUpperCase() || '?';
          const email = extractEmail(userData.mail || userData.userPrincipalName);

          setState({
            user: {
              id: account.homeAccountId,
              email,
              displayName: userData.displayName,
              role: 'admin',
              photoURL, // fetched photo blob URL
              firstLetter,
              jobTitle: userData.jobTitle || null,
              department: userData.department || null,
              companyName: userData.companyName || null,
              officeLocation: userData.officeLocation || null,
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
