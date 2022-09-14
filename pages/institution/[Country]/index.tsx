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
import { getCountries, getCountry, getInstitutionsDetailedByCountry } from '../../../lib/prisma/prismaQueries';
import { DetailedInstitution } from '../../../lib/types/DetailedDatabaseTypes';
import { getLocalizedName } from '../../../lib/util';

interface Props {
  institutions: DetailedInstitution[],
  countryInfo: Country,
  footerContent: FooterContent[],
}

const index: NextPage<Props> = ({ institutions, countryInfo, footerContent }: Props) => {

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
            institutions.map((institution, i) => (
              // searchableCountry.visible && (
              <InstitutionCard key={i} institution={institution} />
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

  let countryUrl = "" + context?.params?.Country;

  const countryInfo = await getCountry(countryUrl);
  const institutions: DetailedInstitution[] = countryInfo !== null ? (await getInstitutionsDetailedByCountry(countryInfo.id)) : [];

  // Footer Data
  // Get all countries
  const countryList = await getCountries("asc");
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: { institutions: institutions, countryInfo: countryInfo, footerContent: footerContent }
  }

}

export default index