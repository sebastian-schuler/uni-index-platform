import { Title, useMantineTheme, Text } from '@mantine/core';
import { GetServerSideProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import MantineLink from '../components/Link/MantineLink';
import RegisterSteps from '../features/Register/RegisterSteps';
import ResponsiveWrapper from '../components/Container/ResponsiveWrapper';
import { getInstitutesForUserAccounts, getUserFromToken } from '../lib/prisma/prismaUserAccounts';
import { InstitutionRegistrationDBItem, InstitutionRegistrationItem } from '../lib/types/AccountHandlingTypes';
import { URL_ACCOUNT, URL_LOGIN } from '../lib/url-helper/urlConstants';
import Trans from 'next-translate/Trans';

type Props = {
  registrationInstitutes: InstitutionRegistrationItem[]
}

const Register: NextPage<Props> = props => {

  const theme = useMantineTheme();

  const { t } = useTranslation('loginLogout');

  return (
    <ResponsiveWrapper>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('meta.signup-tab-title')}</title>
        <meta key={"description"} name="description" content={t('meta.signup-description')} />
      </Head>

      <Title order={1} align={"center"}>{t('signup.title')}</Title>
      <Text color={"dimmed"} align={"center"} pb='lg'>
        <Trans
          i18nKey='loginLogout:signup.subtitle'
          components={[<MantineLink url={URL_LOGIN} type="internal" />]}
        />
      </Text>

      <RegisterSteps registrationInstitutes={props.registrationInstitutes} />

    </ResponsiveWrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const localeUrl = context.locale === context.defaultLocale ? '' : `${context.locale}/`;

  // Check if the token exists in the cookies
  const token = context.req.cookies["institution-session"];

  if (token) {
    // Check if the token is valid
    const userData = await getUserFromToken(token);
    if (!userData || Number(userData.lifetime) > Date.now()) {
      // Token is valid, redirect to account page
      return {
        redirect: {
          destination: `/${localeUrl}${URL_ACCOUNT}`,
          permanent: false
        }
      }
    }
  }

  const dbResultInstitutes: InstitutionRegistrationDBItem[] = await getInstitutesForUserAccounts();
  const registrationInstitutes: InstitutionRegistrationItem[] = dbResultInstitutes.map(institute => {
    return { id: institute.id, name: institute.name, hasAccount: institute.user.length === 0 ? false : true } // TODO check if ok with length
  });

  return {
    props: { registrationInstitutes: registrationInstitutes }
  }
}

export default Register;