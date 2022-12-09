import { GetStaticProps, NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import PremiumList from '../components/container/AdList'
import CountryList from '../components/container/CountryList'
import LayoutContainer from '../layout/LayoutContainer'
import Meta from '../components/partials/Meta'
import { getDetailedCountries } from '../lib/prisma/prismaDetailedQueries'
import { getAds } from '../lib/prisma/prismaQueries'
import { CountryCardData, DetailedUserAd } from '../lib/types/DetailedDatabaseTypes'
import { Searchable } from '../lib/types/UiHelperTypes'
import { convertCountryToCardData } from '../lib/util/conversionUtil'
import { generateSearchable } from '../lib/util/util'

interface Props {
    searchableCountries: Searchable[]
    adsStringified: string
}

const Locations: NextPage<Props> = ({ adsStringified, searchableCountries }: Props) => {

    const { t } = useTranslation('location');
    const langContent = {
        title: t('countries-title'),
        subtitle: t('countries-title-sub'),
        pageTitle: t('common:page-title')
    }
    const ads: DetailedUserAd[] = JSON.parse(adsStringified);

    return (
        <LayoutContainer>

            <Meta
                title={langContent.pageTitle + ' - ' + langContent.title}
                description='Very nice page'
            />

            <CountryList
                title={langContent.title}
                subtitle={langContent.subtitle}
                searchableCountries={searchableCountries}
            >

                <PremiumList premiumAds={ads} />

            </CountryList>

        </LayoutContainer>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {

    const lang = context.locale || "en";
    const detailedCountries = await getDetailedCountries();
    const countryData: CountryCardData[] = detailedCountries.map(country => convertCountryToCardData(country, lang, "location"));
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