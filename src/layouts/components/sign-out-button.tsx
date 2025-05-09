import type { ButtonProps } from '@mui/material/Button';

import { useNavigate } from 'react-router';
import { useMsal } from '@azure/msal-react';
import { useState, useCallback } from 'react';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { signOut } from 'src/auth/context/jwt/action';

// ----------------------------------------------------------------------

type Props = ButtonProps & {
  onClose?: () => void;
};

export function SignOutButton({ onClose, sx, ...other }: Props) {
  const { instance } = useMsal();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const router = useRouter();

  const { checkUserSession } = useAuthContext();

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      await checkUserSession?.();

      onClose?.();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }, [checkUserSession, onClose, router]);

  const handleLogoutPopup = async () => {
    try {
      setIsLoading(true);
      // console.log('logout!');
      await instance.logoutPopup();
      // navigate(paths.auth.msal.signIn);
    } catch (error) {
      console.log('Logout error:', error);
      navigate(paths.auth.msal.signIn);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={handleLogoutPopup}
      sx={sx}
      {...other}
    >
      Logout
    </Button>
  );
}
