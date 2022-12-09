import { Text, Title, useMantineTheme } from '@mantine/core';
import { Country, Institution } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import WhitePaper from '../../../../components/WhitePaper';
import Breadcrumb from '../../../../layout/Breadcrumb';
import { FooterContent } from '../../../../layout/footer/Footer';
import LayoutContainer from '../../../../layout/LayoutContainer';
import InstitutionNav from '../../../../layout/subnav/InstitutionNav';
import Meta from '../../../../components/partials/Meta';
import searchWikipedia from '../../../../lib/apis/wikipediaHandler';
import { getCountries, getCountry, getInstitution } from '../../../../lib/prisma/prismaQueries';
import { getStaticPathsInstitution } from '../../../../lib/url-helper/staticPathFunctions';

interface Props {
  institution: Institution,
  country: Country,
  wikipediaContent: string,
  footerContent: FooterContent[]
}

const InstitutionPage: NextPage<Props> = ({ institution, country, wikipediaContent, footerContent }: Props) => {

  const theme = useMantineTheme();
  const { t } = useTranslation('common');
  const langContent = {
    pageTitle: t('common:page-title'),
  }

  return (
    <LayoutContainer footerContent={footerContent}>

      <Meta
        title={langContent.pageTitle + " - "}
        description='Very nice page'
      />

      <Breadcrumb countryInfo={country} institutionInfo={institution} />

      <InstitutionNav title={institution.name} />

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
  const institution = await getInstitution(institutionUrl);

  // Get Wikipedia Data
  const wikiDataRes = institution ? (await searchWikipedia(institution.name, "" + context.locale)) : "";

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