import { Grid, SimpleGrid, Stack, Title } from '@mantine/core';
import { Country } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import CountryMapContainer from '../../../components/dynamic/CountryMapContainer';
import GenericPageHeader from '../../../components/elements/GenericPageHeader';
import StateCard from '../../../components/elements/itemcards/StateCard';
import Breadcrumb from '../../../components/layout/Breadcrumb';
import { FooterContent } from '../../../components/layout/footer/Footer';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import Meta from '../../../components/partials/Meta';
import prisma from '../../../lib/prisma';
import { getCountries, getCountry, getStatesDetailedByCountry } from '../../../lib/prismaQueries';
import { DetailedState } from '../../../lib/types/DetailedDatabaseTypes';
import { getLocalizedName } from '../../../lib/util';

interface Props {
  states: DetailedState[],
  countryInfo: Country,
  footerContent: FooterContent[],
}

const CountryPage: NextPage<Props> = ({ states, countryInfo, footerContent }:Props) => {

  const query = useRouter().query;

  // Translations
  const { t, lang } = useTranslation('location');
  const langContent = {
    pageTitle: t('common:page-title')
  }
  const localizedCountryName = getLocalizedName({ lang: lang, dbTranslated: countryInfo });

  // Translated State Names
  const translatedStates = new Map<string, { name: string, url: string }>();
  states.map((state) => {
    translatedStates.set(
      state.id,
      { name: getLocalizedName({ lang: lang, state: state }), url: state.url }
    );
  })

  return (
    <LayoutContainer footerContent={footerContent}>

      <Meta
        title={langContent.pageTitle + ' - ' + localizedCountryName}
        description='Very nice page'
      />

      <Breadcrumb countryInfo={countryInfo} />

      <Stack>

        <GenericPageHeader title={localizedCountryName} description={"Ein schönes Land"} />

        <Grid>

          <Grid.Col sm={12}>
            <Title order={6} mb={2}>Map of Germany</Title>
            <CountryMapContainer
              country={query.Country?.toString() ?? ""}
              stateNames={translatedStates}
            />
          </Grid.Col>

          <Grid.Col sm={12}>
            <Title order={6} mb={2}>List of states</Title>
            <SimpleGrid
              cols={4}
              spacing="lg"
              breakpoints={[
                { maxWidth: 980, cols: 3, spacing: 'md' },
                { maxWidth: 755, cols: 2, spacing: 'sm' },
                { maxWidth: 600, cols: 1, spacing: 'sm' },
              ]}
            >
              {
                states.map((state, i) => (
                  <StateCard key={i} state={state} />
                ))
              }
            </SimpleGrid>
          </Grid.Col>

        </Grid>

      </Stack>

    </LayoutContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {

  const countries = await prisma.country.findMany();

  let paths: {
    params: ParsedUrlQuery;
    locale?: string | undefined;
  }[] = [];

  // Add locale to every possible path
  locales?.forEach((locale) => {
    countries.forEach((country) => {
      paths.push({
        params: {
          Country: country.url,
        },
        locale,
      });
    })
  });

  return {
    paths: paths,
    fallback: false
  }
}

export async function getStaticProps(context: GetStaticPropsContext) {

  let countryUrl = "" + context?.params?.Country;

  // Get information on the country of this particular page
  const countryInfo = await getCountry(countryUrl);

  const detailedStates: DetailedState[] = await getStatesDetailedByCountry(countryUrl);

  // Footer Data
  const countryList = await getCountries("asc");
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: { states: detailedStates, countryInfo: countryInfo, footerContent: footerContent }
  }

}

export default CountryPage