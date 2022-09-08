import { Group, SimpleGrid, Stack } from '@mantine/core';
import { Country, State } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import GenericPageHeader from '../../../../components/elements/GenericPageHeader';
import CityCard from '../../../../components/elements/itemcards/CityCard';
import Breadcrumb from '../../../../components/layout/Breadcrumb';
import { FooterContent } from '../../../../components/layout/footer/Footer';
import LayoutContainer from '../../../../components/layout/LayoutContainer';
import Meta from '../../../../components/partials/Meta';
import prisma from '../../../../lib/prisma';
import { getCitiesDetailedByState, getCountries, getCountryByState, getState } from '../../../../lib/prismaQueries';
import { DetailedCity } from '../../../../lib/types/DetailedDatabaseTypes';
import { getLocalizedName } from '../../../../lib/util';

interface Props {
    cityList: DetailedCity[],
    stateInfo: State,
    countryInfo: Country,
    footerContent: FooterContent[]
}

const StatePage: NextPage<Props> = ({ cityList, stateInfo, countryInfo, footerContent }: Props) => {

    const query = useRouter().query;
    const { t, lang } = useTranslation('common');
    const langContent = {
        pageTitle: t('common:page-title')
    }

    return (
        <LayoutContainer footerContent={footerContent}>

            <Meta
                title={langContent.pageTitle + ' - ' + getLocalizedName({ lang: lang, state: stateInfo })}
                description='Very nice page'
            />

            <Breadcrumb countryInfo={countryInfo} stateInfo={stateInfo} />

            <Stack>
                <GenericPageHeader title={getLocalizedName({ lang: lang, state: stateInfo })} description={`Find courses located in this state in ${countryInfo.name}`} />

                <Group position='apart' >
                    {/* <SearchBox
                        label={langContent.searchLabel}
                        placeholder={langContent.searchPlaceholder}
                        searchableList={dataList}
                        setSearchableList={setDataList}
                    />
                    <OrderBySelect orderBy={orderBy} handleChange={handleOrderChange} /> */}
                </Group>

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
                        cityList.map((city, i) => (
                            // searchable.visible && (
                                <CityCard key={i} city={city} /> //TODO make searchable
                            // )
                        ))
                    }

                </SimpleGrid>

            </Stack>
        </LayoutContainer>
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

    // Selected State information
    const stateInfo = await getState(stateUrl);
    const countryInfo = await getCountryByState(stateUrl);
    const cities = await getCitiesDetailedByState(stateUrl);

    // Footer Data
    // Get all countries
    const countryList = await getCountries("asc");
    const footerContent: FooterContent[] = [
        { title: "Countries", data: countryList, type: "Country" },
    ]

    return {
        props: { cityList: cities, stateInfo: stateInfo, countryInfo: countryInfo?.Country, footerContent: footerContent }
    }

}

export default StatePage