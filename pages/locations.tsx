import { GetStaticPropsContext, NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import CountryList from '../components/container/CountryList'
import PremiumList from '../components/container/PremiumList'
import { FooterContent } from '../components/layout/footer/Footer'
import LayoutContainer from '../components/layout/LayoutContainer'
import Meta from '../components/partials/Meta'
import { getDetailedCountries } from '../lib/prismaDetailedQueries'
import { getAds, getCountries } from '../lib/prismaQueries'
import { DetailedPremiumAd } from '../lib/types/DetailedDatabaseTypes'
import { Searchable } from '../lib/types/UiHelperTypes'
import { generateSearchable } from '../lib/util'

type Props = {
    searchableCountries: Searchable[]
    ads: string
    footerContent: FooterContent[]
}

const countries: NextPage<Props> = props => {

    const { t } = useTranslation('location');
    const langContent = {
        title: t('countries-title'),
        subtitle: t('countries-title-sub'),
        pageTitle: t('common:page-title')
    }

    const ads: DetailedPremiumAd[] = JSON.parse(props.ads);

    return (
        <LayoutContainer footerContent={props.footerContent}>

            <Meta
                title={langContent.pageTitle + ' - ' + langContent.title}
                description='Very nice page'
            />

            <CountryList
                title={langContent.title}
                subtitle={langContent.subtitle}
                root={"location"}
                searchableCountries={props.searchableCountries}
            >

                <PremiumList premiumAds={ads} />

            </CountryList>

        </LayoutContainer>
    )
}

export async function getStaticProps(context: GetStaticPropsContext) {

    const detailedCountries = await getDetailedCountries();
    const searchableCountries:Searchable[] = generateSearchable(context.locale, detailedCountries);
    const footerContent: FooterContent[] = [
        { title: "Countries", data: searchableCountries, type: "Searchable" },
    ]

    const ads: DetailedPremiumAd[] = await getAds("locations");
    const allAds = JSON.stringify(ads);

    return {
        props: { searchableCountries: searchableCountries, ads: allAds, footerContent: footerContent }
    }

}

export default countries