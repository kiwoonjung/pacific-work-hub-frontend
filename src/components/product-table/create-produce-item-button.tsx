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

import api from 'src/utils/axios';

import sizeList from 'src/assets/data/pfp/size-list';
import originList from 'src/assets/data/pfp/origin-list';
import commonNameList from 'src/assets/data/pfp/common-name-list';
import typeOfPackage from 'src/assets/data/pfp/type-of-package-list';
import scientificNameList from 'src/assets/data/pfp/scientific-name-list';

export default function CreateProduceItemButton() {
  const [open, setOpen] = React.useState(false);

  const [itemNo, setItemNo] = React.useState('');
  const [commonName, setCommonName] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [unit, setUnit] = React.useState('');
  const [origin, setOrigin] = React.useState('');
  const [size, setSize] = React.useState('');
  const [packageType, setPackageType] = React.useState('');
  const [scientificName, setScientificName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemNo('');
    setCommonName('');
    setWeight('');
    setUnit('');
    setOrigin('');
    setSize('');
    setPackageType('');
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
      package_type: packageType,
    };

    try {
      const response = await api.post('/pfp/produce/create-produce-itemsss', payload);
      console.log('Created item:', response.data);
      setLoading(false);
      handleClose();
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
                <TextField {...params} label="Common Name" variant="standard" />
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
              fullWidth
              options={typeOfPackage}
              value={packageType ? { label: packageType } : null}
              onChange={(_, newValue) => setPackageType(newValue?.label || '')}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              renderInput={(params) => (
                <TextField {...params} label="Type of Package" variant="standard" />
              )}
            />

            <Box sx={{ marginTop: 2 }}>
              <Autocomplete
                options={scientificNameList}
                value={scientificName ? { label: scientificName } : null}
                onChange={(_, newValue) => setScientificName(newValue?.label || '')}
                isOptionEqualToValue={(option, value) => option.label === value.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="dense"
                    label="Scientific Name"
                    variant="standard"
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="success" type="submit" loading={loading}>
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
