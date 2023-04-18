import { Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { GetServerSideProps, NextPage } from 'next';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import GenericPageHeader from '../components/Block/GenericPageHeader';
import CategoryCard from '../components/Card/CategoryCard';
import ResponsiveWrapper from '../components/Container/ResponsiveWrapper';
import CustomPagination from '../components/Pagination/CustomPagination';
import ItemApiSearch from '../components/Searchbox/ItemApiSearch';
import OrderBySelect from '../components/Select/OrderBySelect';
import AdContainer from '../features/Ads/AdContainer';
import Breadcrumb from '../features/Breadcrumb/Breadcrumb';
import { FooterContent } from '../features/Footer/Footer';
import { getAdCardArray } from '../lib/ads/adConverter';
import { AD_PAGE_CATEGORIES } from '../lib/appConstants';
import SITE_URL from '../lib/globalUrl';
import { getCountries } from '../lib/prisma/prismaQueries';
import { searchSubjectTypes } from '../lib/prisma/prismaSearch';
import { AdCardData, CategoryCardData } from '../lib/types/UiHelperTypes';
import { OrderCategoryBy } from '../lib/types/OrderBy';
import { URL_CATEGORIES } from '../lib/url-helper/urlConstants';
import { convertCategoryToCardData } from '../lib/util/conversionUtil';
import { toLink } from '../lib/util/util';

export const CATEGORY_PER_PAGE = 32;

interface Props {
    ads: AdCardData[][],
    pageCount: number | null,
    totalCategoryCount: number,
    categories: CategoryCardData[]
    footerContent: FooterContent[]
}

const Subjects: NextPage<Props> = ({ ads, pageCount, totalCategoryCount, categories, footerContent }: Props) => {

    const router = useRouter();

    // Query params
    const currentPage = router.query.page ? parseInt(router.query.page as string) : 1;
    const searchQuery = router.query.q ? router.query.q as string : undefined;
    const orderQuery = router.query.order ? router.query.order as OrderCategoryBy : undefined;

    // TRANSLATION
    const { t, lang } = useTranslation('category');

    // Filter
    const [orderBy, setOrderBy] = useState<OrderCategoryBy>(orderQuery ? orderQuery : "az");
    const [searchTerm, setSearchTerm] = useState<string>(searchQuery ? searchQuery as string : "");

    // Meta data
    const getCanonicalLink = () => {
        const localePart = router.locale === router.defaultLocale ? "" : router.locale + "/";
        const pageNumber = currentPage > 1 ? "/page=" + currentPage : "";
        return `${SITE_URL}/${localePart}${URL_CATEGORIES}${pageNumber}`
    }

    const getPrevLink = () => {
        const localePart = router.locale === router.defaultLocale ? "" : router.locale + "/";
        const pageNumber = "/page=" + (currentPage - 1);
        return `${SITE_URL}/${localePart}${URL_CATEGORIES}${pageNumber}`
    }

    const getNextLink = () => {
        const localePart = router.locale === router.defaultLocale ? "" : router.locale + "/";
        const pageNumber = "/page=" + (currentPage + 1);
        return `${SITE_URL}/${localePart}${URL_CATEGORIES}${pageNumber}`
    }

    // Search
    const runSearch = async (q: string | undefined, order: OrderCategoryBy) => {
        if (q && q.length <= 2) return;
        router.push({
            pathname: toLink(URL_CATEGORIES),
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
            pathname: toLink(URL_CATEGORIES),
            query: {
                order: orderBy,
            },
        });
    }

    return (
        <ResponsiveWrapper footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('meta.categories-title')}</title>
                <meta key={"description"} name="description" content={t('meta.categories-description')} />
                {pageCount && <link rel="canonical" href={getCanonicalLink()} />}
                {pageCount && currentPage > 1 && <link rel='prev' href={getPrevLink()} />}
                {pageCount && currentPage < pageCount && <link rel='next' href={getNextLink()} />}
                {(searchQuery || orderQuery) && <meta name="robots" content="noindex, nofollow" />}
            </Head>

            <Breadcrumb />

            <Stack>
                <GenericPageHeader title={t('categories.title')} description={t('categories.subtitle')} />

                <Group position='apart' >
                    <ItemApiSearch
                        label={t('categories.search-label')}
                        placeholder={t('categories.search-placeholder')}
                        onSearch={() => runSearch(searchTerm, orderBy)}
                        value={searchTerm}
                        setValue={setSearchTerm}
                        onCancel={cancelSearch}
                    />
                    <OrderBySelect
                        variant='categories'
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
                            <Text>{t('categories.search-results-label', { count: categories.length, query: searchTerm })}</Text>
                        ) : (
                            <Text>
                                <Trans
                                    i18nKey="category:categories.page-results-label"
                                    components={[<Text key={0} component='span' weight={'bold'} />, <Text key={1} component='span' weight={'bold'} />]}
                                    values={{
                                        fromName: categories.at(0)?.name,
                                        toName: categories.at(-1)?.name,
                                        from: (currentPage - 1) * categories.length + 1,
                                        to: currentPage * categories.length,
                                        total: totalCategoryCount,
                                    }}
                                />
                            </Text>
                        )
                    }
                </Group>

                <SimpleGrid
                    spacing="lg"
                    breakpoints={[
                        { minWidth: 'md', cols: 3, spacing: 'md' },
                        { minWidth: 'sm', cols: 2, spacing: 'sm' },
                    ]}
                >
                    {
                        categories.map((category, i) => {
                            return (
                                <CategoryCard key={category.id} subjectType={category} />
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
                        rootPath={"/categories"}
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
    const orderBy = context.query.order ? context.query.order as OrderCategoryBy : "az";
    const searchQuery = context.query.q ? context.query.q as string : null;
    const limit = CATEGORY_PER_PAGE;

    const detailedSubjectTypes = await searchSubjectTypes(searchQuery, orderBy);

    let dataSlice = detailedSubjectTypes;
    let pageCount: null | number = null;

    // Detailed Subject Types
    if (!searchQuery) {
        dataSlice = detailedSubjectTypes.slice((pageIndex - 1) * limit, pageIndex * limit);
        pageCount = Math.ceil(detailedSubjectTypes.length / limit);

        if (pageIndex > pageCount) {
            return {
                notFound: true,
            }
        }
    }

    // Convert to card data
    const categories = dataSlice.map((subjectType) => convertCategoryToCardData(subjectType, lang));

    // Ads
    const ads = await getAdCardArray(AD_PAGE_CATEGORIES, lang);

    // Footer Data
    const countryList = await getCountries();
    const footerContent: FooterContent[] = [
        { title: "Countries", data: countryList, type: "Country" },
    ]

    const props: Props = {
        ads,
        pageCount,
        totalCategoryCount: detailedSubjectTypes.length,
        categories,
        footerContent
    }

    return { props };
}

export default Subjects;