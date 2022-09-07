import { Masonry } from '@mui/lab';
import Grid from '@mui/material/Grid';
import NoSsr from '@mui/material/NoSsr';
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
import { getDBLocale, getLocalizedName } from '../../../lib/util';

type Props = {
  states: DetailedState[],
  countryInfo: Country,
  footerContent: FooterContent[],
}

const CountryPage: NextPage<Props> = props => {

  const query = useRouter().query;
  const { states, countryInfo, footerContent } = props;

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

      <GenericPageHeader title={localizedCountryName} description={"Ein schönes Land"} />

      <Grid container columnSpacing={4}>

        <Grid item xs={12} sm={4} xl={6}>

          <Masonry columns={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2 }} spacing={3} sx={{ paddingX: 0, marginBottom: 6 }}>
            {
              states.map((state, i) => (
                <StateCard key={i} state={state} />
              ))
            }
          </Masonry>

        </Grid>

        <Grid item
          xs={12} sm={8} xl={6}
          flexGrow={1}
          component={'section'}
        >

          {/* TODO idk if this is good */}
          <NoSsr>
            <CountryMapContainer
              country={query.Country?.toString() ?? ""}
              stateNames={translatedStates}
            />
          </NoSsr>

        </Grid>

      </Grid>

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
  let localeDb = getDBLocale(context.locale);

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