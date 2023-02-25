import { Stack, Text } from '@mantine/core'
import { Card, SimpleGrid, Title } from '@mantine/core'
import { Country, Institution } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import Link from 'next/link'
import LhrRingProgress from '../../../../../components/elements/onlinemarketing/LhrRingProgress'
import WhitePaper from '../../../../../components/WhitePaper'
import Breadcrumb from '../../../../../layout/Breadcrumb'
import { FooterContent } from '../../../../../layout/footer/Footer'
import LayoutContainer from '../../../../../layout/LayoutContainer'
import InstitutionNav from '../../../../../layout/subnav/InstitutionNav'
import { getLhrSimplified } from '../../../../../lib/lighthouse/lhrSimplifier'
import { getCountries, getCountry, getInstitution } from '../../../../../lib/prisma/prismaQueries'
import { LhrSimple } from '../../../../../lib/types/lighthouse/CustomLhrTypes'
import { getStaticPathsInstitution } from '../../../../../lib/url-helper/staticPathFunctions'
import { URL_INSTITUTION, URL_INSTITUTION_OM } from '../../../../../lib/url-helper/urlConstants'
import { toLink } from '../../../../../lib/util/util'

interface CategoryData {
  title: string,
  description: string,
  url: string,
  score: number,
}

interface Props {
  institution: Institution,
  country: Country,
  lhr: LhrSimple,
  footerContent: FooterContent[],
}

const InstitutionOnlineMarketing: NextPage<Props> = ({ institution, country, lhr, footerContent }: Props) => {

  const { t, lang } = useTranslation('institution');

  if (!lhr) return (
    <LayoutContainer footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('online-marketing-title-nodata', { institution: institution?.name })}</title>
        <meta key={"description"} name="description" content={t('online-marketing-description')} />
      </Head>

      <Breadcrumb countryInfo={country} institutionInfo={institution} />

      <InstitutionNav title={institution.name} />

      <WhitePaper>No LHR data</WhitePaper>

    </LayoutContainer>
  );

  const data: CategoryData[] = [
    {
      title: "Performance",
      description: "Values are estimated and may vary. The performance score is calculated directly from these metrics.",
      url: "performance",
      score: lhr.performanceScore * 100
    },
    {
      title: "SEO",
      description: "Values are estimated and may vary. The performance score is calculated directly from these metrics.",
      url: "seo",
      score: lhr.seoScore * 100
    },
    {
      title: "Best Practices",
      description: "Values are estimated and may vary. The performance score is calculated directly from these metrics.",
      url: "best-practices",
      score: lhr.bestPracticesScore * 100
    },
    {
      title: "Accessibility",
      description: "Values are estimated and may vary. The performance score is calculated directly from these metrics.",
      url: "accessibility",
      score: lhr.accessibilityScore * 100
    },
    {
      title: "PWA",
      description: "Values are estimated and may vary. The performance score is calculated directly from these metrics.",
      url: "pwa",
      score: lhr.pwaScore * 100
    },
  ]

  const categoryCards = data.map((category, index) => {

    const url = toLink(URL_INSTITUTION, country.url, institution.url, URL_INSTITUTION_OM, category.url);

    return (
      <Card key={category.url + index} component={Link} href={url}>
        <LhrRingProgress
          title={category.title}
          score={category.score}
          description={category.description}
          size={"md"}
        />
      </Card>
    )
  });

  return (
    <LayoutContainer footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('online-marketing-title', { institution: institution?.name })}</title>
        <meta key={"description"} name="description" content={t('online-marketing-description')} />
      </Head>

      <Breadcrumb countryInfo={country} institutionInfo={institution} />

      <InstitutionNav title={institution.name} />

      <WhitePaper>

        <Stack>

          <div>
            <Title order={2}>Online Marketing Analysis</Title>
            <Text>This analysis is based on Googles Lighthouse tool...</Text>
          </div>

          <SimpleGrid
            breakpoints={[
              { minWidth: 'sm', cols: 2 },
              { minWidth: 'md', cols: 3 },
              { minWidth: 'lg', cols: 4 },
            ]}
          >
            {categoryCards}
          </SimpleGrid>

        </Stack>

      </WhitePaper>
    </LayoutContainer>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {

  let countryUrl = "" + context?.params?.Country;
  let institutionUrl = "" + context?.params?.Institution;

  // Get Country and Institution
  const country = await getCountry(countryUrl);
  const institution = await getInstitution({ institutionUrl });

  // Footer Data
  // Get all countries
  const countryList = await getCountries();
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  // Get LHR
  const lhr = institution?.id ? await getLhrSimplified(institution.url) : null;

  return {
    props: {
      institution,
      country,
      lhr,
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


export default InstitutionOnlineMarketing