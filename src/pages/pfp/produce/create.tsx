import { CONFIG } from 'src/global-config';

import { ProduceCreateView } from 'src/sections/pfp/produce/view/produce-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new produce | PFP - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ProduceCreateView />
    </>
  );
}
