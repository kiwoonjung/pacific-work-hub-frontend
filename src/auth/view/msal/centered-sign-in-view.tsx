import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

import { loginRequest } from 'src/authConfig';

import { Form } from 'src/components/hook-form';
import { AnimateLogoRotate } from 'src/components/animate';

import { FormHead } from 'src/auth/components/form-head';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function CenteredSignInView() {
  const { instance } = useMsal();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const clearAuthState = async () => {
    try {
      // First, try to handle any pending redirects
      await instance.handleRedirectPromise();

      // Then clear the cache
      await instance.clearCache();

      // Finally, logout using redirect
      await instance.logoutRedirect();
    } catch (error) {
      console.error('Error clearing auth state:', error);
    }
  };

  const handleLoginPopup = async () => {
    console.log('Starting popup login...');
    if (isLoading) {
      console.log('Login already in progress, returning...');
      return;
    }

    try {
      setIsLoading(true);

      // Check if we're already authenticated
      const accounts = instance.getAllAccounts();
      if (accounts.length > 0) {
        console.log('Already authenticated with account:', accounts[0].username);
        instance.setActiveAccount(accounts[0]);
        navigate(paths.dashboard.root);
        return;
      }

      console.log('No active accounts, proceeding with login...');

      // Clear any existing state
      await instance.clearCache();
      console.log('Cache cleared');

      // Handle any pending popups first
      const popupResponse = await instance.handleRedirectPromise();
      if (popupResponse) {
        console.log('Found popup response:', popupResponse);
        instance.setActiveAccount(popupResponse.account);
        navigate(paths.dashboard.root);
        return;
      }

      console.log('Starting popup login...');
      const response = await instance.loginPopup(loginRequest);

      console.log('Login popup completed:', response);
      instance.setActiveAccount(response.account);
      navigate(paths.dashboard.root);
    } catch (error) {
      console.error('Authentication error:', error);
      if (
        error instanceof Error &&
        error.name === 'BrowserAuthError' &&
        error.message.includes('interaction_in_progress')
      ) {
        console.log('Found existing interaction, attempting to clear it...');
        try {
          await instance.clearCache();
          console.log('Cache cleared for retry');
          const response = await instance.loginPopup(loginRequest);
          console.log('Retry login popup completed:', response);
          instance.setActiveAccount(response.account);
          navigate(paths.dashboard.root);
        } catch (retryError) {
          console.error('Error during retry:', retryError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutPopup = async () => {
    try {
      setIsLoading(true);
      await instance.logoutPopup();
      // After successful logout, navigate to the login page
      navigate(paths.auth.msal.signIn);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, try to navigate back to login
      navigate(paths.auth.msal.signIn);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultValues: SignInSchemaType = {
    email: '',
    password: '',
  };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <AuthenticatedTemplate>
        <Button
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          loadingIndicator="Sign out..."
          onClick={handleLogoutPopup}
        >
          Sign out
        </Button>
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <Button
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isLoading}
          loadingIndicator="Sign in..."
          onClick={handleLoginPopup}
          disabled={isLoading}
        >
          Sign in
        </Button>
      </UnauthenticatedTemplate>
    </Box>
  );

  return (
    <>
      <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />

      <FormHead title="Sign in to your account" />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </>
  );
}
