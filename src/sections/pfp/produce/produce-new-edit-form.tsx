import type { IProduceItem } from 'src/types/produce';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { delay } from 'src/utils/delay';

import { fetcher, endpoints } from 'src/lib/axios';
import sizeList from 'src/assets/data/pfp/size-list';
import originList from 'src/assets/data/pfp/origin-list';
import packageTypeList from 'src/assets/data/pfp/type-of-package-list';
import scientificNameList from 'src/assets/data/pfp/scientific-name-list';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
// ----------------------------------------------------------------------

export type NewProduceSchemaType = zod.infer<typeof NewProduceSchema>;

export const NewProduceSchema = zod
  .object({
    item_no: zod.string().min(1, { message: 'Item No is required!' }),
    common_name: zod.string().min(1, { message: 'Common Name is required!' }),
    origin: zod.string(),
    weight: zod.string().nullable().default(null),
    weight_unit: zod.string().optional(),
    size: zod.string(),
    scientific_name: zod.string(),
    package_type: zod.string(),
  })
  .refine(
    (data) => {
      if (data.weight !== undefined && data.weight !== null) {
        return !!data.weight_unit?.trim();
      }
      return true;
    },
    {
      message: 'Weight unit is required when weight is provided.',
      path: ['weight_unit'],
    }
  );

// ----------------------------------------------------------------------

type Props = {
  currentProduce?: IProduceItem;
};

export function ProduceNewEditForm({ currentProduce }: Props) {
  const router = useRouter();
  const confirmDialog = useBoolean();

  const defaultValues: NewProduceSchemaType = {
    item_no: '',
    common_name: '',
    origin: '',
    weight: null,
    weight_unit: '',
    size: '',
    scientific_name: '',
    package_type: '',
  };

  const methods = useForm<NewProduceSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewProduceSchema),
    defaultValues,
    values: currentProduce,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    const isEdit = Boolean(currentProduce?.id);
    const toastId = toast.loading(isEdit ? 'Updating produce...' : 'Creating produce...');
    try {
      await delay(800);
      await fetcher([
        isEdit ? `${endpoints.pfp.produce}/${currentProduce?.id}` : endpoints.pfp.produce,
        {
          method: isEdit ? 'PUT' : 'POST',
          data,
        },
      ]);

      toast.dismiss(toastId);
      toast.success(isEdit ? 'Update success!' : 'Create success!');
      router.push(paths.pfp.produce.list);
    } catch (error) {
      toast.dismiss(toastId);
      console.error(error);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} site. Please try again.`);
    }
  });

  const onDelete = async () => {
    if (!currentProduce?.id) return;

    const toastId = toast.loading('Deleting site...');
    try {
      await delay(800);
      await fetcher([`${endpoints.pfp.produce}/${currentProduce.id}`, { method: 'DELETE' }]);

      toast.dismiss(toastId);
      toast.success('Delete success!');
      router.push(paths.pfp.produce.list);
    } catch (error) {
      toast.dismiss(toastId);
      console.error(error);
      toast.error('Failed to delete the site.');
    }
  };

  const renderConfirmDialog = (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content="Are you sure you want to delete this produce item?"
      action={
        <Button
          variant="contained"
          color="error"
          onClick={async () => {
            confirmDialog.onFalse();
            await onDelete();
          }}
        >
          Delete
        </Button>
      }
    />
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 16, md: 12 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="item_no" label="Item No" />
              <Field.Text name="common_name" label="Common Name" />

              <Field.Autocomplete
                fullWidth
                name="origin"
                label="Origin"
                placeholder="Choose a origin"
                options={originList.map((option) => option.value)}
              />

              <Field.Autocomplete
                fullWidth
                name="size"
                label="Size"
                placeholder="Choose a size"
                options={sizeList.map((option) => option.value)}
              />

              <Field.Text name="weight" label="Weight" />
              <Field.Select name="weight_unit" label="Weight Unit">
                {['kg', 'lbs'].map((option) => (
                  <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
                    {option}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Autocomplete
                fullWidth
                name="scientific_name"
                label="Scientific Name"
                placeholder="Scientific Name"
                options={scientificNameList.map((option) => option.value)}
              />

              <Field.Autocomplete
                fullWidth
                name="package_type"
                label="Package Type"
                placeholder="Choose a package type"
                options={packageTypeList.map((option) => option.value)}
              />
            </Box>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 3 }}
            >
              {currentProduce && (
                <Button variant="soft" color="error" onClick={confirmDialog.onTrue}>
                  Delete site
                </Button>
              )}
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {!currentProduce ? 'Create produce' : 'Save changes'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
      {renderConfirmDialog}
    </Form>
  );
}
