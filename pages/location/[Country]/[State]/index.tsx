import { Grid } from '@mui/material';
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
import { getDBLocale, getLocalizedName } from '../../../../lib/util';

type Props = {
    cityList: DetailedCity[],
    stateInfo: State,
    countryInfo: Country,
    footerContent: FooterContent[]
}

const StatePage: NextPage<Props> = props => {

    const { cityList, stateInfo, countryInfo, footerContent } = props;
    const query = useRouter().query;
    const { t, lang } = useTranslation('common');
    const langContent = {
        pageTitle: t('common:page-title')
    }

    return (
        <LayoutContainer footerContent={props.footerContent}>

            <Meta
                title={langContent.pageTitle + ' - ' + getLocalizedName({ lang: lang, state: props.stateInfo })}
                description='Very nice page'
            />

            <Breadcrumb countryInfo={props.countryInfo} stateInfo={props.stateInfo} />

            <GenericPageHeader title={getLocalizedName({ lang: lang, state: stateInfo })} description={`Find courses located in this state in ${countryInfo.name}`} />

            <Grid container columnSpacing={4}>

                <Grid item xs={12} sm={3} xl={2}>

                    ffffffffffffffffffffffffffff

                    {/* <SearchBox
                    label={langContent.searchLabel}
                    placeholder={langContent.searchPlaceholder}
                    searchableList={dataList}
                    setSearchableList={setDataList}
                    /> */}

                </Grid>

                <Grid item
                    xs={12} sm={9} xl={10}
                    flexGrow={1}
                    component={'section'}
                >
                    <Grid container spacing={4}>
                        {
                            props.cityList.map((city, i) => (
                                <Grid item key={i} xs={12} sm={4} xl={2}>
                                    <CityCard city={city} />
                                </Grid>
                            ))
                        }
                    </Grid>
                </Grid>

            </Grid>
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
    let localeDb = getDBLocale(context.locale);

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