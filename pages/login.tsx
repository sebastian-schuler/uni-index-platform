import {
  Anchor, Button,
  Center, Checkbox, createStyles, Group, Paper, PasswordInput, Stack, Text, TextInput, Title, useMantineTheme
} from '@mantine/core';
import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import MantineLink from '../components/Link/MantineLink';
import ForgotPassword from '../features/Login/ForgotPassword';
import ResponsiveWrapper from '../components/Container/ResponsiveWrapper';
import { useAuth } from '../lib/context/SessionContext';
import { LoginStatus } from '../lib/types/AccountHandlingTypes';
import { URL_REGISTER } from '../lib/url-helper/urlConstants';

const useStyles = createStyles((theme) => ({
  link: {
    color: theme.colors.brandOrange[5],
  }
}));

const CustomerLogin: NextPage = () => {

  const theme = useMantineTheme();
  const { classes } = useStyles();

  // Router
  const router = useRouter();
  // AuthContext
  const { token, setAuthToken } = useAuth();


  // Login fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Errors
  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Translation
  const { t } = useTranslation('loginLogout');

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

    } else {
      const status: LoginStatus = res.status;

      if (status === "NO_USER") {
        setUsernameError("No user with this username");

      } else if (status === "NO_AUTH") {
        setPasswordError("Wrong password");
        setUsernameError("");

      } else {
        console.log("Something went wrong.");
      }
    }
  }

  // Listen to enter key pressed
  const handleEnterPressed = (key: string) => {
    if (key === "Enter" && username !== "" && password !== "") {
      submitLogin();
    }
  }

  // If a token exists, assume its valid and redirect to account page, it will be checked there anyway to get data
  if (token !== "") {
    router.replace('/account');
    return (<></>);
  }

  return (
    <ResponsiveWrapper>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('login-tab-title')}</title>
        <meta key={"description"} name="description" content={t('login-description')} />
      </Head>

      <Center>
        <Stack spacing={0}>

          {
            showForgotPassword ?
              <ForgotPassword setShowForgotPassword={setShowForgotPassword} /> :
              (
                <>
                  <Title color={theme.colors.brandGray[3]} align={"center"} >Welcome back!</Title>
                  <Text color={"dimmed"} align={"center"}>Do not have an account yet? <MantineLink url={URL_REGISTER} type="internal">Create account</MantineLink></Text>

                  <Paper component='form' withBorder shadow="md" p={theme.spacing.lg} mt={theme.spacing.lg} radius="md" sx={{ maxWidth: 400, backgroundColor: theme.colors.light[0] }}>
                    <TextInput
                      autoComplete='username'
                      value={username}
                      onChange={(event) => setUsername(event.currentTarget.value)}
                      label="Email"
                      placeholder="name@uni.de"
                      required
                      error={usernameError}
                    />
                    <PasswordInput
                      autoComplete='current-password'
                      value={password}
                      onChange={(event) => setPassword(event.currentTarget.value)}
                      onKeyDown={(event) => handleEnterPressed(event.key)}
                      label="Password"
                      placeholder="Your password"
                      required
                      mt="md"
                      error={passwordError}
                    />
                    <Group position="apart" mt="md">
                      <Checkbox label="Remember me" />
                      <Anchor
                        component='a'
                        onClick={(event) => {
                          event.preventDefault()
                          setShowForgotPassword(true);
                        }}
                        size="sm"
                        className={classes.link}
                      >
                        Forgot password?
                      </Anchor>
                    </Group>
                    <Button radius={"md"} fullWidth mt="xl" onClick={submitLogin} disabled={username === "" || password === ""}>
                      Sign in
                    </Button>
                  </Paper>
                </>
              )
          }

        </Stack>
      </Center>
    </ResponsiveWrapper>
  )

}

export default CustomerLogin;