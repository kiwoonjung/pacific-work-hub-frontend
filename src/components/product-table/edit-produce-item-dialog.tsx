import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'src/components/snackbar/snackbar-context';
import CloseIcon from '@mui/icons-material/Close';
import {
  Grid,
  Button,
  Dialog,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  IconButton,
  DialogTitle,
  FormControl,
  Autocomplete,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import sizeList from 'src/assets/data/pfp/size-list';
import originList from 'src/assets/data/pfp/origin-list';
import commonNameList from 'src/assets/data/pfp/common-name-list';
import typeOfPackageList from 'src/assets/data/pfp/type-of-package-list';
import scientificNameList from 'src/assets/data/pfp/scientific-name-list';

import { fetcher, endpoints } from 'src/lib/axios';

type Props = {
  endpoint: string;
  open: boolean;
  onClose: () => void;
  item: any | null;
};

export default function EditProduceItemDialog({ open, onClose, item, endpoint }: Props) {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    register,
    reset,

    watch,
  } = useForm();

  // Watch values for controlled Autocompletes
  const watchFields = watch([
    'common_name',
    'origin',
    'size',
    'scientific_name',
    'type_of_package',
  ]);

  useEffect(() => {
    if (open && item) {
      reset({
        item_no: item.item_no || '',
        common_name: item.common_name || '',
        weight: item.weight || '',
        unit: item.unit || '',
        origin: item.origin || '',
        size: item.size || '',
        type_of_package: item.type_of_package || '',
        scientific_name: item.scientific_name || '',
      });
    }
  }, [item, open, reset]);
  // const watchCommonName = watch('common__name');

  const createMutation = useMutation({
    mutationFn: (payload: any) =>
      fetcher([endpoints.produce.update, { method: 'PUT', data: payload }]),
    onSuccess: (data) => {
      // Update the cache with the new data
      queryClient.setQueryData(['produceItems', endpoint], data);
      setLoading(false);
      onClose();
      showSnackbar('Item updated successfully!', 'success');
    },
    onError: (error: any) => {
      setLoading(false);
      console.error('Failed to update produce item:', error.response?.data || error.message);
      showSnackbar(
        'Failed to create item: ' + (error.response?.data?.error || error.message),
        'error'
      );
    },
  });

  const onSubmit = async (data: any, event?: React.BaseSyntheticEvent) => {
    setLoading(true);
    try {
      console.log(data);
      event?.preventDefault();
      const payload = {
        id: item.id, // or whatever unique identifier you need to update
        item_no: data.item_no,
        common_name: data.common_name,
        weight: data.weight + ' ' + data.unit,
        origin: data.origin,
        size: data.size,
        scientific_name: data.scientific_name,
        type_of_package: data.type_of_package,
      };

      await createMutation.mutateAsync(payload); // this calls your PUT API
      // await your API call or data processing
      onClose();
    } catch (error) {
      // handle error (optionally show snackbar)
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={(event, reason) => {
        if (!loading && reason !== 'backdropClick') {
          onClose();
        }
      }}
    >
      <DialogTitle>Edit Produce Item</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="item_no"
            label="Item No"
            fullWidth
            variant="standard"
            {...register('item_no', { required: true })}
            error={!!errors.item_no}
            helperText={errors.item_no ? 'Item number is required' : ''}
          />

          <Autocomplete
            sx={{ marginTop: 2 }}
            fullWidth
            options={commonNameList}
            value={commonNameList.find((opt) => opt.label === watchFields[0]) || null}
            onChange={(_, newValue) => setValue('common_name', newValue?.label || '')}
            renderInput={(params) => (
              <TextField {...params} label="Common Name" variant="standard" required />
            )}
          />

          <Grid container spacing={2} sx={{ marginTop: 2, alignItems: 'center' }}>
            <Grid size={6}>
              <Autocomplete
                fullWidth
                options={originList}
                value={originList.find((opt) => opt.label === watchFields[1]) || null}
                onChange={(_, newValue) => setValue('origin', newValue?.label || '')}
                renderInput={(params) => (
                  <TextField {...params} label="Origin" variant="standard" />
                )}
              />
            </Grid>

            <Grid size={3}>
              <TextField
                sx={{ marginBottom: 1 }}
                margin="dense"
                id="weight"
                label="Weight"
                variant="standard"
                fullWidth
                value={watch('weight') || ''}
                {...register('weight')}
              />
            </Grid>

            <Grid size={3}>
              <FormControl variant="standard" fullWidth>
                <InputLabel id="unit-label">Unit</InputLabel>
                <Select
                  labelId="unit-label"
                  id="unit"
                  {...register('unit')}
                  value={watch('unit') || ''}
                  onChange={(e) => setValue('unit', e.target.value)}
                >
                  <MenuItem value="kg">KG</MenuItem>
                  <MenuItem value="lbs">LBS</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Autocomplete
            sx={{ marginTop: 2 }}
            fullWidth
            options={sizeList}
            value={sizeList.find((opt) => opt.label === watchFields[2]) || null}
            onChange={(_, newValue) => setValue('size', newValue?.label || '')}
            renderInput={(params) => <TextField {...params} label="Size" variant="standard" />}
          />

          <Autocomplete
            sx={{ marginTop: 2 }}
            options={scientificNameList}
            value={scientificNameList.find((opt) => opt.label === watchFields[3]) || null}
            onChange={(_, newValue) => setValue('scientific_name', newValue?.label || '')}
            renderInput={(params) => (
              <TextField {...params} label="Scientific Name" variant="standard" />
            )}
          />

          <Autocomplete
            sx={{ marginTop: 2 }}
            fullWidth
            options={typeOfPackageList}
            value={typeOfPackageList.find((opt) => opt.label === watchFields[4]) || null}
            onChange={(_, newValue) => setValue('type_of_package', newValue?.label || '')}
            renderInput={(params) => (
              <TextField {...params} label="Type of Package" variant="standard" />
            )}
          />

          <DialogActions>
            <Button variant="outlined" color="error" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              type="submit"
              disabled={loading || !watch('item_no')?.trim() || !watch('common_name')?.trim()}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Saving...' : 'Confirm'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
