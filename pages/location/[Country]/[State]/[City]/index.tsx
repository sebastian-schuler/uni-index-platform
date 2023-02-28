import { Group, SimpleGrid, Stack } from '@mantine/core';
import { City, Country, State } from '@prisma/client';
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

interface Props {
  countryList: Country[],
  institutionData: InstitutionCardData[],
  institutionStates: State[],
  footerContent: FooterContent[],
  cityInfo: (City & {
    State: State & {
      Country: Country;
    };
  }),
}

const CityPage: NextPage<Props> = ({ countryList, institutionData, institutionStates, footerContent, cityInfo }: Props) => {

  const { t } = useTranslation('location');

  return (
    <ResponsiveWrapper footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('city-title', { city: cityInfo.name })}</title>
        <meta key={"description"} name="description" content={t('city-description', { city: cityInfo.name })} />
      </Head>

      <Breadcrumb
        countryInfo={cityInfo.State.Country}
        stateInfo={cityInfo.State}
        cityInfo={cityInfo}
      />

      <Stack>
        <GenericPageHeader title={cityInfo.name} description={t('city-subtitle', { city: cityInfo.name })} />

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
          cols={4}
          spacing="lg"
          breakpoints={[
            { maxWidth: 980, cols: 3, spacing: 'md' },
            { maxWidth: 755, cols: 2, spacing: 'sm' },
            { maxWidth: 600, cols: 1, spacing: 'sm' },
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
          Country: rootCity.State.Country.url,
          State: rootCity.State.url,
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
  const institutionList = cityInfo !== null ? (await getInstitutionsDetailedByCity(cityInfo.id)) : [];
  const institutionData: InstitutionCardData[] = institutionList.map(inst => convertInstitutionToCardData(inst, lang));

  // List of states for institutes
  const institutionStates: State[] = institutionList.map(inst => {
    return { ...inst.City.State }
  });

  // Footer Data
  // Get all countries
  const countryList = await getCountries();
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: {
      countryList,
      institutionData,
      institutionStates,
      footerContent,
      cityInfo
    }
  }

}

export default CityPage