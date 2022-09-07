import { Masonry } from '@mui/lab'
import { Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Country, Institution, InstitutionSocialMedia } from '@prisma/client'
import {
  Chart as ChartJS, Filler, Legend, LineElement, PointElement, RadialLinearScale, Tooltip
} from 'chart.js'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { Radar } from 'react-chartjs-2'
import Breadcrumb from '../../../../components/layout/Breadcrumb'
import { FooterContent } from '../../../../components/layout/footer/Footer'
import LayoutContainer from '../../../../components/layout/LayoutContainer'
import InstitutionNav from '../../../../components/layout/subnav/InstitutionNav'
import Link from '../../../../components/mui/NextLinkMui'
import Meta from '../../../../components/partials/Meta'
import { getCountries, getCountry, getInstitution, getInstitutionPaths, getSocialMedia } from '../../../../lib/prismaQueries'
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

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

type Props = {
  institution: Institution,
  country: Country,
  socialMedia: InstitutionSocialMedia,
  footerContent: FooterContent[],
}

const InstitutionSocialMedia: NextPage<Props> = props => {

  const { institution, country, footerContent, socialMedia } = props;

  const facebookLink = socialMedia?.facebook_link;
  const twitterLink = socialMedia?.twitter_link;

  return (
    <LayoutContainer footerContent={footerContent}>

      <Meta
        title={'Uni Index - '}
        description='Very nice page'
      />

      <Breadcrumb countryInfo={country} institutionInfo={institution} />

      <InstitutionNav title={institution.name} />

      <Masonry columns={2} spacing={2}>

        <Card>
          <CardContent>
            <Stack>

              <Typography variant='h6' component='h2'>
                Quick Facts
              </Typography>
              <Typography variant='body2' component='p'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Typography>

              <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>

                <Stack direction={"column"}>
                  <Typography variant='overline' component='span' mt={2} lineHeight={1.2}>
                    Total Score
                  </Typography>
                  <Typography variant='h5' component='h2'>
                    84%
                  </Typography>
                </Stack>

                <Stack direction={"column"}>
                  <Typography variant='overline' component='span' mt={2} lineHeight={1.2}>
                    National Rank
                  </Typography>
                  <Typography variant='h5' component='h2'>
                    485th
                  </Typography>
                </Stack>

                <Stack direction={"column"}>
                  <Typography variant='overline' component='span' mt={2} lineHeight={1.2}>
                    Difference to average
                  </Typography>
                  <Typography variant='h5' component='h2'>
                    +12,5%
                  </Typography>
                </Stack>

                <Stack direction={"column"}>
                  <Typography variant='overline' component='span' mt={2} lineHeight={1.2}>
                    Strongest category
                    <br></br>
                    (Tweet Count)
                  </Typography>
                  <Typography variant='h5' component='h2'>
                    86%
                  </Typography>
                </Stack>

              </Stack>


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

      </Masonry>

    </LayoutContainer>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {

  let countryUrl = "" + context?.params?.Country;
  let institutionUrl = "" + context?.params?.Institution;
  let localeDb = "" + context.locale;

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
      socialMedia: socialMedia,
      footerContent: footerContent
    }
  }

}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {

  const institutions = await getInstitutionPaths();

  let paths: {
    params: ParsedUrlQuery;
    locale?: string | undefined;
  }[] = [];

  // Add locale to every possible path
  locales?.forEach((locale) => {
    institutions.forEach((institution) => {

      // Iterate every Institution but also every InstitutionLocation (unis can have multiple locations, even in different countries)
      institution.Subject.forEach((subject) => {
        paths.push({
          params: {
            Country: subject.City?.State.Country.url,
            Institution: institution.url
          },
          locale,
        });
      })

    })
  });

  return {
    paths: paths,
    fallback: false
  }
}

export default InstitutionSocialMedia