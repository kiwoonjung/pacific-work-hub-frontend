import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { fetcher, endpoints } from 'src/lib/axios';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProduceNewEditForm } from '../produce-new-edit-form';

// ----------------------------------------------------------------------

export function ProduceEditView() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      if (!id) return null;
      return fetcher(`${endpoints.pfp.produce}/${id}`);
    },
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Something went wrong.</div>;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit a produce"
        links={[{ name: 'Pacific Fresh Produce' }, { name: 'Produce' }, { name: 'Edit' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProduceNewEditForm currentProduce={data.data} />
    </DashboardContent>
  );
}
