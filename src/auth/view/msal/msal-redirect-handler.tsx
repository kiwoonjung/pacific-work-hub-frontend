import { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';

export function MsalRedirectHandler() {
  const { instance } = useMsal();

  useEffect(() => {
    const handleRedirect = async () => {
      // Only process redirect if we're in the middle of an interaction
      if (instance.getActiveAccount() || instance.getAllAccounts().length > 0) {
        console.log('Skipping redirect handling - already authenticated');
        return;
      }

      try {
        console.log('Checking for redirect response...');
        const response = await instance.handleRedirectPromise();
        if (response) {
          console.log('Successfully handled redirect:', response);
          instance.setActiveAccount(response.account);
        } else {
          console.log('No redirect response to handle');
        }
      } catch (error) {
        console.error('Error handling redirect:', error);
      }
    };

    // Only run on mount
    handleRedirect();
  }, [instance]);

  return null;
}
