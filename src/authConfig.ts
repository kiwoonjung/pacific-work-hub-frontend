import type { PopupRequest, Configuration } from '@azure/msal-browser';

import { LogLevel } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${(
      import.meta.env.VITE_MSAL_TENANT_ID as string
    ).replace('https://', '')}`,
    redirectUri: import.meta.env.VITE_MSAL_REDIRECT_URL as string,
    postLogoutRedirectUri: '/',
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean): void => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            // console.error(message);
            break;
          case LogLevel.Info:
            // console.info(message);
            break;
          case LogLevel.Verbose:
            // console.debug(message);
            break;
          case LogLevel.Warning:
            // console.warn(message);
            break;
          default:
            // console.log(message); // Or leave empty if no action is needed
            break;
        }
      },
      piiLoggingEnabled: false,
    },
    windowHashTimeout: 60000,
    loadFrameTimeout: 6000,
    navigateFrameWait: 500,
  },
};

export const loginRequest: PopupRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read'],
  prompt: 'select_account',
  extraQueryParameters: {
    response_mode: 'fragment',
    response_type: 'id_token token',
  },
};

// Optional silent SSO
// export const silentRequest: SilentRequest = {
//   scopes: ['openid', 'profile'],
//   loginHint: 'example@domain.net',
// };
