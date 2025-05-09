import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import AddIcon from '@mui/icons-material/Add';
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

import { fetcher, endpoints } from 'src/lib/axios';
import sizeList from 'src/assets/data/pfp/size-list';
import originList from 'src/assets/data/pfp/origin-list';
import commonNameList from 'src/assets/data/pfp/common-name-list';
import packageTypeList from 'src/assets/data/pfp/type-of-package-list';
import scientificNameList from 'src/assets/data/pfp/scientific-name-list';

import { useSnackbar } from 'src/components/snackbar/snackbar-context';

type Props = {
  endpoint: string;
};

export default function CreateProduceItemButton({ endpoint }: Props) {
  const [open, setOpen] = useState(false);
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    trigger,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      item_no: '',
      common_name: '',
      weight: '',
      weight_unit: '',
      origin: '',
      size: '',
      package_type: '',
      scientific_name: '',
    },
  });

  const weightValue = watch('weight');

  useEffect(() => {
    trigger('weight_unit');
  }, [weightValue, trigger]);

  const createMutation = useMutation({
    mutationFn: (payload: any) =>
      fetcher([endpoints.produce.create, { method: 'POST', data: payload }]),
    onSuccess: (data) => {
      // Update the cache with the new data
      queryClient.setQueryData(['produceItems', endpoint], data);
      setLoading(false);
      showSnackbar('Item created successfully!', 'success');
      handleClose();
    },
    onError: (error: any) => {
      setLoading(false);
      console.error('Failed to create produce item:', error.response?.data || error.message);
      showSnackbar(
        'Failed to create item: ' + (error.response?.data?.error || error.message),
        'error'
      );
    },
  });

  const handleClickOpen = () => {
    reset();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data: any) => {
    setLoading(true);

    const payload = {
      item_no: data.item_no,
      common_name: data.common_name,
      origin: data.origin,
      size: data.size,
      weight: data.weight === '' ? null : Number(data.weight),
      weight_unit: data.weight_unit,
      scientific_name: data.scientific_name,
      package_type: data.package_type,
    };

    createMutation.mutate(payload);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          position: 'absolute',
          top: -45,
          right: 0,
          zIndex: 9,
        }}
        onClick={handleClickOpen}
      >
        Create
      </Button>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
        fullWidth
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Create New Produce Item</DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
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
            <TextField
              autoFocus
              required
              margin="dense"
              id="item_no"
              label="Item No"
              fullWidth
              variant="standard"
              {...register('item_no', { required: 'Item number is required' })}
              error={!watch('item_no')?.trim()}
              helperText={!watch('item_no')?.trim() ? 'Item number is required' : ''}
            />

            <Autocomplete
              sx={{ marginTop: 2 }}
              fullWidth
              options={commonNameList}
              value={commonNameList.find((opt) => opt.label === watch('common_name')) || null}
              onChange={(_, newValue) => setValue('common_name', newValue?.label || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Common Name"
                  variant="standard"
                  required
                  error={!watch('common_name')?.trim()}
                  helperText={!watch('common_name')?.trim() ? 'Common name is required' : ''}
                />
              )}
            />

            <Grid container spacing={2} sx={{ marginTop: 2, alignItems: 'center' }}>
              <Grid size={{ xs: 6 }}>
                <Autocomplete
                  fullWidth
                  options={originList}
                  value={originList.find((opt) => opt.label === watch('origin')) || null}
                  onChange={(_, newValue) => setValue('origin', newValue?.label || '')}
                  renderInput={(params) => (
                    <TextField {...params} label="Origin" variant="standard" />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 3 }}>
                <TextField
                  margin="dense"
                  id="weight"
                  label="Weight"
                  variant="standard"
                  fullWidth
                  {...register('weight')}
                  sx={{ marginBottom: 1 }}
                  type="number"
                />
              </Grid>

              <Grid size={{ xs: 3 }}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="weight-unit-label">Unit</InputLabel>
                  <Select
                    labelId="weight-unit-label"
                    id="weight-unit"
                    {...register('weight_unit', {
                      validate: (value) => {
                        if (watch('weight') && !value) {
                          return 'Unit is required when weight is entered';
                        }
                        return true;
                      },
                    })}
                    value={watch('weight_unit') || ''}
                    onChange={(e) => {
                      setValue('weight_unit', e.target.value);
                      trigger('weight_unit');
                    }}
                    error={!!errors.weight_unit}
                  >
                    <MenuItem value="kg">KG</MenuItem>
                    <MenuItem value="lbs">LBS</MenuItem>
                  </Select>
                  {errors.weight_unit && (
                    <p style={{ color: 'red', fontSize: 12 }}>{errors.weight_unit.message}</p>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Autocomplete
              sx={{ marginTop: 2 }}
              fullWidth
              options={sizeList}
              value={sizeList.find((opt) => opt.label === watch('size')) || null}
              onChange={(_, newValue) => setValue('size', newValue?.label || '')}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              renderInput={(params) => <TextField {...params} label="Size" variant="standard" />}
            />

            <Autocomplete
              sx={{ marginTop: 2 }}
              options={scientificNameList}
              value={
                scientificNameList.find((opt) => opt.label === watch('scientific_name')) || null
              }
              onChange={(_, newValue) => setValue('scientific_name', newValue?.label || '')}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              renderInput={(params) => (
                <TextField {...params} margin="dense" label="Scientific Name" variant="standard" />
              )}
            />

            <Autocomplete
              sx={{ marginTop: 2 }}
              fullWidth
              options={packageTypeList}
              value={packageTypeList.find((opt) => opt.label === watch('package_type')) || null}
              onChange={(_, newValue) => setValue('package_type', newValue?.label || '')}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              renderInput={(params) => (
                <TextField {...params} label="Type of Package" variant="standard" />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              type="submit"
              disabled={loading || !watch('item_no')?.trim() || !watch('common_name')?.trim()}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Creating...' : 'Confirm'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
