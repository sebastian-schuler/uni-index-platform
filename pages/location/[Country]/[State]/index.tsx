import { Group, SimpleGrid, Stack } from '@mantine/core';
import { Country, State } from '@prisma/client';
import { Reorder } from 'framer-motion';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import GenericPageHeader from '../../../../components/Block/GenericPageHeader';
import CityCard from '../../../../components/Card/CityCard';
import ResponsiveWrapper from '../../../../components/Container/ResponsiveWrapper';
import Breadcrumb from '../../../../features/Breadcrumb/Breadcrumb';
import { FooterContent } from '../../../../features/Footer/Footer';
import prisma from '../../../../lib/prisma/prisma';
import { getCitiesDetailedByState } from '../../../../lib/prisma/prismaDetailedQueries';
import { getCountries, getCountryByState, getState } from '../../../../lib/prisma/prismaQueries';
import { CityCardData, Searchable } from '../../../../lib/types/UiHelperTypes';
import { convertCityToCardData } from '../../../../lib/util/conversionUtil';
import { generateSearchable, getLocalizedName } from '../../../../lib/util/util';
import { useState, useEffect } from 'react';
import OrderBySelect, { OrderByState } from '../../../../components/Select/OrderBySelect';
import produce from 'immer';
import ItemSearch from '../../../../components/Searchbox/ItemSearch';

interface Props {
    searchables: Searchable[],
    stateInfo: State,
    countryInfo: Country,
    footerContent: FooterContent[]
}

const StatePage: NextPage<Props> = ({ searchables, stateInfo, countryInfo, footerContent }: Props) => {

    const { t, lang } = useTranslation('location');
    const stateName = getLocalizedName({ lang: lang, state: stateInfo });

    // DATA LISTS
    const [dataList, setDataList] = useState<Searchable[]>(searchables);

    // Filter
    const [orderBy, setOrderBy] = useState<OrderByState>("popularity");
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
                    draft.forEach((searchable) => searchable.visible = true);
                } else {
                    draft.forEach((searchable) => {
                        const data = searchable.data as CityCardData;
                        if (
                            data.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
                            data.areaCodes.some((areaCode) => areaCode.startsWith(searchTerm))
                            ) {
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
        <ResponsiveWrapper footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('meta.state-title', { state: stateName })}</title>
                <meta key={"description"} name="description" content={t('meta.state-description', { state: stateName })} />
            </Head>

            <Breadcrumb countryInfo={countryInfo} stateInfo={stateInfo} />

            <Stack>
                <GenericPageHeader title={t('state.title', { state: stateName })} description={t('state.subtitle', { state: stateName })} />

                <Group position='apart' >
                    <ItemSearch
                        label={t('state.search-label',{state: stateName})}
                        placeholder={t('state.search-placeholder')}
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
                                const data = searchable.data as CityCardData;
                                return (
                                    <Reorder.Item key={data.id} as={"div"} value={searchable} drag={false}>
                                        <CityCard key={data.id} city={data} />
                                    </Reorder.Item>
                                );
                            })
                        }

                    </SimpleGrid>
                </Reorder.Group>

                {/* <SimpleGrid
                    cols={4}
                    spacing="lg"
                    breakpoints={[
                        { maxWidth: 980, cols: 3, spacing: 'md' },
                        { maxWidth: 755, cols: 2, spacing: 'sm' },
                        { maxWidth: 600, cols: 1, spacing: 'sm' },
                    ]}
                >

                    {
                        searchables.map((searchable, i) => {
                            const data = searchable.data as CityCardData;
                            return (
                                <CityCard key={i} city={data} />
                            )
                        })
                    }

                </SimpleGrid> */}

            </Stack>
        </ResponsiveWrapper>
    )
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {

    // STATE
    const states = await prisma.state.findMany(
        {
            include: {
                Country: true,
            }
        }
    )

    let paths: {
        params: ParsedUrlQuery;
        locale?: string | undefined;
    }[] = [];

    // Add locale to every possible path
    locales?.forEach((locale) => {
        states.forEach((state) => {
            paths.push({
                params: {
                    Country: state.Country.url,
                    State: state.url
                },
                locale,
            });
        })
    });

    return {
        paths: paths,
        fallback: false
    }
}

export async function getStaticProps(context: GetStaticPropsContext) {

    let stateUrl = "" + context?.params?.State;
    const lang = context.locale || "en";

    // Selected State information
    const stateInfo = await getState(stateUrl);
    const countryInfo = await getCountryByState(stateUrl);
    const cities = await getCitiesDetailedByState(stateUrl);
    // Convert to CityCardData and generate Searchable
    const countryData: CityCardData[] = cities.map(city => convertCityToCardData(city, lang));
    const searchables: Searchable[] = generateSearchable({ type: "City", data: countryData });

    // Footer Data
    // Get all countries
    const countryList = await getCountries();
    const footerContent: FooterContent[] = [
        { title: "Countries", data: countryList, type: "Country" },
    ]

    return {
        props: { searchables, stateInfo, countryInfo: countryInfo?.Country, footerContent }
    }

}

export default StatePage