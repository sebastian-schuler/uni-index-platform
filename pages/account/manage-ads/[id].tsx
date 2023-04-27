import React from 'react'
import { Box, Card, Divider, Stack, Text, Title, Button } from '@mantine/core';
import { URL_ACCOUNT, URL_LOGIN } from '../../../lib/url-helper/urlConstants';
import { GetServerSideProps } from 'next';
import { getUserFromToken } from '../../../lib/prisma/prismaUserAccounts';
import { useRouter } from 'next/router';
import { getAdByUser } from '../../../lib/prisma/prismaAds';
import { ManagedAd } from '../../../lib/types/Ads';
import Link from 'next/link';
import { toLink } from '../../../lib/util/util';

type Props = {
  ad: ManagedAd | null
}

const EditAdPage = ({ }: Props) => {

  const route = useRouter();

  console.log(route.query.id);

  return (
    <Box>
      <Title order={5}>Manage Ads</Title>
      <Divider mt={'sm'} mb={'lg'} />
      <Button component={Link} href={toLink(URL_ACCOUNT, 'manage-ads')}>Back</Button>
      <Stack>

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

  // Check if the token is valid
  const userData = await getUserFromToken(token);
  if (!userData || Number(userData.lifetime) < Date.now()) {
    return {
      redirect: {
        destination: `/${localeUrl}`,
        permanent: false
      }
    }
  }

  const id = context.query.id ? context.query.id as string : null;
  const ad = await getAdByUser(id, userData.user.id);

  const props: Props = {
    ad
  };
  return { props };
}

export default EditAdPage;