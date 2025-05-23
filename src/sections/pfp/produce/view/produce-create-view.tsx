import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProduceNewEditForm } from '../produce-new-edit-form';

// ----------------------------------------------------------------------

export function ProduceCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new produce"
        links={[{ name: 'Pacific Fresh Produce' }, { name: 'Produce' }, { name: 'Create' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProduceNewEditForm />
    </DashboardContent>
  );
}
