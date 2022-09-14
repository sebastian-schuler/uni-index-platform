import { Group, SimpleGrid, Space, Stack, Transition } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState } from 'react'
import { DetailedCountry } from '../../lib/types/DetailedDatabaseTypes'
import { Searchable } from '../../lib/types/UiHelperTypes'
import GenericPageHeader from '../elements/GenericPageHeader'
import CountryCard from '../elements/itemcards/CountryCard'
import OrderBySelect, { OrderByState, sortSearchableArray } from '../elements/OrderBySelect'
import Breadcrumb from '../layout/Breadcrumb'
import SearchBox from '../partials/SearchBox'
import { AnimatePresence, Reorder, motion } from "framer-motion"

interface Props {
    title: string,
    subtitle: string,
    root: "location" | "institution",
    searchableCountries: Searchable[],
    children?: React.ReactNode
}

const CountryList = ({ title, subtitle, root, searchableCountries, children }: Props) => {

    const [dataList, setDataList] = useState<Searchable[]>(searchableCountries);

    const { t, lang } = useTranslation('common');
    const langContent = {
        searchLabel: t('countries-search-label'),
        searchPlaceholder: t('countries-search-placeholder'),
    }

    // Order by
    const [orderBy, setOrderBy] = useState<OrderByState>("relevance");

    const handleOrderChange = (selected: string | null) => {
        if (selected && selected !== orderBy)
            setOrderBy(selected as OrderByState);
    };

    useEffect(() => {
        setDataList(sortSearchableArray(dataList, orderBy, lang));
    }, [orderBy]);

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
                            dataList.map((searchableCountry, i) => (
                                searchableCountry.visible && (
                                    <Reorder.Item key={searchableCountry.data.id} as={"div"} value={searchableCountry}>
                                        <CountryCard key={searchableCountry.data.id} country={searchableCountry.data as DetailedCountry} linkType={root} />
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