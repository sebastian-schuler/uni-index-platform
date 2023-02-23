import { Group, SimpleGrid, Space, Stack } from '@mantine/core'
import { Reorder } from "framer-motion"
import produce from 'immer'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState } from 'react'
import Breadcrumb from '../../layout/Breadcrumb'
import { CountryCardData, Searchable } from '../../lib/types/UiHelperTypes'
import { getLocalizedName } from '../../lib/util/util'
import GenericPageHeader from '../elements/GenericPageHeader'
import CountryCard from '../elements/itemcards/CountryCard'
import OrderBySelect, { OrderByState } from '../elements/OrderBySelect'
import SearchBox from '../partials/SearchBox'

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

    }, [orderBy, lang, searchTerm]);

    return (
        <>
            <Breadcrumb />
            <Stack>

                <GenericPageHeader title={title} description={subtitle} />

                <Space h="md" />

                <Group position='apart' >
                    <SearchBox
                        label={t('countries-search-label')}
                        placeholder={t('countries-search-placeholder')}
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
                            dataList.filter((searchable) => searchable.visible).map((searchableCountry, i) => {

                                const countryCardData = searchableCountry.data as CountryCardData;
                                return (
                                    <Reorder.Item key={countryCardData.countryCode} as={"div"} value={searchableCountry}>
                                        <CountryCard
                                            key={i}
                                            data={countryCardData}
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