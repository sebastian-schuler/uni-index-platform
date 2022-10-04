import { Group, SimpleGrid, Stack } from '@mantine/core';
import { City, Country, State } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { ParsedUrlQuery } from 'querystring';
import GenericPageHeader from '../../../../../components/elements/GenericPageHeader';
import InstitutionCard from '../../../../../components/elements/itemcards/InstitutionCard';
import Breadcrumb from '../../../../../components/layout/Breadcrumb';
import { FooterContent } from '../../../../../components/layout/footer/Footer';
import LayoutContainer from '../../../../../components/layout/LayoutContainer';
import Meta from '../../../../../components/partials/Meta';
import { getInstitutionsDetailedByCity } from '../../../../../lib/prisma/prismaDetailedQueries';
import { getCityStateCountryByCity, getCountries } from '../../../../../lib/prisma/prismaQueries';
import { getCityStateCountryPaths } from '../../../../../lib/prisma/prismaUrlPaths';
import { DetailedInstitution } from '../../../../../lib/types/DetailedDatabaseTypes';

interface Props {
  institutionList: DetailedInstitution[],
  footerContent: FooterContent[],
  cityInfo: (City & {
    State: State & {
      Country: Country;
    };
  }),
}

const CityPage: NextPage<Props> = ({ institutionList, footerContent, cityInfo }: Props) => {

  const { t } = useTranslation('common');
  const langContent = {
    pageTitle: t('common:page-title')
  }

  return (
    <LayoutContainer footerContent={footerContent}>

      <Meta
        title={langContent.pageTitle + ' - ' + cityInfo.name}
        description='Very nice page'
      />

      <Breadcrumb
        countryInfo={cityInfo.State.Country}
        stateInfo={cityInfo.State}
        cityInfo={cityInfo}
      />

      <Stack>
        <GenericPageHeader title={cityInfo.name} description={`Find courses located in the city of ${cityInfo.name}`} />

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
            institutionList.map((institution, i) => (
              // searchable.visible && (
              <InstitutionCard key={i} institution={institution} /> //TODO make searchable
              // )
            ))
          }
        </SimpleGrid>

      </Stack>

    </LayoutContainer >
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

  let cityUrl = "" + context?.params?.City;
  const cityInfo = await getCityStateCountryByCity(cityUrl);
  const institutions = cityInfo !== null ? (await getInstitutionsDetailedByCity(cityInfo.id)) : [];

  // Footer Data
  // Get all countries
  const countryList = await getCountries("asc");
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: { institutionList: institutions, footerContent: footerContent, cityInfo: cityInfo }
  }

}

export default CityPage