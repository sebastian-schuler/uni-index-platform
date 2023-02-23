import { Grid, SimpleGrid, Stack, Title, Box } from '@mantine/core';
import { Country } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import CountryMapContainer from '../../../components/dynamic/CountryMapContainer';
import GenericPageHeader from '../../../components/elements/GenericPageHeader';
import StateCard from '../../../components/elements/itemcards/StateCard';
import Breadcrumb from '../../../layout/Breadcrumb';
import { FooterContent } from '../../../layout/footer/Footer';
import LayoutContainer from '../../../layout/LayoutContainer';
import prisma from '../../../lib/prisma/prisma';
import { getStatesDetailedByCountry } from '../../../lib/prisma/prismaDetailedQueries';
import { getCountries, getCountry } from '../../../lib/prisma/prismaQueries';
import { DetailedState } from '../../../lib/types/DetailedDatabaseTypes';
import { StateCardData } from '../../../lib/types/UiHelperTypes';
import { convertStateToCardData } from '../../../lib/util/conversionUtil';
import { getLocalizedName } from '../../../lib/util/util';

interface Props {
  states: StateCardData[],
  countryInfo: Country,
  footerContent: FooterContent[],
}

const CountryPage: NextPage<Props> = ({ states, countryInfo, footerContent }: Props) => {

  const query = useRouter().query;

  // Translations
  const { t, lang } = useTranslation('location');
  const localizedCountryName = getLocalizedName({ lang: lang, dbTranslated: countryInfo });

  // Translated State Names
  const translatedStates = new Map<string, { name: string, url: string }>();
  states.map((state) => {
    translatedStates.set(state.id, { name: state.name, url: state.url });
  });

  return (
    <LayoutContainer footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('country-title', { country: localizedCountryName })}</title>
        <meta key={"description"} name="description" content={t('country-description', { country: localizedCountryName })} />
      </Head>

      <Breadcrumb countryInfo={countryInfo} />

      <Stack>

        <GenericPageHeader title={localizedCountryName} description={t('country-subtitle', { country: localizedCountryName })} />

        <Grid>

          <Grid.Col sm={12}>
            <Title order={2} my={'md'}>{t('state-country-map-title', { country: localizedCountryName })}</Title>
            <Box sx={{ zIndex: 0 }}>
              <CountryMapContainer
                country={query.Country?.toString() ?? ""}
                stateNames={translatedStates}
              />
            </Box>
          </Grid.Col>

          <Grid.Col sm={12}>
            <Title order={2} my={'md'}>{t('state-list-title', { country: localizedCountryName })}</Title>
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

  const countryUrl = "" + context?.params?.Country;
  const lang = context.locale || "en";

  // Get information on the country of this particular page
  const countryInfo = await getCountry(countryUrl);

  const detailedStates: DetailedState[] = await getStatesDetailedByCountry(countryUrl);
  const stateData: StateCardData[] = detailedStates.map(state => convertStateToCardData(state, lang));

  // Footer Data
  const countryList = await getCountries();
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: { states: stateData, countryInfo: countryInfo, footerContent: footerContent }
  }

}

export default CountryPage