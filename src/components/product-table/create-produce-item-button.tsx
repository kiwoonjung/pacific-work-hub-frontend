import type { SelectChangeEvent } from '@mui/material/Select';

import * as React from 'react';

import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Grid,
  Button,
  Dialog,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  DialogTitle,
  FormControl,
  Autocomplete,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { fetcher, endpoints } from 'src/lib/axios';
import useSWR, { mutate } from 'swr';

import sizeList from 'src/assets/data/pfp/size-list';
import originList from 'src/assets/data/pfp/origin-list';
import commonNameList from 'src/assets/data/pfp/common-name-list';
import typeOfPackageList from 'src/assets/data/pfp/type-of-package-list';
import scientificNameList from 'src/assets/data/pfp/scientific-name-list';

export default function CreateProduceItemButton() {
  const [open, setOpen] = React.useState(false);

  const [itemNo, setItemNo] = React.useState('');
  const [commonName, setCommonName] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [unit, setUnit] = React.useState('');
  const [origin, setOrigin] = React.useState('');
  const [size, setSize] = React.useState('');
  const [typeOfPackage, setTypeOfPackage] = React.useState('');
  const [scientificName, setScientificName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Fetch current list of produce items using SWR
  const { data, isLoading } = useSWR(endpoints.produce.list, fetcher);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemNo('');
    setCommonName('');
    setWeight('');
    setUnit('');
    setOrigin('');
    setSize('');
    setTypeOfPackage('');
    setScientificName('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const payload = {
      item_no: itemNo,
      common_name: commonName,
      origin,
      size,
      weight: weight + ' ' + unit,
      scientific_name: scientificName,
      type_of_package: typeOfPackage,
    };

    try {
      const response = await fetcher([endpoints.produce.create, { method: 'POST', data: payload }]);
      console.log('Created item:', response);
      setLoading(false);
      handleClose();

      // After creating the new item, update the SWR cache for produce list
      // This will re-fetch the produce items list
      mutate(endpoints.produce.list);
    } catch (err: any) {
      setLoading(false);
      console.error('Failed to create produce item:', err.response?.data || err.message);
    }
  };

  return (
    <React.Fragment>
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
        <form onSubmit={handleSubmit}>
          <DialogTitle>Create New Produce Item</DialogTitle>
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
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="success" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Confirm'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
