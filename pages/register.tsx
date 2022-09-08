import { GetServerSideProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import RegisterSteps from '../components/elements/accounts/RegisterSteps';
import LayoutContainer from '../components/layout/LayoutContainer';
import { getInstitutesForUserAccounts } from '../lib/prismaQueries';
import { InstitutionRegistrationDBItem, InstitutionRegistrationItem } from '../lib/types/AccountHandlingTypes';

type Props = {
  registrationInstitutes: InstitutionRegistrationItem[]
}

const register: NextPage<Props> = props => {

  const { t } = useTranslation('loginLogout');
  const langContent = {
    signupTitle: t('signup-title'),
  }

  return (
    <LayoutContainer>

      <Grid
        container
        sx={{
          marginY: 8,
        }}
      >

        <Grid item xs={0} sm={1} md={2} xl={3} />
        <Grid item component="form" xs={12} sm={10} md={8} xl={6} noValidate sx={{}}>
          <Paper elevation={1} sx={{ padding: 4 }}>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                {/* <LockOutlinedIcon /> */}
              </Avatar>
              <Typography component="h1" variant="h5">
                {langContent.signupTitle}
              </Typography>
            </Box>

            <Box sx={{ marginTop: 2 }}>
              <RegisterSteps registrationInstitutes={props.registrationInstitutes} />
            </Box>

          </Paper>
        </Grid>
      </Grid>

    </LayoutContainer>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const dbResultInstitutes: InstitutionRegistrationDBItem[] = await getInstitutesForUserAccounts();
  const registrationInstitutes: InstitutionRegistrationItem[] = dbResultInstitutes.map(institute => {
    return { id: institute.id, name: institute.name, hasAccount: institute.User === null ? false : true }
  });

  return {
    props: { registrationInstitutes: registrationInstitutes }
  }
}

export default register