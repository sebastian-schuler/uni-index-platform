
import { Card, createStyles, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { Country, CountrySocialMedia, Institution, InstitutionSocialMedia } from '@prisma/client'
import {
  IconBrandFacebook, IconBrandInstagram, IconBrandTwitter, IconBrandYoutube
} from '@tabler/icons'

import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'

import useTranslation from 'next-translate/useTranslation'
import SocialMediaIconLink from '../../../../components/elements/socialmedia/SmIconLink'
import SocialMediaRadar from '../../../../components/elements/socialmedia/SmRadar'
import SocialMediaStatCard from '../../../../components/elements/socialmedia/SmStatCard'
import Breadcrumb from '../../../../components/layout/Breadcrumb'
import { FooterContent } from '../../../../components/layout/footer/Footer'
import LayoutContainer from '../../../../components/layout/LayoutContainer'
import InstitutionNav from '../../../../components/layout/subnav/InstitutionNav'
import Meta from '../../../../components/partials/Meta'
import WhitePaper from '../../../../components/WhitePaper'
import { getCountries, getCountry, getInstitution } from '../../../../lib/prisma/prismaQueries'
import { getCountrySocialmedia, getSocialMedia } from '../../../../lib/prisma/prismaSocialMedia'
import { TotalScore, TotalScoreSet, TwitterScore, YoutubeChannelData, YoutubeScore } from '../../../../lib/types/SocialMediaTypes'
import { getStaticPathsInstitution } from '../../../../lib/url-helper/staticPathFunctions'
import { getLocalizedName } from '../../../../lib/util/util'

const shortenLink = (link: string) => {
  link = link.replace(/((http)?s?:\/\/)(www.)?/i, "");
  return link;
}

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

  const facebookLink = institutionSM.facebook_url;
  const twitterLink = institutionSM.twitter_url;
  const instagramLink = institutionSM.instagram_url;

  const twitterScore = institutionSM.twitter_scores !== null ? JSON.parse(institutionSM.twitter_scores) as TwitterScore : null;
  const youtubeScore = institutionSM.youtube_scores !== null ? JSON.parse(institutionSM.youtube_scores) as YoutubeScore : null;

  // Graph data
  const totalScore = JSON.parse(institutionSM.total_score) as TotalScore;
  const countryScore = JSON.parse(countrySM.average_percentages) as TotalScoreSet;
  const graphLabels = [
    'Total reach %',
    'Total content output %',
    'Average impressions %',
    'Average interaction %',
    'Profiles completed %',
  ]
  const graphDataInstitution = [
    totalScore.percentData.totalReach,
    totalScore.percentData.totalContentOutput,
    totalScore.percentData.averageImpressions,
    totalScore.percentData.averageInteraction,
    totalScore.percentData.profilesCompleted,
  ]
  const graphDataCountry = [
    countryScore.totalReach,
    countryScore.totalContentOutput,
    countryScore.averageImpressions,
    countryScore.averageInteraction,
    countryScore.profilesCompleted,
  ]

  // const facebookResults = (socialMedia?.facebook_results as unknown) as FacebookResult;
  // const twitterResults = (socialMedia?.twitter_results as unknown) as TwitterResult;
  const youtubeData = institutionSM.youtube_results !== null ? JSON.parse(institutionSM.youtube_results) as YoutubeChannelData : null;
  // const instagramResults = (socialMedia?.instagram_results as unknown) as InstagramResult;
  const youtubeLink = "https://www.youtube.com/channel/" + youtubeData?.id;
  console.log(youtubeLink)

  const averagePoints = {
    facebookAverage: 125,
    twitterAverage: 5346,
    instagramAverage: 425,
    youtubeAverage: 2103,
  }

  const calculateSocialMediaDifference = (points: number, average: number) => {
    return points === 0 ? -100 : (points - average) / 100
  }

  return (
    <LayoutContainer footerContent={footerContent}>

      <Meta
        title={'Uni Index - '}
        description='Very nice page'
      />

      <Breadcrumb countryInfo={country} institutionInfo={institution} />

      <InstitutionNav title={institution.name} />

      {/* <InstitutionPaper> */}

      <WhitePaper>

        <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>

          <Stack>
            <Card shadow={"xs"} className={classes.card}>
              <Title order={2}>Social Media Statistics</Title>
              <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
            </Card>

            <Card shadow={"xs"} className={classes.card}>
              <SocialMediaRadar
                countryName={getLocalizedName({ lang: lang, dbTranslated: country })}
                institutionName={getLocalizedName({ lang: lang, institution: institution })}
                labels={graphLabels}
                dataInstitution={graphDataInstitution}
                dataCountry={graphDataCountry}
              />
            </Card>
          </Stack>

          <Stack>
            <SimpleGrid cols={2}>
              <SocialMediaStatCard
                title='Twitter'
                value={twitterScore?.total || 0}
                diff={calculateSocialMediaDifference(twitterScore?.total || 0, averagePoints.twitterAverage)}
                icon={IconBrandTwitter}
              />
              <SocialMediaStatCard
                title='Youtube'
                value={youtubeScore?.total || 0}
                diff={calculateSocialMediaDifference(youtubeScore?.total || 0, averagePoints.youtubeAverage)}
                icon={IconBrandYoutube}
              />
              <SocialMediaStatCard
                title='Instagram'
                value={0}
                diff={calculateSocialMediaDifference(0, averagePoints.instagramAverage)}
                icon={IconBrandInstagram}
              />
              <SocialMediaStatCard
                title='Facebook'
                value={0}
                diff={calculateSocialMediaDifference(0, averagePoints.facebookAverage)}
                icon={IconBrandFacebook}
              />
            </SimpleGrid>

            <Card shadow={"xs"} className={classes.card}>

              <Stack>
                <Text size="xs" color="dimmed" className={classes.title}>
                  Social Media Links
                </Text>
                {
                  youtubeLink &&
                  <SocialMediaIconLink type='youtube' url={youtubeLink} label title={`Youtube channel of ${institution.name}`} />
                }
                {
                  twitterLink &&
                  <SocialMediaIconLink type='twitter' url={twitterLink} label title={`Twitter profile of ${institution.name}`} />
                }
                {
                  facebookLink &&
                  <SocialMediaIconLink type='facebook' url={facebookLink} label title={`Facebook profile of ${institution.name}`} />
                }
                {
                  instagramLink &&
                  <SocialMediaIconLink type='instagram' url={instagramLink} label title={`Instagram profile of ${institution.name}`} />
                }
              </Stack>
            </Card>

          </Stack>

        </SimpleGrid>

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