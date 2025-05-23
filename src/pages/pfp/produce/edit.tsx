import { CONFIG } from 'src/global-config';

import { ProduceEditView } from 'src/sections/pfp/produce/view/produce-edit-view';

// ----------------------------------------------------------------------

const metadata = { title: `Edit a produce | PFP - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ProduceEditView />
    </>
  );
}
