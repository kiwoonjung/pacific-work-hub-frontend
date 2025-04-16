import * as React from 'react';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import AddIcon from '@mui/icons-material/Add';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';

import originList from 'src/assets/data/origin-list';
import sizeList from 'src/assets/data/size-list';
import typeOfPackage from 'src/assets/data/type-of-package-list';
import scientificNameList from 'src/assets/data/scientific-name-list';

export default function CreateProduceItemButton() {
  const [open, setOpen] = React.useState(false);
  const [origin, setOrigin] = React.useState('');
  const [size, setSize] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOrigin = (event: SelectChangeEvent) => {
    setOrigin(event.target.value as string);
  };

  const handleSize = (event: SelectChangeEvent) => {
    setSize(event.target.value as string);
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
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const email = formJson.email;
              console.log(email);
              handleClose();
            },
          },
        }}
      >
        <DialogTitle>Create New Produce Item</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText> */}

          <TextField
            autoFocus
            required
            margin="dense"
            id="item_no"
            name="item_no"
            label="Item No"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="common_name"
            name="common_name"
            label="Common Name"
            fullWidth
            variant="standard"
          />

          <Box sx={{ display: 'flex', gap: 2, marginTop: 2, alignItems: 'center' }}>
            <FormControl sx={{ flex: 1 }} variant="standard">
              <Autocomplete
                disablePortal
                options={originList}
                fullWidth
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
              sx={{ width: 50, paddingBottom: 0.36 }}
            />

            <FormControl variant="standard" sx={{ minWidth: 100 }}>
              <InputLabel id="select-2-label">Unit</InputLabel>
              <Select labelId="select-2-label" id="select-2" value={size} onChange={handleSize}>
                <MenuItem value="kg">KG</MenuItem>
                <MenuItem value="lbs">LBS</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
            <Autocomplete
              disablePortal
              options={sizeList}
              fullWidth
              renderInput={(params) => <TextField {...params} label="Size" variant="standard" />}
            />

            <Autocomplete
              disablePortal
              options={typeOfPackage}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Type of Package" variant="standard" />
              )}
            />
          </Box>

          <Box>
            <Autocomplete
              disablePortal
              options={scientificNameList}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  id="scientific-name"
                  name="scientific-name"
                  label="Scientific Name"
                  variant="standard"
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
