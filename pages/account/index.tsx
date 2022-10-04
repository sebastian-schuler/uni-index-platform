
import { Box, Center, Grid, Loader } from '@mantine/core';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import BookedAdsTable from '../../components/elements/accounts/BookedAdsTable';
import IndexAvailableActions from '../../components/elements/accounts/IndexAvailableActions';
import GroupedStats from '../../components/elements/GroupedStats';
import { getUserDataFromApi } from '../../lib/accountHandling/AccountApiHandler';
import { PremiumAdDetailed, UserDataProfile } from '../../lib/types/AccountHandlingTypes';

const AccountPage = () => {

  // Language
  const { t, lang } = useTranslation('account');
  const langContent = {
  }

  // If a token exists, assume its valid and redirect to account page, it will be checked there anyway to get data
  const [userData, setUserData] = useState<UserDataProfile>(null);
  const [userBookedAds, setUserBookedAds] = useState<PremiumAdDetailed[]>([]);

  useEffect(() => {
    // Get user data from API
    const getData = async () => {
      const userDataRes = await getUserDataFromApi({ profile: true, userAds: true });
      if (userDataRes === null || userDataRes.status !== "SUCCESS") return;
      console.log(userDataRes)
      setUserData(userDataRes.profile || null);
      setUserBookedAds(userDataRes.ads || []);
    }
    getData();
    return () => { }
  }, []);

  if (userData === null) return (
    <Center sx={{ height: "80vh", overflow: "hidden" }}>
      <Loader size={"xl"} />
    </Center>
  );

  return (
    <Box p={"lg"}>

      <Grid>

        <Grid.Col xs={12} md={6} lg={4}>
          <IndexAvailableActions />
        </Grid.Col>

        <Grid.Col lg={8}>
          <GroupedStats data={[
            { title: "Views", description: "24% more than in the same month last year, 33% more that two years ago", stats: "1414" },
            { title: "Views", description: "24% more than in the same month last year, 33% more that two years ago", stats: "1414" },
            { title: "Views", description: "24% more than in the same month last year, 33% more that two years ago", stats: "1414" }
          ]} />
        </Grid.Col>

        <Grid.Col lg={12}>
            <BookedAdsTable data={userBookedAds} />
        </Grid.Col>

      </Grid>



    </Box>
  )

}

export default AccountPage
