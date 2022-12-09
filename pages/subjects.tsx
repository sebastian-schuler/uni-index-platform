import { Group, SimpleGrid, Stack } from '@mantine/core';
import { Reorder } from 'framer-motion';
import { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useReducer, useState } from 'react';
import GenericPageHeader from '../components/elements/GenericPageHeader';
import SubjectTypeCard from '../components/elements/itemcards/SubjectTypeCard';
import OrderBySelect, { OrderByState, sortSearchableArray } from '../components/elements/OrderBySelect';
import Breadcrumb from '../layout/Breadcrumb';
import { FooterContent } from '../layout/footer/Footer';
import LayoutContainer from '../layout/LayoutContainer';
import Meta from '../components/partials/Meta';
import SearchBox from '../components/partials/SearchBox';
import { getDetailedSubjectTypes } from '../lib/prisma/prismaDetailedQueries';
import { getCountries } from '../lib/prisma/prismaQueries';
import { DetailedSubjectType } from '../lib/types/DetailedDatabaseTypes';
import { Searchable } from '../lib/types/UiHelperTypes';
import { generateSearchable, getLocalizedName } from '../lib/util/util';

type SearchState = {
    query: string,
}
type SearchAction = {
    query: string,
}

interface Props {
    searchableSubjectTypes: Searchable[]
    footerContent: FooterContent[]
}

// TODO: Move search functionality to a separate component

const Subjects: NextPage<Props> = ({ searchableSubjectTypes, footerContent }: Props) => {

    // TRANSLATION
    const { t, lang } = useTranslation('subject');
    const langContent = {
        pageTitle: t('common:page-title'),
        title: t('subjects-title'),
        subtitle: t('subjects-title-sub'),
        searchLabel: t('subjecttype-search-label'),
        searchPlaceholder: t('subjecttype-search-placeholder'),
    }

    // DATA LISTS
    const [dataList, setDataList] = useState<Searchable[]>(searchableSubjectTypes);
    const [searchState, searchDispatch] = useReducer(searchReducer, { query: "" });

    // SEARCH FUNCTION REDUCER
    function searchReducer(state: SearchState, newSearch: SearchAction) {

        if (state.query === newSearch.query) return state;

        const newSearchableList = Array.from([...dataList]);
        if (newSearch.query === "") {
            newSearchableList.forEach((searchable) => searchable.visible = true);
        } else {
            newSearchableList.forEach((searchable) => {

                if (getLocalizedName({ lang: lang, searchable: searchable })?.toLowerCase().startsWith(newSearch.query.toLowerCase())) {
                    searchable.visible = true;
                } else {
                    searchable.visible = false;
                }
            });
        }
        setDataList(newSearchableList);
        return { query: newSearch.query };
    }

    // Order by
    const [orderBy, setOrderBy] = useState<OrderByState>("relevance");

    const handleOrderChange = (selected: string | null) => {
        if (selected)
            setOrderBy(selected as OrderByState);
    };

    useEffect(() => {
        setDataList(d => sortSearchableArray(d, orderBy, lang));
    }, [orderBy, lang]);

    return (
        <LayoutContainer footerContent={footerContent}>

            <Meta
                title={langContent.pageTitle + ' - ' + langContent.title}
                description='Very nice page'
            />

            <Breadcrumb />

            <Stack>
                <GenericPageHeader title={langContent.title} description={langContent.subtitle} />

                <Group position='apart' >
                    <SearchBox
                        label={langContent.searchLabel}
                        placeholder={langContent.searchPlaceholder}
                        searchTerm={searchState.query}
                        setSearchTerm={(newSearch) => searchDispatch({ query: newSearch })}
                    />
                    <OrderBySelect orderBy={orderBy} handleChange={handleOrderChange} />
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
                            dataList.map((searchable, i) => (
                                searchable.visible && (
                                    <Reorder.Item key={"orderitem" + i} as={"div"} value={searchable}>
                                        <SubjectTypeCard key={i} subjectType={searchable.data as DetailedSubjectType} />
                                    </Reorder.Item>
                                )
                            ))
                        }

                    </SimpleGrid>
                </Reorder.Group>
            </Stack>

        </LayoutContainer>
    )

}

export const getStaticProps: GetStaticProps = async (context) => {

    // List of subject categories
    const detailedSubjectTypes = await getDetailedSubjectTypes();
    const searchableSubjectTypes: Searchable[] = generateSearchable({ type: "SubjectType", data: detailedSubjectTypes });

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