import { Group, SimpleGrid, Stack, useMantineTheme, Text } from '@mantine/core';
import { country, category } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import GenericPageHeader from '../../../components/Block/GenericPageHeader';
import SubjectCard from '../../../components/Card/SubjectCard';
import ResponsiveWrapper from '../../../components/Container/ResponsiveWrapper';
import CustomPagination from '../../../components/Pagination/CustomPagination';
import ItemApiSearch from '../../../components/Searchbox/ItemApiSearch';
import OrderBySelect from '../../../components/Select/OrderBySelect';
import AdContainer from '../../../features/Ads/AdContainer';
import Breadcrumb from '../../../features/Breadcrumb/Breadcrumb';
import { FooterContent } from '../../../features/Footer/Footer';
import SITE_URL from '../../../lib/globalUrl';
import { getSubjectsDetailedByCategory } from '../../../lib/prisma/prismaDetailedQueries';
import { getCountries, getSubjectType } from '../../../lib/prisma/prismaQueries';
import { searchSubjects } from '../../../lib/prisma/prismaSearch';
import { DetailedSubject } from '../../../lib/types/DetailedDatabaseTypes';
import { OrderBy } from '../../../lib/types/OrderBy';
import { AdCardData, SubjectCardData } from '../../../lib/types/UiHelperTypes';
import { URL_CATEGORIES, URL_CATEGORY } from '../../../lib/url-helper/urlConstants';
import { convertSubjectToCardData } from '../../../lib/util/conversionUtil';
import { getLocalizedName, toLink } from '../../../lib/util/util';

export const SUBJECT_PER_PAGE = 30;

type Props = {
  categoryInfo: category,
  pageCount: number | null,
  totalSubjectCount: number,
  subjectData: SubjectCardData[],
  countryList: country[],
  ads: AdCardData[][],
  footerContent: FooterContent[],
}

const SubjectCategoryPage: NextPage<Props> = ({ categoryInfo, pageCount, totalSubjectCount, subjectData, countryList, ads, footerContent }: Props) => {

  // TRANSLATION
  const { t, lang } = useTranslation('category');

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
    return `${SITE_URL}/${localePart}${URL_CATEGORIES}/${categoryInfo.url}${pageNumber}`
  }

  const getPrevLink = () => {
    const localePart = router.locale === router.defaultLocale ? "" : router.locale + "/";
    const pageNumber = "/page=" + (currentPage - 1);
    return `${SITE_URL}/${localePart}${URL_CATEGORIES}/${categoryInfo.url}${pageNumber}`
  }

  const getNextLink = () => {
    const localePart = router.locale === router.defaultLocale ? "" : router.locale + "/";
    const pageNumber = "/page=" + (currentPage + 1);
    return `${SITE_URL}/${localePart}${URL_CATEGORIES}/${categoryInfo.url}${pageNumber}`
  }

  // UI
  const courseTypeName = getLocalizedName({ lang: lang, any: categoryInfo });
  const theme = useMantineTheme();

  // Search
  const runSearch = async (q: string | undefined, order: OrderBy) => {
    if (q && q.length <= 2) return;
    router.push({
      pathname: toLink(URL_CATEGORY, categoryInfo.url),
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
      pathname: toLink(URL_CATEGORY, categoryInfo.url),
      query: {
        order: orderBy,
      },
    });
  }

  return (
    <ResponsiveWrapper footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('meta.category-title', { subject: courseTypeName })}</title>
        <meta key={"description"} name="description" content={t('meta.category-description')} />
        {pageCount && <link rel="canonical" href={getCanonicalLink()} />}
        {pageCount && currentPage > 1 && <link rel='prev' href={getPrevLink()} />}
        {pageCount && currentPage < pageCount && <link rel='next' href={getNextLink()} />}
        {(searchQuery || orderQuery) && <meta name="robots" content="noindex, nofollow" />}
      </Head>

      <Breadcrumb subjectTypeInfo={categoryInfo} />

      <Stack>

        <GenericPageHeader title={t('category.title', { category: courseTypeName })} description={t('category.subtitle', { category: courseTypeName })} />

        <Group position='apart' >
          <ItemApiSearch
            label={t('category.search-label')}
            placeholder={t('category.search-placeholder')}
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
              <Text>{t('category.search-results-label', { count: subjectData.length, query: searchTerm })}</Text>
            ) : (
              <Text>
                <Trans
                  i18nKey="category:categories.page-results-label"
                  components={[<Text key={0} component='span' weight={'bold'} />, <Text key={1} component='span' weight={'bold'} />]}
                  values={{
                    fromName: subjectData.at(0)?.name,
                    toName: subjectData.at(-1)?.name,
                    from: (currentPage - 1) * subjectData.length + 1,
                    to: currentPage * subjectData.length,
                    total: totalSubjectCount,
                  }}
                />
              </Text>
            )
          }
        </Group>

        <SimpleGrid
          spacing="lg"
          breakpoints={[
            { minWidth: theme.breakpoints.lg, cols: 3, spacing: 'md' },
            { minWidth: theme.breakpoints.md, cols: 2, spacing: 'sm' },
            { minWidth: theme.breakpoints.sm, cols: 1, spacing: 'sm' },
          ]}
        >
          {
            subjectData.map((subject, i) => {

              const country = countryList.find(c => c.id === subject.countryId);
              if (!country) return null;

              return (
                <SubjectCard key={i} data={subject} country={country} />
              )
            })
          }
        </SimpleGrid>

      </Stack>

      {
        pageCount && !searchQuery && (
          <CustomPagination
            currentPage={currentPage}
            pageCount={pageCount}
            rootPath={toLink(URL_CATEGORY, categoryInfo.url)}
          />
        )
      }

      <AdContainer
        ads={ads}
        wrapInContainer
      />

    </ResponsiveWrapper >
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const category = "" + context?.params?.Category;
  const lang = context.locale || "en";
  const pageIndex = context.query.page ? parseInt(context.query.page as string) : 1;
  const orderBy = context.query.order ? context.query.order as OrderBy : "az";
  const searchQuery = context.query.q ? context.query.q as string : null;
  const limit = SUBJECT_PER_PAGE;

  const searchedSubjects = searchQuery ? (await searchSubjects(searchQuery)) : undefined;
  const subjects: DetailedSubject[] = await getSubjectsDetailedByCategory(category, orderBy, searchedSubjects);

  let dataSlice = subjects;
  let pageCount: null | number = null

  // Detailed Subject Types
  if (!searchQuery) {
    dataSlice = subjects.slice((pageIndex - 1) * limit, pageIndex * limit);
    pageCount = Math.ceil(subjects.length / limit);

    if (pageIndex > pageCount) {
      return {
        notFound: true,
      }
    }
  }

  const categoryInfo: category | null = await getSubjectType(category)

  // Get all courses of this category

  const subjectData: SubjectCardData[] = dataSlice.map(subj => convertSubjectToCardData(subj, lang));

  // Footer Data
  // Get all countries
  const countryList = await getCountries();
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  if (categoryInfo === null) {
    return {
      notFound: true,
    }
  }

  const props: Props = {
    categoryInfo,
    pageCount,
    totalSubjectCount: subjects.length,
    subjectData,
    countryList,
    ads: [],
    footerContent,
  }

  return { props };
}

export default SubjectCategoryPage