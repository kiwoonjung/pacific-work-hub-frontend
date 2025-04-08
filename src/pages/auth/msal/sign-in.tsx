import { CONFIG } from 'src/global-config';

import { CenteredSignInView } from 'src/auth/view/msal/centered-sign-in-view';

// ----------------------------------------------------------------------

const metadata = { title: `Sign in | Msal - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <CenteredSignInView />
    </>
  );
}
