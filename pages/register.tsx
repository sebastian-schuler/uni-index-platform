import { Title, useMantineTheme, Text } from '@mantine/core';
import { GetServerSideProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import MantineLink from '../components/elements/MantineLink';
import RegisterSteps from '../layout/account/RegisterSteps';
import LayoutContainer from '../layout/LayoutContainer';
import { getInstitutesForUserAccounts } from '../lib/prisma/prismaUserAccounts';
import { InstitutionRegistrationDBItem, InstitutionRegistrationItem } from '../lib/types/AccountHandlingTypes';
import { URL_LOGIN } from '../lib/url-helper/urlConstants';

type Props = {
  registrationInstitutes: InstitutionRegistrationItem[]
}

const Register: NextPage<Props> = props => {

  const theme = useMantineTheme();

  const { t } = useTranslation('loginLogout');

  return (
    <LayoutContainer>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('signup-tab-title')}</title>
        <meta key={"description"} name="description" content={t('signup-description')} />
      </Head>

      <Title color={theme.colors.brandGray[3]} align={"center"} >Create new account</Title>
      <Text color={"dimmed"} align={"center"} pb={theme.spacing.lg}>Already have an account? <MantineLink url={URL_LOGIN} type="internal">Login</MantineLink>instead</Text>

      <RegisterSteps registrationInstitutes={props.registrationInstitutes} />

    </LayoutContainer>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const dbResultInstitutes: InstitutionRegistrationDBItem[] = await getInstitutesForUserAccounts();
  const registrationInstitutes: InstitutionRegistrationItem[] = dbResultInstitutes.map(institute => {
    return { id: institute.id, name: institute.name, hasAccount: institute.User.length === 0 ? false : true } // TODO check if ok with length
  });

  return {
    props: { registrationInstitutes: registrationInstitutes }
  }
}

export default Register;