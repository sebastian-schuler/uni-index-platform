import { Group, SimpleGrid, Stack } from '@mantine/core';
import { Reorder } from 'framer-motion';
import { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import GenericPageHeader from '../components/elements/GenericPageHeader';
import SubjectTypeCard from '../components/elements/itemcards/SubjectTypeCard';
import OrderBySelect, { OrderByState, sortSearchableArray } from '../components/elements/OrderBySelect';
import Breadcrumb from '../components/layout/Breadcrumb';
import { FooterContent } from '../components/layout/footer/Footer';
import LayoutContainer from '../components/layout/LayoutContainer';
import Meta from '../components/partials/Meta';
import SearchBox from '../components/partials/SearchBox';
import { getDetailedSubjectTypes } from '../lib/prisma/prismaDetailedQueries';
import { getCountries } from '../lib/prisma/prismaQueries';
import { DetailedSubjectType } from '../lib/types/DetailedDatabaseTypes';
import { Searchable } from '../lib/types/UiHelperTypes';
import { generateSearchable } from '../lib/util';

interface Props {
    searchableSubjectTypes: Searchable[]
    footerContent: FooterContent[]
}

const subjects: NextPage<Props> = ({ searchableSubjectTypes, footerContent }: Props) => {

    const { t, lang } = useTranslation('subject');
    const langContent = {
        pageTitle: t('common:page-title'),
        title: t('subjects-title'),
        subtitle: t('subjects-title-sub'),
        searchLabel: t('subjecttype-search-label'),
        searchPlaceholder: t('subjecttype-search-placeholder'),
    }
    const [dataList, setDataList] = useState<Searchable[]>(searchableSubjectTypes);

    // Order by
    const [orderBy, setOrderBy] = useState<OrderByState>("relevance");

    const handleOrderChange = (selected: string | null) => {
        if (selected)
            setOrderBy(selected as OrderByState);
    };

    useEffect(() => {
        setDataList(sortSearchableArray(dataList, orderBy, lang));
    }, [orderBy]);

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
                        searchableList={dataList}
                        setSearchableList={setDataList}
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
                                    <Reorder.Item key={searchable.data.id} as={"div"} value={searchable}>
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
    const searchableSubjectTypes: Searchable[] = generateSearchable({ lang: context.locale, array: { type: "SubjectType", data: detailedSubjectTypes } });

    // Footer Data
    const countryList = await getCountries("asc");
    const footerContent: FooterContent[] = [
        { title: "Countries", data: countryList, type: "Country" },
    ]

    return {
        props: { searchableSubjectTypes, footerContent }
    }

}

export default subjects