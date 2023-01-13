import { Stack, Text } from '@mantine/core'
import { Card, SimpleGrid, Title } from '@mantine/core'
import { Country, Institution } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import Link from 'next/link'
import LhrRingProgress from '../../../../../components/elements/onlinemarketing/LhrRingProgress'
import Meta from '../../../../../components/partials/Meta'
import WhitePaper from '../../../../../components/WhitePaper'
import Breadcrumb from '../../../../../layout/Breadcrumb'
import { FooterContent } from '../../../../../layout/footer/Footer'
import LayoutContainer from '../../../../../layout/LayoutContainer'
import InstitutionNav from '../../../../../layout/subnav/InstitutionNav'
import { getLhrSimplified } from '../../../../../lib/lighthouse/lhrSimplifier'
import { getCountries, getCountry, getInstitution } from '../../../../../lib/prisma/prismaQueries'
import { LhrSimple } from '../../../../../lib/types/lighthouse/CustomLhrTypes'
import { getStaticPathsInstitution } from '../../../../../lib/url-helper/staticPathFunctions'
import { URL_INSTITUTION, URL_INSTITUTION_ONLINEMARKETING } from '../../../../../lib/url-helper/urlConstants'
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

  if (!lhr) return (<div>no LHR found</div>);

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
    return (
      <Link key={category.url+index} href={toLink(URL_INSTITUTION, country.url, institution.url, URL_INSTITUTION_ONLINEMARKETING, category.url)} passHref>
        <Card component='a'>
          <LhrRingProgress
            title={category.title}
            score={category.score}
            description={category.description}
            size={"md"}
          />
        </Card>
      </Link>
    )
  });

  return (
    <LayoutContainer footerContent={footerContent}>

      <Meta
        title={'Uni Index - '}
        description='Very nice page'
      />

      <Breadcrumb countryInfo={country} institutionInfo={institution} />

      <InstitutionNav title={institution.name} />

      <WhitePaper>

        <Stack>

          <div>
            <Title order={2}>Online Marketing Analysis</Title>
            <Text>This analysis is based on Googles Lighthouse tool...</Text>
          </div>

          <SimpleGrid cols={3}>
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
  const lhr = institution?.id ? await getLhrSimplified(institution.id) : null;

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