
import { Card, createStyles, List, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { Country, CountrySocialMedia, Institution, InstitutionSocialMedia } from '@prisma/client'


import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'

import useTranslation from 'next-translate/useTranslation'
import SmOverviewSection from '../../../../components/layout/socialmedia/SmOverviewSection'

import Breadcrumb from '../../../../components/layout/Breadcrumb'
import { FooterContent } from '../../../../components/layout/footer/Footer'
import LayoutContainer from '../../../../components/layout/LayoutContainer'
import InstitutionNav from '../../../../components/layout/subnav/InstitutionNav'
import Meta from '../../../../components/partials/Meta'
import WhitePaper from '../../../../components/WhitePaper'
import { getCountries, getCountry, getInstitution } from '../../../../lib/prisma/prismaQueries'
import { getCountrySocialmedia, getSocialMedia } from '../../../../lib/prisma/prismaSocialMedia'
import { TotalScore, TotalScoreSet, TwitterResults, YoutubeChannelData, YoutubeResults } from '../../../../lib/types/SocialMediaTypes'
import { getStaticPathsInstitution } from '../../../../lib/url-helper/staticPathFunctions'
import { getLocalizedName } from '../../../../lib/util/util'
import SmTwitterSection from '../../../../components/layout/socialmedia/SmTwitterSection'
import SocialMediaIconLink from '../../../../components/elements/socialmedia/SmIconLink'
import MantineLink from '../../../../components/elements/MantineLink'
import SmHeaderSection from '../../../../components/layout/socialmedia/SmHeaderSection'
import SmYoutubeSection from '../../../../components/layout/socialmedia/SmYoutubeSection'

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.light[0],
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.gray[2]}`,
  },
  title: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  cardSection: {
    padding: theme.spacing.md,
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    marginTop: theme.spacing.sm,
  },
}));

interface Props {
  institution: Institution,
  country: Country,
  institutionSMString: string,
  countrySMString: string,
  footerContent: FooterContent[],
}

const InstitutionSocialMedia: NextPage<Props> = ({ institution, country, footerContent, institutionSMString, countrySMString }: Props) => {

  const { classes, theme } = useStyles();
  const { t, lang } = useTranslation('common');

  const institutionSM: InstitutionSocialMedia | null = JSON.parse(institutionSMString);
  const countrySM: CountrySocialMedia | null = JSON.parse(countrySMString);

  if (institutionSM === null || institutionSM === undefined || countrySM === null || countrySM === undefined) {
    return (
      <LayoutContainer footerContent={footerContent}>
        <Meta
          title={'Uni Index - '}
          description=''
        />
        <Breadcrumb countryInfo={country} institutionInfo={institution} />
        <InstitutionNav title={institution.name} />
        <WhitePaper>
          <Text>No data</Text>
        </WhitePaper>
      </LayoutContainer>
    )
  }

  const institutionScore = JSON.parse(institutionSM.total_score) as TotalScore;

  // Country data
  const countryScore = JSON.parse(countrySM.avg_total_score) as TotalScoreSet;
  const countryTwitterScore = JSON.parse(countrySM.avg_twitter_score) as TotalScoreSet;
  const countryYoutubeScore = JSON.parse(countrySM.avg_youtube_score) as TotalScoreSet;
  const countryPercentScore = JSON.parse(countrySM.avg_total_score_percent) as TotalScoreSet;
  const countryTwitterResults = JSON.parse(countrySM.avg_twitter_results) as TwitterResults;
  const countryYoutubeResults = JSON.parse(countrySM.avg_youtube_results) as YoutubeResults;

  // Institution data
  const twitterResult = institutionSM.twitter_scores !== null ? JSON.parse(institutionSM.twitter_scores) as TwitterResults : null;
  const youtubeResult = institutionSM.youtube_scores !== null ? JSON.parse(institutionSM.youtube_scores) as YoutubeResults : null;
  // const facebookResults = (socialMedia?.facebook_results as unknown) as FacebookResult;
  // const twitterResults = (socialMedia?.twitter_results as unknown) as TwitterResult;
  const youtubeData = institutionSM.youtube_results !== null ? JSON.parse(institutionSM.youtube_results) as YoutubeChannelData : null;
  // const instagramResults = (socialMedia?.instagram_results as unknown) as InstagramResult;
  // const youtubeLink = youtubeData ? "https://www.youtube.com/channel/" + youtubeData.id : null;

  return (
    <LayoutContainer footerContent={footerContent}>

      <Meta
        title={'Uni Index - '}
        description='Very nice page'
      />

      <Breadcrumb countryInfo={country} institutionInfo={institution} />

      <InstitutionNav title={institution.name} />

      <WhitePaper>
        <Stack spacing={"lg"}>

          <SmHeaderSection
            institutionSM={institutionSM}
            institution={institution}
            classes={classes}
          />

          <SmOverviewSection
            country={country}
            institution={institution}
            countrySocialMedia={countrySM}
            institutionScore={institutionScore}
            countryPercentScore={countryPercentScore}
            countryTwitterScore={countryTwitterScore}
            countryYoutubeScore={countryYoutubeScore}
            twitterScore={twitterResult}
            youtubeScore={youtubeResult}
            classes={classes}
          />

          {
            twitterResult !== null &&
            <SmTwitterSection
              twitterResult={twitterResult}
              countryTwitterResults={countryTwitterResults}
              classes={classes}
            />
          }

          {
            youtubeResult !== null &&
            <SmYoutubeSection
              youtubeResult={youtubeResult}
              countryYoutubeResults={countryYoutubeResults}
              classes={classes}
            />
          }

        </Stack>
      </WhitePaper>

    </LayoutContainer>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {

  let countryUrl = "" + context?.params?.Country;
  let institutionUrl = "" + context?.params?.Institution;

  const country = await getCountry(countryUrl);
  const institution = await getInstitution(institutionUrl);
  const socialMedia = institution ? (await getSocialMedia(institution.id)) : null;
  const countrySocialMedia = country ? (await getCountrySocialmedia(country.id)) : null;

  // Footer Data
  // Get all countries
  const countryList = await getCountries();
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: {
      institution: institution,
      country: country,
      institutionSMString: JSON.stringify(socialMedia),
      countrySMString: JSON.stringify(countrySocialMedia),
      footerContent: footerContent
    }
  }

}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {

  const paths = await getStaticPathsInstitution(locales || []);

  return {
    paths: paths,
    fallback: false
  }
}

export default InstitutionSocialMedia