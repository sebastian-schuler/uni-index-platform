import { useMantineTheme, Text, Title, Box, Paper } from '@mantine/core';
import { Country, Institution } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { ParsedUrlQuery } from 'querystring';
import InstitutionPaper from '../../../../components/elements/institution/InstitutionPaper';
import Breadcrumb from '../../../../components/layout/Breadcrumb';
import { FooterContent } from '../../../../components/layout/footer/Footer';
import LayoutContainer from '../../../../components/layout/LayoutContainer';
import InstitutionNav from '../../../../components/layout/subnav/InstitutionNav';
import Meta from '../../../../components/partials/Meta';
import searchWikipedia from '../../../../lib/apis/wikipediaHandler';
import { getCountries, getCountry, getInstitution, getInstitutionPaths } from '../../../../lib/prismaQueries';

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

      <InstitutionPaper>
        <Title order={2}>About</Title>
        <Text>{wikipediaContent}</Text>
        <Text size={"sm"} color="dimmed">Source: Wikipedia</Text>
      </InstitutionPaper>

    </LayoutContainer>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {

  let countryUrl = "" + context?.params?.Country;
  let institutionUrl = "" + context?.params?.Institution;

  // Get Wikipedia Data
  const wikiDataRes = await searchWikipedia("Hochschule Kaiserslautern", "" + context.locale)

  const country = await getCountry(countryUrl);
  const institution = await getInstitution(institutionUrl);

  // Footer Data
  // Get all countries
  const countryList = await getCountries("asc");
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: { institution: institution, country: country, wikipediaContent: wikiDataRes, footerContent: footerContent }
  }

}

// All available Paths
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


export default InstitutionPage