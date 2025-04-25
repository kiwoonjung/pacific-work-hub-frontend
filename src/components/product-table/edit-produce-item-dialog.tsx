import type { SelectChangeEvent } from '@mui/material/Select';

import * as React from 'react';
import { useState } from 'react';

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
} from '@mui/material';

import sizeList from 'src/assets/data/pfp/size-list';
import originList from 'src/assets/data/pfp/origin-list';
import commonNameList from 'src/assets/data/pfp/common-name-list';
import typeOfPackageList from 'src/assets/data/pfp/type-of-package-list';
import scientificNameList from 'src/assets/data/pfp/scientific-name-list';

import { useSnackbar } from 'src/components/snackbar/snackbar-context';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function EditProduceItemDialog({ open, onClose }: Props) {
  const { showSnackbar } = useSnackbar();

  const [itemNo, setItemNo] = useState('');
  const [commonName, setCommonName] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('');
  const [origin, setOrigin] = useState('');
  const [size, setSize] = useState('');
  const [typeOfPackage, setTypeOfPackage] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <Dialog
        fullWidth
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            onClose();
          }
        }}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const email = formJson.email;
              console.log(email);
              onClose();
            },
          },
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
          <TextField
            autoFocus
            required
            margin="dense"
            id="item_no"
            name="item_no"
            label="Item No"
            fullWidth
            variant="standard"
            value={itemNo}
            onChange={(e) => setItemNo(e.target.value)}
          />

          <Autocomplete
            sx={{ marginTop: 2 }}
            fullWidth
            options={commonNameList}
            value={commonName ? { label: commonName } : null}
            onChange={(_, newValue) => setCommonName(newValue?.label || '')}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            renderInput={(params) => (
              <TextField {...params} label="Common Name" variant="standard" required />
            )}
          />

          <Grid container spacing={2} sx={{ marginTop: 2, alignItems: 'center' }}>
            <Grid size={{ xs: 6 }}>
              <Autocomplete
                fullWidth
                options={originList}
                value={origin ? { label: origin } : null}
                onChange={(_, newValue) => setOrigin(newValue?.label || '')}
                isOptionEqualToValue={(option, value) => option.label === value.label}
                renderInput={(params) => (
                  <TextField {...params} label="Origin" variant="standard" />
                )}
              />
            </Grid>

            <Grid size={{ xs: 3 }}>
              <TextField
                margin="dense"
                id="weight"
                name="weight"
                label="Weight"
                variant="standard"
                fullWidth
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                sx={{ marginBottom: 1 }}
              />
            </Grid>

            <Grid size={{ xs: 3 }}>
              <FormControl variant="standard" fullWidth>
                <InputLabel id="unit-label">Unit</InputLabel>
                <Select
                  labelId="unit-label"
                  id="unit"
                  value={unit}
                  onChange={(e: SelectChangeEvent) => setUnit(e.target.value)}
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
            value={size ? { label: size } : null}
            onChange={(_, newValue) => setSize(newValue?.label || '')}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            renderInput={(params) => <TextField {...params} label="Size" variant="standard" />}
          />

          <Autocomplete
            sx={{ marginTop: 2 }}
            options={scientificNameList}
            value={scientificName ? { label: scientificName } : null}
            onChange={(_, newValue) => setScientificName(newValue?.label || '')}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            renderInput={(params) => (
              <TextField {...params} margin="dense" label="Scientific Name" variant="standard" />
            )}
          />

          <Autocomplete
            sx={{ marginTop: 2 }}
            fullWidth
            options={typeOfPackageList}
            value={typeOfPackage ? { label: typeOfPackage } : null}
            onChange={(_, newValue) => setTypeOfPackage(newValue?.label || '')}
            isOptionEqualToValue={(option, value) => option.label === value.label}
            renderInput={(params) => (
              <TextField {...params} label="Type of Package" variant="standard" />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="success" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
  );
}
