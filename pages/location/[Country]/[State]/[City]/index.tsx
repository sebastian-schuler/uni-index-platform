import { Group, SimpleGrid, Stack, useMantineTheme } from '@mantine/core';
import { city, country, state } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import GenericPageHeader from '../../../../../components/Block/GenericPageHeader';
import InstitutionCard from '../../../../../components/Card/InstitutionCard';
import Breadcrumb from '../../../../../features/Breadcrumb/Breadcrumb';
import { FooterContent } from '../../../../../features/Footer/Footer';
import ResponsiveWrapper from '../../../../../components/Container/ResponsiveWrapper';
import { getInstitutionsDetailedByCity } from '../../../../../lib/prisma/prismaDetailedQueries';
import { getCityStateCountryByCity, getCountries } from '../../../../../lib/prisma/prismaQueries';
import { getCityStateCountryPaths } from '../../../../../lib/prisma/prismaUrlPaths';
import { InstitutionCardData } from '../../../../../lib/types/UiHelperTypes';
import { convertInstitutionToCardData } from '../../../../../lib/util/conversionUtil';

type Props = {
  countryList: country[],
  institutionData: InstitutionCardData[],
  institutionStates: state[],
  footerContent: FooterContent[],
  cityInfo: (city & {
    state: state & {
      country: country;
    };
  }),
}

const CityPage: NextPage<Props> = ({ countryList, institutionData, institutionStates, footerContent, cityInfo }: Props) => {

  const { t } = useTranslation('location');
  const theme = useMantineTheme();

  return (
    <ResponsiveWrapper footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('meta.city-title', { city: cityInfo.name })}</title>
        <meta key={"description"} name="description" content={t('meta.city-description', { city: cityInfo.name })} />
      </Head>

      <Breadcrumb
        countryInfo={cityInfo.state.country}
        stateInfo={cityInfo.state}
        cityInfo={cityInfo}
      />

      <Stack>
        <GenericPageHeader title={t('city.title', { city: cityInfo.name })} description={t('city.subtitle', { city: cityInfo.name })} />

        <Group position='apart' >
          {/* <SearchBox
                        label={langContent.searchLabel}
                        placeholder={langContent.searchPlaceholder}
                        searchableList={dataList}
                        setSearchableList={setDataList}
                    />
                    <OrderBySelect orderBy={orderBy} handleChange={handleOrderChange} /> */}
        </Group>

        <SimpleGrid
          spacing="lg"
          breakpoints={[
            { minWidth: theme.breakpoints.lg, cols: 3, spacing: 'md' },
            { minWidth: theme.breakpoints.sm, cols: 2, spacing: 'sm' },
            { minWidth: theme.breakpoints.xs, cols: 1, spacing: 'sm' },
          ]}
        >
          {
            institutionData.map((institution, i) => (
              // searchable.visible && (
              <InstitutionCard
                key={i}
                data={institution}
                country={countryList.find(country => country.id === institution.mainCountryId)}
                state={institutionStates.find(state => state.id === institution.mainStateId)}
              />
              // )
            ))
          }
        </SimpleGrid>

      </Stack>

    </ResponsiveWrapper >
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {

  const pathUrls = await getCityStateCountryPaths();

  let paths: {
    params: ParsedUrlQuery;
    locale?: string | undefined;
  }[] = [];

  // Add locale to every possible path
  locales?.forEach((locale) => {
    pathUrls.forEach((rootCity) => {
      paths.push({
        params: {
          Country: rootCity.state.country.url,
          State: rootCity.state.url,
          City: rootCity.url,
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

  const lang = context.locale || "en";
  let cityUrl = "" + context?.params?.City;
  const cityInfo = await getCityStateCountryByCity(cityUrl);

  if (cityInfo === null) {
    return {
      notFound: true,
    }
  }

  const institutionList = cityInfo !== null ? (await getInstitutionsDetailedByCity(cityInfo.id)) : [];
  const institutionData: InstitutionCardData[] = institutionList.map(inst => convertInstitutionToCardData(inst, lang));

  // List of states for institutes
  const institutionStates: state[] = institutionList.map(inst => {
    return { ...inst.city.state }
  });

  // Footer Data
  // Get all countries
  const countryList = await getCountries();
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  const props: Props = {
    countryList,
    institutionData,
    institutionStates,
    footerContent,
    cityInfo
  }

  return { props };
}

export default CityPage