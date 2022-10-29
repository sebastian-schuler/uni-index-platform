import { Group, SimpleGrid, Space, Stack } from '@mantine/core'
import { Reorder } from "framer-motion"
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useReducer, useState } from 'react'
import { CountryCardData } from '../../lib/types/DetailedDatabaseTypes'
import { Searchable } from '../../lib/types/UiHelperTypes'
import { getLocalizedName } from '../../lib/util/util'
import GenericPageHeader from '../elements/GenericPageHeader'
import CountryCard from '../elements/itemcards/CountryCard'
import OrderBySelect, { OrderByState, sortSearchableArray } from '../elements/OrderBySelect'
import Breadcrumb from '../layout/Breadcrumb'
import SearchBox from '../partials/SearchBox'

type SearchState = {
    query: string,
}
type SearchAction = {
    query: string,
}

interface Props {
    title: string,
    subtitle: string,
    searchableCountries: Searchable[],
    children?: React.ReactNode
}

// TODO: Move search functionality to a separate component

const CountryList = ({ title, subtitle, searchableCountries, children }: Props) => {

    // TRANSLATION
    const { t, lang } = useTranslation('common');
    const langContent = {
        searchLabel: t('countries-search-label'),
        searchPlaceholder: t('countries-search-placeholder'),
    }

    // DATA LISTS
    const [dataList, setDataList] = useState<Searchable[]>(searchableCountries);
    const [searchState, searchDispatch] = useReducer(searchReducer, { query: "" });

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
        if (selected && selected !== orderBy)
            setOrderBy(selected as OrderByState);
    };

    useEffect(() => {
        setDataList(d => sortSearchableArray(d, orderBy, lang));
    }, [orderBy, lang]);

    return (
        <>

            <Breadcrumb />

            <Stack>

                <GenericPageHeader title={title} description={subtitle} />

                <Space h="md" />

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
                            dataList.map((searchableCountry, i) => (
                                searchableCountry.visible && (

                                    <Reorder.Item key={i} as={"div"} value={searchableCountry}>
                                        <CountryCard
                                            key={i}
                                            data={searchableCountry.data as CountryCardData}
                                        />
                                    </Reorder.Item>
                                )
                            ))
                        }
                    </SimpleGrid>
                </Reorder.Group>

                <Space h="lg" />

                {
                    children
                }

            </Stack>
        </>
    )
}

export default CountryList