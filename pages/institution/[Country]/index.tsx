import { Group, SimpleGrid, Stack, Text, useMantineTheme } from '@mantine/core';
import { Country, State } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import GenericPageHeader from '../../../components/Block/GenericPageHeader';
import InstitutionCard from '../../../components/Card/InstitutionCard';
import ResponsiveWrapper from '../../../components/Container/ResponsiveWrapper';
import CustomPagination from '../../../components/Pagination/CustomPagination';
import ItemApiSearch from '../../../components/Searchbox/ItemApiSearch';
import OrderBySelect from '../../../components/Select/OrderBySelect';
import AdContainer from '../../../features/Ads/AdContainer';
import Breadcrumb from '../../../features/Breadcrumb/Breadcrumb';
import { FooterContent } from '../../../features/Footer/Footer';
import SITE_URL from '../../../lib/globalUrl';
import { getInstitutionsDetailedByCountry } from '../../../lib/prisma/prismaDetailedQueries';
import { getCountries, getCountry } from '../../../lib/prisma/prismaQueries';
import { searchInstitutions } from '../../../lib/prisma/prismaSearch';
import { DetailedInstitution } from '../../../lib/types/DetailedDatabaseTypes';
import { OrderBy } from '../../../lib/types/OrderBy';
import { AdCardData, InstitutionCardData } from '../../../lib/types/UiHelperTypes';
import { URL_INSTITUTION } from '../../../lib/url-helper/urlConstants';
import { convertInstitutionToCardData } from '../../../lib/util/conversionUtil';
import { getLocalizedName, getUniquesFromArray, toLink } from '../../../lib/util/util';

export const INSTITUTIONS_PER_PAGE = 30;

type Props = {
  institutionData: InstitutionCardData[],
  institutionStates: State[],
  pageCount: number | null,
  countryInfo: Country,
  countryList: Country[],
  ads: AdCardData[][],
  footerContent: FooterContent[],
}

