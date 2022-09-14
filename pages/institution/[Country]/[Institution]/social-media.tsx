
import { Country, Institution, InstitutionSocialMedia } from '@prisma/client'
import {
  Chart as ChartJS, Filler, Legend, LineElement, PointElement, RadialLinearScale, Tooltip
} from 'chart.js'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Radar } from 'react-chartjs-2'
import WhitePaper from '../../../../components/elements/institution/WhitePaper'
import Breadcrumb from '../../../../components/layout/Breadcrumb'
import { FooterContent } from '../../../../components/layout/footer/Footer'
import LayoutContainer from '../../../../components/layout/LayoutContainer'
import InstitutionNav from '../../../../components/layout/subnav/InstitutionNav'
import Meta from '../../../../components/partials/Meta'
import { getCountries, getCountry, getInstitution, getInstitutionPaths, getSocialMedia } from '../../../../lib/prisma/prismaQueries'
import { Group, Paper, SimpleGrid, Grid, Title, Text, createStyles, useMantineTheme, Card } from '@mantine/core';
import SocialMediaStatCard from '../../../../components/elements/institution/SocialMediaStatCard'
import {
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandYoutube
} from '@tabler/icons';
import { getStaticPathsInstitution } from '../../../../lib/url-helper/staticPathFunctions'

const data = {
  labels: ['Tweet Count %', 'Average Likes %', 'Average Retweets %', 'Average Interaction %', 'Profile completed %'],
  datasets: [
    {
      label: 'Hochschule Kaiserslautern',
      data: [55, 23, 13, 20, 80],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
    {
      label: 'Universities in Germany on average',
      data: [20, 27, 15, 40, 90],
      backgroundColor: 'rgba(99, 255, 132, 0.2)',
      borderColor: 'rgba(99, 255, 132, 1)',
      borderWidth: 1,
    },
  ],

};

const options = {
  scales: {
    r: {
      angleLines: {
        display: false
      },
      min: 0,
      max: 100,
      ticks: {
        stepSize: 20
      }
    }
  }
}

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Props {
  institution: Institution,
  country: Country,
  socialMediaStringified: string,
  footerContent: FooterContent[],
}

const InstitutionSocialMedia: NextPage<Props> = ({ institution, country, footerContent, socialMediaStringified }: Props) => {

  const theme = useMantineTheme();
  const socialMedia: InstitutionSocialMedia = JSON.parse(socialMediaStringified);

  const facebookLink = socialMedia?.facebook_link;
  const twitterLink = socialMedia?.twitter_link;

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

        <Grid mt={"lg"}>

          <Grid.Col md={8}>
            <Card>
              <Title order={2}>Social Media Statistics</Title>
              <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
            </Card>
          </Grid.Col>

          <Grid.Col md={4}>
            <SimpleGrid cols={2}>
              <SocialMediaStatCard
                title='Twitter'
                value={socialMedia.twitter_points} diff={calculateSocialMediaDifference(socialMedia.twitter_points, averagePoints.twitterAverage)}
                icon={IconBrandTwitter}
              />
              <SocialMediaStatCard
                title='Youtube'
                value={socialMedia.youtube_points}
                diff={calculateSocialMediaDifference(socialMedia.youtube_points, averagePoints.youtubeAverage)}
                icon={IconBrandYoutube}
              />
              <SocialMediaStatCard
                title='Instagram'
                value={socialMedia.instagram_points}
                diff={calculateSocialMediaDifference(socialMedia.instagram_points, averagePoints.instagramAverage)}
                icon={IconBrandInstagram}
              />
              <SocialMediaStatCard
                title='Facebook'
                value={socialMedia.facebook_points}
                diff={calculateSocialMediaDifference(socialMedia.facebook_points, averagePoints.facebookAverage)}
                icon={IconBrandFacebook}
              />
            </SimpleGrid>
          </Grid.Col>

          <Grid.Col md={8}>

            <WhitePaper sx={{ borderRadius: 8 }}>

              <Radar
                data={data}
                options={options}
              />

            </WhitePaper>
          </Grid.Col>

        </Grid>

      </WhitePaper>

      {/* </InstitutionPaper> */}

      {/* 
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>

            <Box marginBottom={2}>
              <Typography variant='h6' component='h3'>
                Comparison to average in Germany
              </Typography>
              <Typography variant='body2' component='p'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Typography>
            </Box>
            <Radar
              data={data}
              options={options}
            />

          </CardContent>
        </Card>

        <Card>
          <CardContent>

            <Box marginBottom={2}>
              <Typography variant='h6' component='h3'>
                Social Media Links
              </Typography>
              <Typography variant='body2' component='p'>
                Social Media pages that we analyzed for this institution.
              </Typography>
            </Box>

            <Stack>

              {
                twitterLink &&
                <Button width={"fit-content"} variant="text" component={Link} href={twitterLink} startIcon={<TwitterIcon />}>
                  {twitterLink}
                </Button>
              }

              {
                facebookLink &&
                <Button width={"fit-content"} variant="text" component={Link} href={facebookLink} startIcon={<FacebookIcon />}>
                  {facebookLink}
                </Button>
              }

            </Stack>

          </CardContent>
        </Card>

        <Card>
          <CardContent>

            <Box marginBottom={2}>
              <Typography variant='h6' component='h3'>
                How are scores calculated?
              </Typography>
              <Typography variant='body2' component='p'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rhoncus, lectus at rhoncus pulvinar, diam libero tincidunt justo, nec ultrices neque nunc quis lectus. Phasellus at urna ac metus euismod eleifend a sit amet dolor. Integer velit lorem, eleifend eu luctus at, rutrum ut dolor. Curabitur sem risus, cursus sed justo vel, scelerisque maximus arcu. Nunc eu velit non quam interdum gravida eget ut nunc. Praesent ultrices erat ac sapien pulvinar, vitae efficitur sem rhoncus. Pellentesque laoreet, arcu et mattis facilisis, lacus odio maximus purus, ac tincidunt quam quam at mauris. Curabitur cursus rutrum porttitor.
              </Typography>
            </Box>

          </CardContent>
        </Card>

      </Masonry> */}

    </LayoutContainer>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {

  let countryUrl = "" + context?.params?.Country;
  let institutionUrl = "" + context?.params?.Institution;

  const country = await getCountry(countryUrl);
  const institution = await getInstitution(institutionUrl);
  const socialMedia = await getSocialMedia(institution?.id || -1);

  // Footer Data
  // Get all countries
  const countryList = await getCountries("asc");
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: {
      institution: institution,
      country: country,
      socialMediaStringified: JSON.stringify(socialMedia),
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