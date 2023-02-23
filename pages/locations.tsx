import { GetStaticProps, NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import PremiumList from '../components/container/AdList'
import CountryList from '../components/container/CountryList'
import LayoutContainer from '../layout/LayoutContainer'
import { getDetailedCountries } from '../lib/prisma/prismaDetailedQueries'
import { getAds } from '../lib/prisma/prismaQueries'
import { DetailedUserAd } from '../lib/types/DetailedDatabaseTypes'
import { CountryCardData, Searchable } from '../lib/types/UiHelperTypes'
import { convertCountryToCardData } from '../lib/util/conversionUtil'
import { generateSearchable } from '../lib/util/util'

interface Props {
    searchableCountries: Searchable[]
    adsStringified: string
}

const Locations: NextPage<Props> = ({ adsStringified, searchableCountries }: Props) => {

    const { t } = useTranslation('location');
    const ads: DetailedUserAd[] = JSON.parse(adsStringified);

    return (
        <LayoutContainer>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('countries-title')}</title>
                <meta key={"description"} name="description" content={t('countries-description')} />
            </Head>
            <CountryList
                title={t('countries-title')}
                subtitle={t('countries-subtitle')}
                searchableCountries={searchableCountries}
            >
                <PremiumList premiumAds={ads} />
            </CountryList>

        </LayoutContainer>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {

    const lang = context.locale || "en";
    const countries = await getDetailedCountries();
    countries.sort((a, b) => b.popularity_score - a.popularity_score);
    const countryData: CountryCardData[] = countries.map(country => convertCountryToCardData(country, lang, "location"));
    const searchableCountries: Searchable[] = generateSearchable({ type: "Country", data: countryData });

    const ads: DetailedUserAd[] = await getAds("locations");
    const allAds = JSON.stringify(ads);

    return {
        props: {
            searchableCountries: searchableCountries,
            adsStringified: allAds,
        }
    }

}

export default Locations;