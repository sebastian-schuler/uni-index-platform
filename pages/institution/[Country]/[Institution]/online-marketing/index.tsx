import { Group, Stack, Text } from '@mantine/core'
import { Card, SimpleGrid, Title } from '@mantine/core'
import { Country, Institution } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import Link from 'next/link'
import LhrRingProgress from '../../../../../features/OnlineMarketing/LhrRingProgress'
import WhitePaper from '../../../../../components/Paper/WhitePaper'
import Breadcrumb from '../../../../../features/Breadcrumb/Breadcrumb'
import { FooterContent } from '../../../../../features/Footer/Footer'
import ResponsiveWrapper from '../../../../../components/Container/ResponsiveWrapper'
import InstitutionNav from '../../../../../features/Navigation/InstitutionNav'
import { getLhrSimplified } from '../../../../../lib/lighthouse/lhrSimplifier'
import { getCountries, getCountry, getInstitution } from '../../../../../lib/prisma/prismaQueries'
import { LhrSimple } from '../../../../../lib/types/lighthouse/CustomLhrTypes'
import { getStaticPathsInstitution } from '../../../../../lib/url-helper/staticPathFunctions'
import { URL_INSTITUTION, URL_INSTITUTION_OM } from '../../../../../lib/url-helper/urlConstants'
import { toLink } from '../../../../../lib/util/util'
import dayjs from 'dayjs';
import MantineLink from '../../../../../components/Link/MantineLink'
import Trans from 'next-translate/Trans'

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
    <ResponsiveWrapper footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('online-marketing.meta.title-nodata', { institution: institution?.name })}</title>
        <meta key={"description"} name="description" content={t('online-marketing.meta.description')} />
      </Head>

      <Breadcrumb countryInfo={country} institutionInfo={institution} />

      <InstitutionNav title={institution.name} />

      <WhitePaper>No LHR data</WhitePaper>

    </ResponsiveWrapper>
  );

  const data: CategoryData[] = [
    {
      title: t('online-marketing.categories.performance-header'),
      description: t('online-marketing.categories.performance-text'),
      url: "performance",
      score: lhr.performanceScore * 100
    },
    {
      title: t('online-marketing.categories.seo-header'),
      description: t('online-marketing.categories.seo-text'),
      url: "seo",
      score: lhr.seoScore * 100
    },
    {
      title: t('online-marketing.categories.bestpractices-header'),
      description: t('online-marketing.categories.bestpractices-text'),
      url: "best-practices",
      score: lhr.bestPracticesScore * 100
    },
    {
      title: t('online-marketing.categories.accessibility-header'),
      description: t('online-marketing.categories.accessibility-text'),
      url: "accessibility",
      score: lhr.accessibilityScore * 100
    },
    {
      title: t('online-marketing.categories.pwa-header'),
      description: t('online-marketing.categories.pwa-text'),
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

  const lastUpdate = dayjs(lhr.lastUpdate * 1000).format('DD/MM/YYYY');

  return (
    <ResponsiveWrapper footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('online-marketing.meta.title', { institution: institution?.name })}</title>
        <meta key={"description"} name="description" content={t('online-marketing.meta.description')} />
      </Head>

      <Breadcrumb countryInfo={country} institutionInfo={institution} />

      <InstitutionNav title={institution.name} />

      <WhitePaper>

        <Stack>

          <div>
            <Title order={2}>{t('online-marketing.header')}</Title>
            <Text>{t('online-marketing.header-text', { name: institution.name })}</Text>
          </div>

          <Group position='apart'>
            <Text>{t('online-marketing.label-lastupdate', { date: lastUpdate })}</Text>
            <Text>
              <Trans
                i18nKey='institution:online-marketing.label-website'
                components={[<MantineLink key={'label-website'} type='external' url={lhr.institution.website} />]}
                values={{ label: lhr.institution.website }}
              />
            </Text>
          </Group>

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
    </ResponsiveWrapper>
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