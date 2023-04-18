import { Box, Stack, Title, Text, Divider, Card } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { getActiveAdsByUser } from '../../lib/prisma/prismaAds';
import { getUserFromToken } from '../../lib/prisma/prismaUserAccounts';
import { URL_LOGIN } from '../../lib/url-helper/urlConstants';
import { convertAdToCardData } from '../../lib/ads/adConverter';
import { PremiumAdDetailed } from '../../lib/types/AccountHandlingTypes';
import useTranslation from 'next-translate/useTranslation';
import { ManagedAd } from '../../lib/types/Ads';
import React from 'react';

type Props = {
  ads: ManagedAd[]
}

const ManageAds = ({ ads }: Props) => {

  // const ads: PremiumAdDetailed[] = JSON.parse(userBookedAds);

  console.log(ads);
  console.log(Date.now());
  const { t, lang } = useTranslation('account');

  const activeAds = ads.map((ad, i) => {

    const title = ad.title ? ad.title[lang] : "";
    const from = new Date(ad.booked_from).toLocaleDateString(lang);
    const to = new Date(ad.booked_until).toLocaleDateString(lang);

    return (
      <React.Fragment key={ad.id}>
        <Card>
          <Text size={'lg'}>#{i} - {ad.type} - {ad.title?.[lang]}</Text>
          <Text size={'sm'}>{ad.subject?.name} | {from} - {to}</Text>
        </Card>
        {i < ads.length - 1 && <Divider />}
      </React.Fragment>
    )
  });

  return (
    <Box>
      <Title order={5}>Manage Ads</Title>
      <Divider mt={'sm'} mb={'lg'} />
      <Stack>
        {activeAds}
      </Stack>
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

  const ads = await getActiveAdsByUser(userData.user.id);

  const props: Props = {
    ads
  };
  return { props };
}

export default ManageAds