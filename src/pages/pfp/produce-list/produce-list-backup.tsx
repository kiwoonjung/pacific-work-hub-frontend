import { CONFIG } from 'src/global-config';

import StickyHeadTable from 'src/components/product-table/sticky-head-list';

import { BlankView } from 'src/sections/blank/view';
// ----------------------------------------------------------------------

const metadata = { title: `Product List - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <BlankView title="Produe List">
        <StickyHeadTable />
      </BlankView>
    </>
  );
}
