import type { SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Autocomplete,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import sizeList from 'src/assets/data/size-list';
import originList from 'src/assets/data/origin-list';
import typeOfPackage from 'src/assets/data/type-of-package-list';
import scientificNameList from 'src/assets/data/scientific-name-list';

import api from 'src/utils/axios';

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

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      item_no: itemNo,
      common_name: commonName,
      origin,
      size,
      weight: weight + ' ' + unit,
      scientific_name: scientificName,
      package_type: packageType,
    };

    console.log('payload', payload);

    try {
      const response = await api.post('/produce-items', payload);
      console.log('Created item:', response.data);
      handleClose();
    } catch (err: any) {
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
      <Dialog open={open} onClose={handleClose}>
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
            <TextField
              required
              margin="dense"
              id="common_name"
              name="common_name"
              label="Common Name"
              fullWidth
              variant="standard"
              value={commonName}
              onChange={(e) => setCommonName(e.target.value)}
            />

            <Box sx={{ display: 'flex', gap: 2, marginTop: 2, alignItems: 'center' }}>
              <FormControl sx={{ flex: 1 }} variant="standard">
                <Autocomplete
                  options={originList}
                  value={origin ? { label: origin } : null}
                  onChange={(_, newValue) => setOrigin(newValue?.label || '')}
                  isOptionEqualToValue={(option, value) => option.label === value.label}
                  renderInput={(params) => (
                    <TextField {...params} label="Origin" variant="standard" />
                  )}
                />
              </FormControl>

              <TextField
                margin="dense"
                id="weight"
                name="weight"
                label="Weight"
                variant="standard"
                sx={{ width: 50, paddingBottom: 0.3 }}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />

              <FormControl variant="standard" sx={{ minWidth: 80 }}>
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
            </Box>

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
            <Button variant="contained" color="success" type="submit">
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
