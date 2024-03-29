import { Group, SimpleGrid, Space, Stack } from '@mantine/core';
import { Reorder } from 'framer-motion';
import { produce } from 'immer';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import GenericPageHeader from '../../components/Block/GenericPageHeader';
import CountryCard from '../../components/Card/CountryCard';
import ItemSearch from '../../components/Searchbox/ItemSearch';
import OrderBySelect from '../../components/Select/OrderBySelect';
import { OrderBy } from '../../lib/types/OrderBy';
import { CountryCardData, Searchable } from '../../lib/types/UiHelperTypes';
import Breadcrumb from '../Breadcrumb/Breadcrumb';

interface Props {
    title: string,
    subtitle: string,
    searchableCountries: Searchable[],
    children?: React.ReactNode
}

const CountryList = ({ title, subtitle, searchableCountries, children }: Props) => {

    // TRANSLATION
    const { t, lang } = useTranslation('common');

    // DATA LISTS
    const [dataList, setDataList] = useState<Searchable[]>(searchableCountries);

    // Filter
    const [orderBy, setOrderBy] = useState<OrderBy>("popularity");
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {

        setDataList(
            produce((draft) => {
                draft.sort((a, b) => {
                    if (orderBy === "az") {
                        return a.data.name.localeCompare(b.data.name);
                    } else if (orderBy === "za") {
                        return b.data.name.localeCompare(a.data.name);
                    } else if (orderBy === "popularity") {
                        return b.data.popularity - a.data.popularity;
                    } else {
                        return 0;
                    }
                });

                if (searchTerm === "") {
                    draft.forEach((searchable) => {
                        searchable.visible = true
                    });
                } else {
                    draft.forEach((searchable) => {
                        searchable.visible = searchable.data.name.toLowerCase().startsWith(searchTerm.toLowerCase());
                    });
                }
            })
        );

    }, [orderBy, lang, searchTerm]);

    return (
        <>
            <Breadcrumb />
            <Stack>

                <GenericPageHeader title={title} description={subtitle} />

                <Space h="md" />

                <Group position='apart' >
                    <ItemSearch
                        label={t('countries-search-label')}
                        placeholder={t('countries-search-placeholder')}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                    <OrderBySelect variant='default' orderBy={orderBy} handleChange={setOrderBy} />
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
                            dataList.filter((searchable) => searchable.visible).map((searchableCountry, i) => {

                                const countryCardData = searchableCountry.data as CountryCardData;
                                return (
                                    <Reorder.Item key={countryCardData.countryCode} as={"div"} value={searchableCountry} drag={false}>
                                        <CountryCard
                                            key={i}
                                            country={countryCardData}
                                        />
                                    </Reorder.Item>
                                )
                            })
                        }
                    </SimpleGrid>
                </Reorder.Group>

                <Space h="lg" />

                {children}
            </Stack>
        </>
    )
}

export default CountryList