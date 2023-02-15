import { Group, SimpleGrid, Stack } from '@mantine/core';
import { Country, State } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import GenericPageHeader from '../../../../components/elements/GenericPageHeader';
import CityCard from '../../../../components/elements/itemcards/CityCard';
import Breadcrumb from '../../../../layout/Breadcrumb';
import { FooterContent } from '../../../../layout/footer/Footer';
import LayoutContainer from '../../../../layout/LayoutContainer';
import prisma from '../../../../lib/prisma/prisma';
import { getCitiesDetailedByState } from '../../../../lib/prisma/prismaDetailedQueries';
import { getCountries, getCountryByState, getState } from '../../../../lib/prisma/prismaQueries';
import { DetailedCity } from '../../../../lib/types/DetailedDatabaseTypes';
import { getLocalizedName } from '../../../../lib/util/util';

interface Props {
    cityList: DetailedCity[],
    stateInfo: State,
    countryInfo: Country,
    footerContent: FooterContent[]
}

const StatePage: NextPage<Props> = ({ cityList, stateInfo, countryInfo, footerContent }: Props) => {

    const { t, lang } = useTranslation('location');
    const stateName = getLocalizedName({ lang: lang, state: stateInfo });

    return (
        <LayoutContainer footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('state-title', { state: stateName })}</title>
                <meta key={"description"} name="description" content={t('state-description', { state: stateName })} />
            </Head>

            <Breadcrumb countryInfo={countryInfo} stateInfo={stateInfo} />

            <Stack>
                <GenericPageHeader title={getLocalizedName({ lang: lang, state: stateInfo })} description={t('state-subtitle', { state: stateName })} />

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
    const countryList = await getCountries();
    const footerContent: FooterContent[] = [
        { title: "Countries", data: countryList, type: "Country" },
    ]

    return {
        props: { cityList: cities, stateInfo: stateInfo, countryInfo: countryInfo?.Country, footerContent: footerContent }
    }

}

export default StatePage