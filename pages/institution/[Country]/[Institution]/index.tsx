import { Text, Title } from '@mantine/core';
import { Country, Institution } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import WhitePaper from '../../../../components/Paper/WhitePaper';
import Breadcrumb from '../../../../features/Breadcrumb/Breadcrumb';
import { FooterContent } from '../../../../features/Footer/Footer';
import ResponsiveWrapper from '../../../../components/Container/ResponsiveWrapper';
import InstitutionNav from '../../../../features/Navigation/InstitutionNav';
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
    <ResponsiveWrapper footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('meta.profile-title', { country: countryName, institution: institution?.name })}</title>
        <meta key={"description"} name="description" content={t('meta.profile-description')} />
      </Head>

      <Breadcrumb countryInfo={country} institutionInfo={institution} />

      <InstitutionNav title={institution?.name || ""} />

      <Title order={2}>About</Title>
      <Text>{wikipediaContent}</Text>
      <Text size={"sm"} color="dimmed">Source: Wikipedia</Text>

    </ResponsiveWrapper>
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