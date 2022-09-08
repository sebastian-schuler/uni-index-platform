
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import BookedAdsTable from '../../components/elements/accounts/BookedAdsTable';
import { Center, Loader, Group, Navbar, Title, Box, SimpleGrid, Grid, Card, Text, Anchor } from '@mantine/core';
import { useAuth } from '../../context/SessionContext';
import { URL_LOGIN } from '../../lib/urlConstants';
import { getUserDataFromApi } from '../../lib/accountHandling/AccountApiHandler';
import { PremiumAdDetailed, UserDataProfile } from '../../lib/types/AccountHandlingTypes';
import { toLink } from '../../lib/util';
import IndexAvailableActions from '../../components/elements/accounts/IndexAvailableActions';
import GroupedStats from '../../components/elements/GroupedStats';

const AccountPage = () => {

  // Language
  const { t, lang } = useTranslation('account');
  const langContent = {
  }

  // If a token exists, assume its valid and redirect to account page, it will be checked there anyway to get data
  const { token, deleteAuthToken } = useAuth();
  const [userData, setUserData] = useState<UserDataProfile>(null);
  const [userBookedAds, setUserBookedAds] = useState<PremiumAdDetailed[]>([]);

  useEffect(() => {
    // Get user data from API
    const getData = async () => {
      const userDataRes = await getUserDataFromApi({ profile: true, userAds: true });
      if (userDataRes === null || userDataRes.status !== "SUCCESS") return;
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

  // return (
  // <Grid container spacing={2}>

  //   <Grid item xs={12} md={10}>
  //     <Card sx={{ height: "100%" }}>
  //       <CardContent>

  //         <Typography variant='h5' component={'h2'} letterSpacing={'0.05em'}>
  //           Actions
  //         </Typography>
  //         <Typography sx={{ mb: 1.5 }} color="grey.500">
  //           Choose an action to perform.
  //         </Typography>
  //         <Grid container spacing={2}>
  //           <Grid item xs={6} md={4} xl={2}>
  //             <Button variant='outlined' component={NextLinkComposed} to={'/account/create-ad'} fullWidth sx={{ height: '100%' }}>Book new ad</Button>
  //           </Grid>
  //           <Grid item xs={6} md={4} xl={2}>
  //             <Button variant='outlined' component={NextLinkComposed} to={'/account/manage-ads'} fullWidth sx={{ height: '100%' }}>Manage ads</Button>
  //           </Grid>
  //           <Grid item xs={6} md={4} xl={2}>
  //             <Button variant='outlined' component={NextLinkComposed} to={'/account/support'} fullWidth sx={{ height: '100%' }}>Contact support</Button>
  //           </Grid>
  //         </Grid>

  //       </CardContent>
  //     </Card>
  //   </Grid>

  //   <Grid item xs={12} md={2}>
  //     <Card sx={{ height: "100%" }}>
  //       <CardContent>

  //         <Typography variant='h5' component={'h2'} letterSpacing={'0.05em'}>
  //           Stats
  //         </Typography>
  //         <Typography sx={{ mb: 1.5 }} color="grey.500">
  //           Statistics about your account.
  //         </Typography>
  //         <Stack direction={"row"} justifyContent={"space-between"}>
  //           <Typography>Active ads</Typography>
  //           <Typography>{userBookedAds.length}</Typography>
  //         </Stack>

  //       </CardContent>
  //     </Card>
  //   </Grid>

  //   <Grid item xs={12}>
  //     <Card>
  //       <CardContent>

  //         <Typography variant='h5' component={'h2'} letterSpacing={'0.05em'}>
  //           Active Ads
  //         </Typography>
  //         <Typography sx={{ mb: 1.5 }} color="grey.500">
  //           Currently active ads you've booked
  //         </Typography>

  //         <BookedAdsTable bookedAds={userBookedAds} />

  //       </CardContent>
  //     </Card>
  //   </Grid>

  // </Grid>
  // )
  // }

}

export default AccountPage
