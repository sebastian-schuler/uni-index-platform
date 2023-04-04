
import { Box, Center, Grid, Loader } from '@mantine/core';
import { GetServerSideProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import AccountActions from '../../features/Account/AccountActions';
import AccountAdsTable from '../../features/Account/AccountAdsTable';
import GroupedStats from '../../features/Account/AccountGroupedStats';
import { getAdsByUser, getInstitutionByUser, getUserFromToken } from '../../lib/prisma/prismaUserAccounts';
import { PremiumAdDetailed, UserDataProfile } from '../../lib/types/AccountHandlingTypes';
import { URL_LOGIN } from '../../lib/url-helper/urlConstants';

type Props = {
  userData: UserDataProfile
  userBookedAds: string
}

const AccountPage = ({ userData, userBookedAds }: Props) => {

  // Language
  const { t, lang } = useTranslation('account');

  const ads: PremiumAdDetailed[] = JSON.parse(userBookedAds);

  if (userData === null) return (
    <Center sx={{ height: "80vh", overflow: "hidden" }}>
      <Loader size={"xl"} />
    </Center>
  );

  return (
    <Box p={"lg"}>
      <Grid>

        <Grid.Col xs={12} md={6} lg={4}>
          <AccountActions />
        </Grid.Col>

        <Grid.Col lg={8}>
          <GroupedStats data={[
            { title: "Views", description: "24% more than in the same month last year, 33% more that two years ago", stats: "1414" },
            { title: "Views", description: "24% more than in the same month last year, 33% more that two years ago", stats: "1414" },
            { title: "Views", description: "24% more than in the same month last year, 33% more that two years ago", stats: "1414" }
          ]} />
        </Grid.Col>

        <Grid.Col lg={12}>
          <AccountAdsTable data={ads} />
        </Grid.Col>

      </Grid>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const localeUrl = context.locale === context.defaultLocale ? '' : `${context.locale}/`;

  // Check if the token exists in the cookies
  const token = context.req.cookies["institution-session"];
  if (!token) {
    return {
      redirect: {
        destination: `/${localeUrl}${URL_LOGIN}`,
        permanent: false
      }
    }
  }

  const userData = await getUserFromToken(token);
  if (!userData || Number(userData.lifetime) < Date.now()) {
    return {
      redirect: {
        destination: `/${localeUrl}`,
        permanent: false
      }
    }
  }

  const ads = await getAdsByUser(userData.user.id);

  const institutionResult = await getInstitutionByUser(userData.user.id);
  const profile: UserDataProfile = {
    user: userData.user,
    institution: institutionResult?.institution || undefined
  };

  const props: Props = {
    userData: profile,
    userBookedAds: JSON.stringify(ads)
  };
  return { props };
}

export default AccountPage
