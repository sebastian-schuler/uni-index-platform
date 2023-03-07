import { createStyles, Divider, Grid, Image, Stack, Text } from '@mantine/core'
import { Country, Institution, InstitutionScreenshot } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import { useState } from 'react'
import WhitePaper from '../../../../components/Paper/WhitePaper'
import Breadcrumb from '../../../../features/Breadcrumb/Breadcrumb'
import { FooterContent } from '../../../../features/Footer/Footer'
import ResponsiveWrapper from '../../../../components/Container/ResponsiveWrapper'
import InstitutionNav from '../../../../features/Navigation/InstitutionNav'
import { getCountries, getCountry, getInstitution } from '../../../../lib/prisma/prismaQueries'
import { getInstitutionScreenshots } from '../../../../lib/prisma/prismaScreenshots'
import { getStaticPathsInstitution } from '../../../../lib/url-helper/staticPathFunctions'
import { PATH_INSTITUTION_SCREENSHOTS } from '../../../../lib/url-helper/urlConstants'
import { toLink } from '../../../../lib/util/util'

const useStyles = createStyles((theme) => ({
  screenshotThumbnail: {
    cursor: 'pointer',
    transition: "all .2s ease-in-out",

    '&:hover': {
      transform: "scale(1.05)",
    },
  }

}));

type ScreenshotPair = { full: InstitutionScreenshot, thumbnail: InstitutionScreenshot }

interface Props {
  institution: Institution,
  country: Country,
  screenshotsStringified: string,
  footerContent: FooterContent[],
}

const InstitutionScreenshots: NextPage<Props> = ({ institution, country, screenshotsStringified, footerContent }: Props) => {

  const [selectedScreenshot, setSelectedScreenshot] = useState<ScreenshotPair | null>(null);
  const { t, lang } = useTranslation("institution");
  const { classes } = useStyles();

  const allScreenshots: InstitutionScreenshot[] = JSON.parse(screenshotsStringified);

  const screenshotPairs: ScreenshotPair[] = [];

  allScreenshots.forEach((screenshot: InstitutionScreenshot) => {
    if (screenshot.type === "full") {
      const thumbnail = allScreenshots.find(scrn => scrn.pair_index === screenshot.pair_index && scrn.type === "thumbnail");
      if (thumbnail) {
        screenshotPairs.push({ full: screenshot, thumbnail: thumbnail });
      }
    }
  });

  return (
    <ResponsiveWrapper footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('meta.screenshots-title', { institution: institution?.name })}</title>
        <meta key={"description"} name="description" content={t('meta.screenshots-description')} />
      </Head>

      <Breadcrumb countryInfo={country} institutionInfo={institution} />

      <InstitutionNav title={institution.name} />

      <WhitePaper>

        <Grid>

          <Grid.Col span={3}>
            {
              screenshotPairs.map((pair, index) => (
                <div key={index}>
                  <Stack my={"sm"} spacing={0} className={classes.screenshotThumbnail} onClick={() => setSelectedScreenshot(pair)}>
                    <Text weight={"bold"}>{getDateString(Number(pair.thumbnail.timestamp), lang)}</Text>
                    <Image src={toLink(PATH_INSTITUTION_SCREENSHOTS, pair.thumbnail.institution_id, pair.thumbnail.filename + ".jpg")} alt={""} fit={"scale-down"} />
                  </Stack>
                  <Divider />
                </div>
              ))
            }
          </Grid.Col>

          <Grid.Col span={9}>
            {
              selectedScreenshot && (
                <Image src={toLink(PATH_INSTITUTION_SCREENSHOTS, selectedScreenshot.full.institution_id, selectedScreenshot.full.filename + ".jpg")} alt={""} fit={"scale-down"} />
              )
            }
          </Grid.Col>

        </Grid>


      </WhitePaper>



    </ResponsiveWrapper>
  )
}

const getDateString = (timestamp: number, lang: string) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString([lang]);
}

export async function getStaticProps(context: GetStaticPropsContext) {

  let countryUrl = "" + context?.params?.Country;
  let institutionUrl = "" + context?.params?.Institution;

  const country = await getCountry(countryUrl);
  const institution = await getInstitution({ institutionUrl });
  const screenshots = institution ? await getInstitutionScreenshots(institution.id) : [];
  const screenshotsStringified = JSON.stringify(screenshots);

  // Footer Data
  // Get all countries
  const countryList = await getCountries();
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: {
      institution,
      country,
      screenshotsStringified,
      footerContent
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


export default InstitutionScreenshots