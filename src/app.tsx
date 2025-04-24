import 'src/global.css';

import { useState, useEffect } from 'react';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { usePathname } from 'src/routes/hooks';

import { msalConfig } from 'src/authConfig';
import { themeConfig, ThemeProvider } from 'src/theme';

import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SnackbarProvider } from 'src/components/snackbar/snackbar-context';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { MsalAuthProvider } from 'src/auth/context/msal/auth-provider';
import { MsalRedirectHandler } from 'src/auth/view/msal/msal-redirect-handler';

// ----------------------------------------------------------------------

interface AppProps {
  children: React.ReactNode;
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App({ children }: AppProps) {
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);

  useEffect(() => {
    const initializeMsal = async () => {
      const msal = new PublicClientApplication(msalConfig);
      await msal.initialize();
      setMsalInstance(msal);
    };

    initializeMsal();
  }, []);

  useScrollToTop();

  if (!msalInstance) {
    return null; // or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <MsalProvider instance={msalInstance}>
        <MsalAuthProvider>
          <SettingsProvider defaultSettings={defaultSettings}>
            <ThemeProvider
              modeStorageKey={themeConfig.modeStorageKey}
              defaultMode={themeConfig.enableSystemMode ? 'system' : themeConfig.defaultMode}
            >
              <SnackbarProvider>
                <MotionLazy>
                  <ProgressBar />
                  <SettingsDrawer defaultSettings={defaultSettings} />
                  <MsalRedirectHandler />
                  {children}
                </MotionLazy>
              </SnackbarProvider>
            </ThemeProvider>
          </SettingsProvider>
        </MsalAuthProvider>
      </MsalProvider>
    </QueryClientProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
