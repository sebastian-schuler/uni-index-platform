import { Avatar, Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { GetServerSidePropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PasswordInput from '../components/elements/accounts/PasswordInput';
import LayoutContainer from '../components/layout/LayoutContainer';
import Link from '../components/mui/NextLinkMui';
import { useAuth } from '../context/SessionContext';
import { URL_REGISTER } from '../data/urlConstants';
import { LoginStatus } from '../lib/types/AccountHandlingTypes';
import { toLink } from '../lib/util';

type Props = {

}

const CustomerLogin: NextPage<Props> = props => {

  // Router
  const router = useRouter();
  // AuthContext
  const { token, setAuthToken } = useAuth();
  // If a token exists, assume its valid and redirect to account page, it will be checked there anyway to get data
  if (token !== "") {
    router.replace('/account');
    return (<></>);
  }

  // Login fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Errors
  const [isUsernameError, setIsUsernameError] = useState<boolean>(false);
  const [isPasswordError, setIsPasswordError] = useState<boolean>(false);

  // Translation
  const { t } = useTranslation('loginLogout');
  const langContent = {
    loginTitle: t('login-title'),
    emailLabel: t('login-email-label'),
    loginForgot: t('login-forgot'),
    loginButtonText: t('login-button-text'),
    loginNeedAccount: t('login-needaccount'),
    loginErrorUsername: t('login-error-username'),
  }

  // Handle login
  const submitLogin = async () => {

    // Send login data to API
    const res = await fetch('/api/account/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username, password: password })
    }).then((t) => t.json());

    // Get token and token lifetime if successful 
    const { token, lifetime } = res;
    if (token && token !== "") {

      // Set context and cookie and go to account page
      setAuthToken(token, lifetime);
      router.replace('/account');

    } else {
      const status: LoginStatus = res.status;

      if (status === "NO_USER") {
        setIsUsernameError(true);

      } else if (status === "NO_AUTH") {
        setIsPasswordError(true);
        setIsUsernameError(false);

      } else {
        console.log("Something went wrong.");
      }
    }
  }

  // Listen to enter key pressed
  const handleEnterPressed = (key: string) => {
    if (key === "Enter") {
      submitLogin();
    }
  }

  return (
    <LayoutContainer>

      <Grid
        container
        sx={{
          marginY: 8,
        }}
      >

        <Grid item xs={0} sm={2} md={3} xl={4} />

        <Grid item component="form" xs={12} sm={8} md={6} xl={4} noValidate sx={{}}>

          <Paper elevation={1} sx={{ padding: 4 }}>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                {/* <LockOutlinedIcon /> */}
              </Avatar>
              <Typography component="h1" variant="h5">
                {langContent.loginTitle}
              </Typography>
            </Box>

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={langContent.emailLabel}
              name="email"
              autoComplete="email"
              autoFocus
              value={username}
              onChange={e => setUsername(e.target.value)}
              error={isUsernameError}
              helperText={isUsernameError ? langContent.loginErrorUsername : ""}
            />

            <PasswordInput
              password={password}
              setPassword={setPassword}
              onKeyDown={handleEnterPressed}
              isError={isPasswordError}
              sx={{ mt: 1 }}
            />

            <Button
              onClick={submitLogin}
              fullWidth
              variant="contained"
              sx={{ py: 2, mt: 3, mb: 2, color: 'common.white', lineHeight: 1 }}
            >
              {langContent.loginButtonText}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  {langContent.loginForgot}
                </Link>
              </Grid>
              <Grid item>
                <Link href={toLink(URL_REGISTER)} variant="body2">
                  {langContent.loginNeedAccount}
                </Link>
              </Grid>
            </Grid>

          </Paper>
        </Grid>
      </Grid>
    </LayoutContainer>
  )

}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {}, // will be passed to the page component as props
  }
}


export default CustomerLogin