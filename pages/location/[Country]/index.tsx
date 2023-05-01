import { Box, Grid, Group, SimpleGrid, Stack, Title } from '@mantine/core';
import { country } from '@prisma/client';
import { Reorder } from 'framer-motion';
import { produce } from 'immer';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import GenericPageHeader from '../../../components/Block/GenericPageHeader';
import StateCard from '../../../components/Card/StateCard';
import ResponsiveWrapper from '../../../components/Container/ResponsiveWrapper';
import ItemSearch from '../../../components/Searchbox/ItemSearch';
import OrderBySelect from '../../../components/Select/OrderBySelect';
import Breadcrumb from '../../../features/Breadcrumb/Breadcrumb';
import { FooterContent } from '../../../features/Footer/Footer';
import CountryMapContainer from '../../../features/Map/CountryMapContainer';
import { getStatesDetailedByCountry } from '../../../lib/prisma/prismaDetailedQueries';
import { getCountries, getCountry } from '../../../lib/prisma/prismaQueries';
import { DetailedState } from '../../../lib/types/DetailedDatabaseTypes';
import { OrderBy } from '../../../lib/types/OrderBy';
import { Searchable, StateCardData } from '../../../lib/types/UiHelperTypes';
import { getStaticPathsCountries } from '../../../lib/url-helper/staticPathFunctions';
import { convertStateToCardData } from '../../../lib/util/conversionUtil';
import { generateSearchable, getLocalizedName } from '../../../lib/util/util';

type Props = {
  searchableStates: Searchable[],
  countryInfo: country,
  footerContent: FooterContent[],
}

const CountryPage: NextPage<Props> = ({ searchableStates, countryInfo, footerContent }: Props) => {

  const query = useRouter().query;

  // DATA LISTS
  const [dataList, setDataList] = useState<Searchable[]>(searchableStates);

  // Filter
  const [orderBy, setOrderBy] = useState<OrderBy>("popularity");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Translations
  const { t, lang } = useTranslation('location');
  const localizedCountryName = getLocalizedName({ lang: lang, dbTranslated: countryInfo });

  // Translated State Names
  const translatedStates = new Map<string, { name: string, url: string }>();
  searchableStates.map((searchable) => {
    const state = searchable.data as StateCardData;
    translatedStates.set(state.id, { name: state.name, url: state.url });
  });

  useEffect(() => {

    setDataList(
      produce((draft) => {
        draft.sort((a, b) => {
          if (orderBy === "az") {
            return a.data.name.localeCompare(b.data.name);
          } else if (orderBy === "za") {
            return b.data.name.localeCompare(a.data.name);
          } else if (orderBy === "popularity") {
            return b.data.popularity - a.data.popularity;
          } else {
            return 0;
          }
        });

        if (searchTerm === "") {
          draft.forEach((searchable) => {
            searchable.visible = true
          });
        } else {
          draft.forEach((searchable) => {
            searchable.visible = searchable.data.name.toLowerCase().startsWith(searchTerm.toLowerCase());
          });
        }
      })
    );

  }, [orderBy, lang, searchTerm]);

  return (
    <ResponsiveWrapper footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('meta.country-title', { country: localizedCountryName })}</title>
        <meta key={"description"} name="description" content={t('meta.country-description', { country: localizedCountryName })} />
      </Head>

      <Breadcrumb countryInfo={countryInfo} />

      <Stack>

        <GenericPageHeader title={t('country.title', { country: localizedCountryName })} description={t('country.subtitle', { country: localizedCountryName })} />

        <Grid gutter={'lg'}>

          <Grid.Col sm={12}>
            <Title order={2} my={'md'}>{t('country.country-map-title', { country: localizedCountryName })}</Title>
            <Box sx={{ zIndex: 0 }}>
              <CountryMapContainer
                country={query.Country?.toString() ?? ""}
                stateNames={translatedStates}
              />
            </Box>
          </Grid.Col>

          <Grid.Col sm={12}>
            <Stack>
              <Title order={2}>{t('country.list-title', { country: localizedCountryName })}</Title>
              <Group position='apart' >
                <ItemSearch
                  label={t('country.search-label', { country: localizedCountryName })}
                  placeholder={t('country.search-placeholder')}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
                <OrderBySelect variant='default' orderBy={orderBy} handleChange={setOrderBy} />
              </Group>

              <Reorder.Group values={dataList} onReorder={setDataList} as={"div"}>
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
                    dataList.filter((searchable) => searchable.visible).map((searchableState, i) => {
                      const state = searchableState.data as StateCardData;
                      return (
                        <Reorder.Item key={state.id} as={"div"} value={searchableState} drag={false}>
                          <StateCard key={state.id} state={state} />
                        </Reorder.Item>
                      )
                    })
                  }
                </SimpleGrid>
              </Reorder.Group>

            </Stack>
          </Grid.Col>

        </Grid>

      </Stack>

    </ResponsiveWrapper>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths = await getStaticPathsCountries(locales);
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
  if (countryInfo === null) {
    return {
      notFound: true,
    }
  }

  const detailedStates: DetailedState[] = await getStatesDetailedByCountry(countryUrl);
  const stateData: StateCardData[] = detailedStates.map(state => convertStateToCardData(state, lang));
  const searchableStates: Searchable[] = generateSearchable({ type: "State", data: stateData });

  // Footer Data
  const countryList = await getCountries();
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  const props: Props = {
    searchableStates,
    countryInfo,
    footerContent
  }

  return { props };
}

export default CountryPage