import { CONFIG } from 'src/global-config';

import { ProduceListView } from 'src/sections/pfp/produce/view/produce-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Produce List | PFP - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ProduceListView />
    </>
  );
}
