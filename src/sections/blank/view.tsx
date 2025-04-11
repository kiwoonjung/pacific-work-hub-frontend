import type { ReactNode } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  sx?: SxProps<Theme>;
  children?: ReactNode;
};

export function BlankView({ title = 'Blank', sx, children }: Props) {
  const renderContent = () => (
    <Box
      sx={[
        (theme) => ({
          mt: 5,
          width: 1,
          height: 'auto',
          borderRadius: 1,
          border: `solid 1px ${theme.vars.palette.divider}`,
          bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
          position: 'relative',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          position: 'absolute',
          top: -45,
          right: 0,
          zIndex: 9,
        }}
      >
        Create
      </Button>

      {children}
    </Box>
  );

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> {title} </Typography>
      {renderContent()}
    </DashboardContent>
  );
}
