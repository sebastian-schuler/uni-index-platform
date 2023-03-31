import {
  Anchor, Button,
  Center, Checkbox, createStyles, Group, Paper, PasswordInput, Stack, Text, TextInput, Title, useMantineTheme
} from '@mantine/core';
import { GetServerSideProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ResponsiveWrapper from '../components/Container/ResponsiveWrapper';
import MantineLink from '../components/Link/MantineLink';
import ForgotPassword from '../features/Login/ForgotPassword';
import { useAuth } from '../lib/context/SessionContext';
import { getUserFromToken } from '../lib/prisma/prismaUserAccounts';
import { LoginStatus } from '../lib/types/AccountHandlingTypes';
import { URL_ACCOUNT, URL_REGISTER } from '../lib/url-helper/urlConstants';
import { toLink } from '../lib/util/util';
import Trans from 'next-translate/Trans';

const useStyles = createStyles((theme) => ({
  link: {
    color: theme.colors.brandOrange[5],
  }
}));

const CustomerLogin: NextPage = () => {

  const theme = useMantineTheme();
  const { classes } = useStyles();
  const router = useRouter();

  // AuthContext
  const { setAuthToken } = useAuth();

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
      router.push(toLink(URL_ACCOUNT), undefined, { shallow: true });

    } else {
      const status: LoginStatus = res.status;

      if (status === "NO_USER") {
        setUsernameError(t('login.error.no-user'));

      } else if (status === "NO_AUTH") {
        setPasswordError(t('login.error.wrong-password'));
        setUsernameError("");

      } else {
        setPasswordError(t('login.error.unknown'));
        setUsernameError(t('login.error.unknown'));
        console.error("Something went wrong.");
      }
    }
  }

  // Listen to enter key pressed
  const handleEnterPressed = (key: string) => {
    if (key === "Enter" && username !== "" && password !== "") {
      submitLogin();
    }
  }

  return (
    <ResponsiveWrapper>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('meta.login-tab-title')}</title>
        <meta key={"description"} name="description" content={t('meta.login-description')} />
      </Head>

      <Center>
        <Stack spacing={0}>

          {
            showForgotPassword ?
              <ForgotPassword setShowForgotPassword={setShowForgotPassword} /> :
              (
                <>
                  <Title order={1} align={"center"} >{t('login.title')}</Title>

                  <Text color={"dimmed"} align={"center"}>
                    <Trans
                      i18nKey='loginLogout:login.subtitle'
                      components={[<MantineLink url={URL_REGISTER} type="internal" />]}
                    />
                  </Text>

                  <Paper component='form' withBorder shadow="md" p={theme.spacing.lg} mt={theme.spacing.lg} radius="md" sx={{ maxWidth: 400, backgroundColor: theme.colors.light[0] }}>
                    <TextInput
                      autoComplete='username'
                      value={username}
                      onChange={(event) => setUsername(event.currentTarget.value)}
                      label={t('login.email-label')}
                      placeholder={t('login.email-placeholder')}
                      required
                      error={usernameError}
                    />
                    <PasswordInput
                      autoComplete='current-password'
                      value={password}
                      onChange={(event) => setPassword(event.currentTarget.value)}
                      onKeyDown={(event) => handleEnterPressed(event.key)}
                      label={t('login.password-label')}
                      placeholder={t('login.password-placeholder')}
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
                        {t('login.password-forgot')}
                      </Anchor>
                    </Group>
                    <Button
                      radius={"md"} fullWidth mt="xl"
                      onClick={submitLogin} disabled={username === "" || password === ""}
                    >
                      {t('login.button-text')}
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

export const getServerSideProps: GetServerSideProps = async (context) => {

  // Check if the token exists in the cookies
  const token = context.req.cookies["institution-session"];
  if (!token) return { props: {} };

  const localeUrl = context.locale === context.defaultLocale ? '' : `${context.locale}/`;

  // Check if the token is valid
  const userData = await getUserFromToken(token);
  if (userData && Number(userData.lifetime) > Date.now()) {
    // Token is valid, redirect to account page
    return {
      redirect: {
        destination: `/${localeUrl}${URL_ACCOUNT}`,
        permanent: false
      }
    }
  }

  return { props: {} };
}

export default CustomerLogin;