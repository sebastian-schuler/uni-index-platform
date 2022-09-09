import { GetStaticProps, NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import CountryList from '../components/container/CountryList'
import PremiumList from '../components/container/AdList'
import { FooterContent } from '../components/layout/footer/Footer'
import LayoutContainer from '../components/layout/LayoutContainer'
import Meta from '../components/partials/Meta'
import { getDetailedCountries } from '../lib/prismaDetailedQueries'
import { getAds } from '../lib/prismaQueries'
import { DetailedPremiumAd } from '../lib/types/DetailedDatabaseTypes'
import { Searchable } from '../lib/types/UiHelperTypes'
import { generateSearchable } from '../lib/util'

interface Props {
    searchableCountries: Searchable[]
    adsStringified: string
    footerContent: FooterContent[]
}

const countries: NextPage<Props> = ({ adsStringified, searchableCountries, footerContent }: Props) => {

    const { t } = useTranslation('location');
    const langContent = {
        title: t('countries-title'),
        subtitle: t('countries-title-sub'),
        pageTitle: t('common:page-title')
    }
    const ads: DetailedPremiumAd[] = JSON.parse(adsStringified);

    return (
        <LayoutContainer footerContent={footerContent}>

            <Meta
                title={langContent.pageTitle + ' - ' + langContent.title}
                description='Very nice page'
            />

            <CountryList
                title={langContent.title}
                subtitle={langContent.subtitle}
                root={"location"}
                searchableCountries={searchableCountries}
            >

                <PremiumList premiumAds={ads} />

            </CountryList>

        </LayoutContainer>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {

    const detailedCountries = await getDetailedCountries();
    const searchableCountries: Searchable[] = generateSearchable({ lang: context.locale, array: { type: "Country", data: detailedCountries } });
    const footerContent: FooterContent[] = [
        { title: "Countries", data: searchableCountries, type: "Searchable" },
    ]

    const ads: DetailedPremiumAd[] = await getAds("locations");
    const allAds = JSON.stringify(ads);

    return {
        props: {
            searchableCountries: searchableCountries,
            adsStringified: allAds,
            footerContent: footerContent
        }
    }

}

export default countries