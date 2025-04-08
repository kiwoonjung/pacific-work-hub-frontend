import { useMemo, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useSetState } from 'minimal-shared/hooks';

import { AuthContext } from '../auth-context';

import type { AuthState } from '../../types';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
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
          setState({
            user: {
              id: account.homeAccountId,
              email: account.username,
              displayName: account.name,
              role: 'admin',
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
