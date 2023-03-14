import { GetStaticProps, NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import ResponsiveWrapper from '../components/Container/ResponsiveWrapper'
import AdContainer from '../features/Ads/AdContainer'
import CountryList from '../features/CountryList/CountryList'
import { getAdCardArray } from '../lib/ads/adConverter'
import { AD_PAGE_LOCATIONS } from '../lib/appConstants'
import { getDetailedCountries } from '../lib/prisma/prismaDetailedQueries'
import { AdCardData, CountryCardData, Searchable } from '../lib/types/UiHelperTypes'
import { convertCountryToCardData } from '../lib/util/conversionUtil'
import { generateSearchable } from '../lib/util/util'

interface Props {
    ads: AdCardData[][],
    countries: Searchable[]
}

const Locations: NextPage<Props> = ({ ads, countries }: Props) => {

    const { t } = useTranslation('location');

    return (
        <ResponsiveWrapper>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('meta.countries-title')}</title>
                <meta key={"description"} name="description" content={t('meta.countries-description')} />
            </Head>
            <CountryList
                title={t('countries.title')}
                subtitle={t('countries.subtitle')}
                searchableCountries={countries}
            >
                <AdContainer ads={ads} />
            </CountryList>

        </ResponsiveWrapper>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {

    const lang = context.locale || "en";
    const countries = await getDetailedCountries();
    countries.sort((a, b) => b.popularity_score - a.popularity_score);
    const countryData: CountryCardData[] = countries.map(country => convertCountryToCardData(country, lang, "location"));
    const searchableCountries: Searchable[] = generateSearchable({ type: "Country", data: countryData });

    // Ads
    const ads = await getAdCardArray(AD_PAGE_LOCATIONS, lang);

    return {
        props: {
            countries: searchableCountries,
            ads,
        }
    }

}

export default Locations;