import { Group, SimpleGrid, Stack } from '@mantine/core';
import { Country } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { ParsedUrlQuery } from 'querystring';
import GenericPageHeader from '../../../components/elements/GenericPageHeader';
import InstitutionCard from '../../../components/elements/itemcards/InstitutionCard';
import Breadcrumb from '../../../components/layout/Breadcrumb';
import { FooterContent } from '../../../components/layout/footer/Footer';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import Meta from '../../../components/partials/Meta';
import prisma from '../../../lib/prisma/prisma';
import { getInstitutionsDetailedByCountry } from '../../../lib/prisma/prismaDetailedQueries';
import { getCountries, getCountry } from '../../../lib/prisma/prismaQueries';
import { DetailedInstitution, InstitutionCardData } from '../../../lib/types/DetailedDatabaseTypes';
import { convertInstitutionToCardData } from '../../../lib/util/conversionUtil';
import { getLocalizedName } from '../../../lib/util/util';

interface Props {
  institutionData: InstitutionCardData[],
  countryInfo: Country,
  countryList: Country[],
  footerContent: FooterContent[],
}

const InstitutionCountryIndex: NextPage<Props> = ({ institutionData, countryInfo, countryList, footerContent }: Props) => {

  const { lang } = useTranslation('common');

  const localizedCountryName = getLocalizedName({ lang: lang, dbTranslated: countryInfo });

  return (
    <LayoutContainer footerContent={footerContent}>

      <Meta
        title={'Uni Index - ' + localizedCountryName}
        description='Very nice page'
      />

      <Breadcrumb countryInfo={countryInfo} />

      <Stack>

        <GenericPageHeader title={countryInfo.name} description={`Find universities located in ${countryInfo.name}`} />

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
            institutionData.map((institute, i) => (
              // searchableCountry.visible && (
              <InstitutionCard key={i} data={institute} country={countryList.find(c => c.id === institute.mainCountryId)} />
              // )
            ))
          }
        </SimpleGrid>

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

  const countryInfo = await getCountry(countryUrl);
  const institutions: DetailedInstitution[] = countryInfo !== null ? (await getInstitutionsDetailedByCountry(countryInfo.id)) : [];

  // Convert to CardData to lower size
  const institutionData: InstitutionCardData[] = institutions.map(inst => convertInstitutionToCardData(inst, lang));

  // Footer Data
  // Get all countries
  const countryList = await getCountries();
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: {
      institutionData,
      countryInfo,
      countryList,
      footerContent,
    }
  }

}

export default InstitutionCountryIndex;