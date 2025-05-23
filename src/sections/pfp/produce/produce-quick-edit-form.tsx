import type { IProduceItem } from 'src/types/produce';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { delay } from 'src/utils/delay';

import { fetcher, endpoints } from 'src/lib/axios';
import sizeList from 'src/assets/data/pfp/size-list';
import originList from 'src/assets/data/pfp/origin-list';
import packageTypeList from 'src/assets/data/pfp/type-of-package-list';
import scientificNameList from 'src/assets/data/pfp/scientific-name-list';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type ProduceQuickEditSchemaType = zod.infer<typeof ProduceQuickEditSchema>;

export const ProduceQuickEditSchema = zod
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
  open: boolean;
  onClose: () => void;
  currentProduce?: IProduceItem;
  onUpdateSuccess: () => void;
};

export function ProduceQuickEditForm({ currentProduce, open, onClose, onUpdateSuccess }: Props) {
  const queryClient = useQueryClient();
  const updateSiteMutation = useMutation({
    mutationFn: async (data: ProduceQuickEditSchemaType) => {
      await delay(800);
      return await fetcher([
        `${endpoints.pfp.produce}/${currentProduce!.id}`,
        {
          method: 'PUT',
          data,
        },
      ]);
    },
    onSuccess: () => {
      toast.success('Site updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['items'] }); // Adjust query key if different
      onUpdateSuccess();
    },
    onError: () => {
      toast.error('Failed to update site.');
    },
  });

  const defaultValues: ProduceQuickEditSchemaType = {
    item_no: '',
    common_name: '',
    origin: '',
    weight: '',
    weight_unit: '',
    size: '',
    scientific_name: '',
    package_type: '',
  };

  const methods = useForm<ProduceQuickEditSchemaType>({
    mode: 'all',
    resolver: zodResolver(ProduceQuickEditSchema),
    defaultValues,
    values: currentProduce,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (!currentProduce?.id) return;

    const toastId = toast.loading('Updating produce...');
    try {
      await updateSiteMutation.mutateAsync(data);
      toast.dismiss(toastId);
    } catch (error) {
      toast.dismiss(toastId);
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>Quick update</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              pt: 1,
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
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" loading={isSubmitting}>
            Update
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
