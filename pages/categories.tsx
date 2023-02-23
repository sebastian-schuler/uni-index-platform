import { Group, SimpleGrid, Stack } from '@mantine/core';
import { Reorder } from 'framer-motion';
import produce from 'immer';
import { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import GenericPageHeader from '../components/elements/GenericPageHeader';
import CategoryCard from '../components/elements/itemcards/CategoryCard';
import OrderBySelect, { OrderByState } from '../components/elements/OrderBySelect';
import SearchBox from '../components/partials/SearchBox';
import Breadcrumb from '../layout/Breadcrumb';
import { FooterContent } from '../layout/footer/Footer';
import LayoutContainer from '../layout/LayoutContainer';
import { getDetailedSubjectTypes } from '../lib/prisma/prismaDetailedQueries';
import { getCountries } from '../lib/prisma/prismaQueries';
import { CategoryCardData, Searchable } from '../lib/types/UiHelperTypes';
import { convertCategoryToCardData } from '../lib/util/conversionUtil';
import { generateSearchable, getLocalizedName } from '../lib/util/util';

interface Props {
    searchableSubjectTypes: Searchable[]
    footerContent: FooterContent[]
}

const Subjects: NextPage<Props> = ({ searchableSubjectTypes, footerContent }: Props) => {

    // TRANSLATION
    const { t, lang } = useTranslation('category');

    // DATA LISTS
    const [dataList, setDataList] = useState<Searchable[]>(searchableSubjectTypes);

    // Filter
    const [orderBy, setOrderBy] = useState<OrderByState>("popularity");
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {

        setDataList(
            produce((draft) => {
                draft.sort((a, b) => {
                    if (orderBy === "az") {
                        const aName = getLocalizedName({ lang: lang, searchable: a }); // TODO: Searchable should already be localized so that we don't have to do this
                        const bName = getLocalizedName({ lang: lang, searchable: b });
                        return aName.localeCompare(bName);
                    } else if (orderBy === "za") {
                        const aName = getLocalizedName({ lang: lang, searchable: a });
                        const bName = getLocalizedName({ lang: lang, searchable: b });
                        return bName.localeCompare(aName);
                    } else if (orderBy === "popularity") {
                        return b.data.popularity - a.data.popularity;
                    } else {
                        return 0;
                    }
                });

                if (searchTerm === "") {
                    draft.forEach((searchable) => searchable.visible = true);
                } else {
                    draft.forEach((searchable) => {

                        if (getLocalizedName({ lang: lang, searchable: searchable })?.toLowerCase().startsWith(searchTerm.toLowerCase())) {
                            searchable.visible = true;
                        } else {
                            searchable.visible = false;
                        }
                    });
                }
            })
        );

    }, [searchTerm, orderBy, lang]);

    return (
        <LayoutContainer footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('category-title')}</title>
                <meta key={"description"} name="description" content={t('category-description')} />
            </Head>

            <Breadcrumb />

            <Stack>
                <GenericPageHeader title={t('category-title')} description={t('category-subtitle')} />

                <Group position='apart' >
                    <SearchBox
                        label={t('subjecttype-search-label')}
                        placeholder={t('subjecttype-search-placeholder')}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                    <OrderBySelect orderBy={orderBy} handleChange={setOrderBy} />
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
                            dataList.filter((val) => val.visible).map((searchable, i) => {
                                const data = searchable.data as CategoryCardData;
                                return (
                                    <Reorder.Item key={data.id} as={"div"} value={searchable}>
                                        <CategoryCard key={data.id} subjectType={data} />
                                    </Reorder.Item>
                                );
                            })
                        }

                    </SimpleGrid>
                </Reorder.Group>
            </Stack>

        </LayoutContainer>
    )

}

export const getStaticProps: GetStaticProps = async (context) => {

    const lang = context.locale || "en";

    // Detailed Subject Types
    const detailedSubjectTypes = await getDetailedSubjectTypes();
    // Convert to card data
    const cardData = detailedSubjectTypes.map((subjectType) => convertCategoryToCardData(subjectType, lang));
    // Generate searchable array
    const searchableSubjectTypes: Searchable[] = generateSearchable({ type: "SubjectType", data: cardData });

    // Footer Data
    const countryList = await getCountries();
    const footerContent: FooterContent[] = [
        { title: "Countries", data: countryList, type: "Country" },
    ]

    return {
        props: { searchableSubjectTypes, footerContent }
    }

}

export default Subjects;