const InstitutionCountryIndex: NextPage<Props> = ({ institutionData, institutionStates, pageCount, countryInfo, countryList, ads, footerContent }: Props) => {

  const { t, lang } = useTranslation('institution');

  // Query params
  const router = useRouter();
  const currentPage = router.query.page ? parseInt(router.query.page as string) : 1;
  const searchQuery = router.query.q ? router.query.q as string : undefined;
  const orderQuery = router.query.order ? router.query.order as OrderBy : undefined;

  // Filter
  const [orderBy, setOrderBy] = useState<OrderBy>(orderQuery ? orderQuery : "az");
  const [searchTerm, setSearchTerm] = useState<string>(searchQuery ? searchQuery as string : "");

  // Meta Data
  const getCanonicalLink = () => {
    const localePart = router.locale === router.defaultLocale ? "" : router.locale + "/";
    const pageNumber = currentPage > 1 ? "/page=" + currentPage : "";
    return `${SITE_URL}/${localePart}${URL_INSTITUTION}/${countryInfo.url}${pageNumber}`
  }

  const getPrevLink = () => {
    const localePart = router.locale === router.defaultLocale ? "" : router.locale + "/";
    const pageNumber = "/page=" + (currentPage - 1);
    return `${SITE_URL}/${localePart}${URL_INSTITUTION}/${countryInfo.url}${pageNumber}`
  }

  const getNextLink = () => {
    const localePart = router.locale === router.defaultLocale ? "" : router.locale + "/";
    const pageNumber = "/page=" + (currentPage + 1);
    return `${SITE_URL}/${localePart}${URL_INSTITUTION}/${countryInfo.url}${pageNumber}`
  }

  // UI
  const countryName = getLocalizedName({ lang: lang, dbTranslated: countryInfo });
  const theme = useMantineTheme();

  // Search
  const runSearch = async (q: string | undefined, order: OrderBy) => {
    if (q && q.length <= 2) return;
    router.push({
      pathname: toLink(URL_INSTITUTION, countryInfo.url),
      query: q ? {
        q,
        order,
      } : {
        order,
      },
    });
  }

  const cancelSearch = () => {
    setSearchTerm("");
    router.push({
      pathname: toLink(URL_INSTITUTION, countryInfo.url),
      query: {
        order: orderBy,
      },
    });
  }

  return (
    <ResponsiveWrapper footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('meta.country-title', { country: countryName })}</title>
        <meta key={"description"} name="description" content={t('meta.country-description')} />
        {pageCount && <link rel="canonical" href={getCanonicalLink()} />}
        {pageCount && currentPage > 1 && <link rel='prev' href={getPrevLink()} />}
        {pageCount && currentPage < pageCount && <link rel='next' href={getNextLink()} />}
        {(searchQuery || orderQuery) && <meta name="robots" content="noindex, nofollow" />}
      </Head>

      <Breadcrumb countryInfo={countryInfo} />

      <Stack>

        <GenericPageHeader title={t('location.title', { institution: countryInfo.name })} description={t('location.subtitle', { institution: countryInfo.name })} />

        <Group position='apart' >
          <ItemApiSearch
            label={t('location.search-label')}
            placeholder={t('location.search-placeholder')}
            onSearch={() => runSearch(searchTerm, orderBy)}
            value={searchTerm}
            setValue={setSearchTerm}
            onCancel={cancelSearch}
          />
          <OrderBySelect
            variant='default'
            orderBy={orderBy}
            handleChange={(state) => {
              setOrderBy(state);
              runSearch(searchQuery, state)
            }}
          />
        </Group>

        <Group>
          {
            searchQuery ? (
              <Text>{t('location.search-results-label', { count: institutionData.length, query: searchTerm })}</Text>
            ) : (
              <Text>
                <Trans
                  i18nKey="institution:location.page-results-label"
                  components={[<Text key={0} component='span' weight={'bold'} />, <Text key={1} component='span' weight={'bold'} />]}
                  values={{
                    fromName: institutionData.at(0)?.Institution.name,
                    toName: institutionData.at(-1)?.Institution.name,
                    from: (currentPage - 1) * institutionData.length + 1,
                    to: currentPage * institutionData.length,
                  }}
                />
              </Text>
            )
          }
        </Group>

        <SimpleGrid
          cols={4}
          spacing="lg"
          breakpoints={[
            { minWidth: theme.breakpoints.lg, cols: 3, spacing: 'md' },
            { minWidth: theme.breakpoints.sm, cols: 2, spacing: 'sm' },
            { minWidth: theme.breakpoints.xs, cols: 1, spacing: 'sm' },
          ]}
        >
          {
            institutionData.map((institute, i) => (
              <InstitutionCard
                key={i}
                data={institute}
                country={countryList.find(c => c.id === institute.mainCountryId)}
                state={institutionStates.find(c => c.id === institute.mainStateId)}
              />
            ))
          }
        </SimpleGrid>

      </Stack>

      {
        pageCount && !searchQuery && (
          <CustomPagination
            currentPage={currentPage}
            pageCount={pageCount}
            rootPath={toLink(URL_INSTITUTION, countryInfo.url)}
          />
        )
      }

      <AdContainer
        ads={ads}
        wrapInContainer
      />

    </ResponsiveWrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const lang = context.locale || "en";
  const pageIndex = context.query.page ? parseInt(context.query.page as string) : 1;
  const orderBy = context.query.order ? context.query.order as OrderBy : "az";
  const searchQuery = context.query.q ? context.query.q as string : null;
  const countryUrl = "" + context?.params?.Country;
  const limit = INSTITUTIONS_PER_PAGE;

  const countryInfo = await getCountry(countryUrl);
  if (countryInfo === null) {
    return {
      notFound: true,
    }
  }

  const searchedInstitutions = searchQuery ? (await searchInstitutions(searchQuery)) : undefined;
  const institutions: DetailedInstitution[] = await getInstitutionsDetailedByCountry(countryInfo.id, orderBy, searchedInstitutions);

  let dataSlice = institutions;
  let pageCount: null | number = null;

  // Detailed Subject Types
  if (!searchQuery) {
    dataSlice = institutions.slice((pageIndex - 1) * limit, pageIndex * limit);
    pageCount = Math.ceil(institutions.length / limit);

    if (pageIndex > pageCount) {
      return {
        notFound: true,
      }
    }
  }

  // Convert to CardData to lower size
  const institutionData: InstitutionCardData[] = dataSlice.map(inst => convertInstitutionToCardData(inst, lang));

  // List of states for institutes
  const institutionStates = getUniquesFromArray({ type: "State", data: dataSlice.map(inst => inst.City.State) }) as State[];

  // Footer Data
  // Get all countries
  const countryList = await getCountries();
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  const props: Props = {
    institutionData,
    institutionStates,
    pageCount,
    countryInfo,
    countryList,
    ads: [],
    footerContent,
  }

  return { props };
}

export default InstitutionCountryIndex;