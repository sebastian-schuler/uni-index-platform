import { Text, Title } from '@mantine/core';
import { Country, Institution } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import WhitePaper from '../../../../components/WhitePaper';
import Breadcrumb from '../../../../layout/Breadcrumb';
import { FooterContent } from '../../../../layout/footer/Footer';
import LayoutContainer from '../../../../layout/LayoutContainer';
import InstitutionNav from '../../../../layout/subnav/InstitutionNav';
import { searchWikipedia } from '../../../../lib/apis/wikipediaHandler';
import { getCountries, getCountry, getInstitution } from '../../../../lib/prisma/prismaQueries';
import { getStaticPathsInstitution } from '../../../../lib/url-helper/staticPathFunctions';
import { getLocalizedName } from '../../../../lib/util/util';

interface Props {
  institution: Institution | null,
  country: Country | null,
  wikipediaContent: string,
  footerContent: FooterContent[]
}

const InstitutionPage: NextPage<Props> = ({ institution, country, wikipediaContent, footerContent }: Props) => {

  const { t, lang } = useTranslation('institution');
  const countryName = getLocalizedName({ lang: lang, dbTranslated: country });

  return (
    <LayoutContainer footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('profile-title', { country: countryName, institution: institution?.name })}</title>
        <meta key={"description"} name="description" content={t('profile-description')} />
      </Head>

      <Breadcrumb countryInfo={country} institutionInfo={institution} />

      <InstitutionNav title={institution?.name || ""} />

      <WhitePaper>
        <Title order={2}>About</Title>
        <Text>{wikipediaContent}</Text>
        <Text size={"sm"} color="dimmed">Source: Wikipedia</Text>
      </WhitePaper>

    </LayoutContainer>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {

  let countryUrl = "" + context?.params?.Country;
  let institutionUrl = "" + context?.params?.Institution;

  const country = await getCountry(countryUrl);
  const institution = await getInstitution({ institutionUrl });

  // Get Wikipedia Data
  let wikiDataRes: string | null = null;
  if (institution) {
    wikiDataRes = await searchWikipedia(institution.name, "" + context.locale);
  }

  // Footer Data
  // Get all countries
  const countryList = await getCountries();
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: { institution: institution, country: country, wikipediaContent: wikiDataRes, footerContent: footerContent }
  }

}

// All available Paths
export const getStaticPaths: GetStaticPaths = async ({ locales }) => {

  const paths = await getStaticPathsInstitution(locales || []);

  return {
    paths: paths,
    fallback: false
  }
}


export default InstitutionPage