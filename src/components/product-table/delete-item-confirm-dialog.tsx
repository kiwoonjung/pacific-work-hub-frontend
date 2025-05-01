import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { CircularProgress } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { fetcher, endpoints } from 'src/lib/axios';

import { useSnackbar } from 'src/components/snackbar/snackbar-context';

type Props = {
  endpoint: string;
  open: boolean;
  onClose: () => void;
  item: any | null;
};

export default function DeleteConfirmDialog({ endpoint, open, onClose, item }: Props) {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const createMutation = useMutation({
    mutationFn: (param: number) =>
      fetcher([endpoints.produce.delete + '/' + param, { method: 'DELETE' }]),
    onSuccess: (data) => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['produceItems', endpoint] });
        setLoading(false);
        onClose();
        showSnackbar('Item deleted successfully!', 'success');
      }, 1000);
    },
    onError: (error: any) => {
      setLoading(false);
      console.error('Failed to delete item', error.response?.data || error.message);
      showSnackbar(
        'Failed to delete item: ' + (error.response?.data?.error || error.message),
        'error'
      );
    },
  });

  const onSubmit = () => {
    setLoading(true);
    const id = item.id;
    createMutation.mutate(id);
  };

  return (
    <Dialog
        fullWidth
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to delte ${item?.item_no}`}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            type="submit"
            onClick={onSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Deleting...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
  );
}
