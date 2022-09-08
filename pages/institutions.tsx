import { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import CountryList from '../components/container/CountryList';
import PremiumList from '../components/container/PremiumList';
import { FooterContent } from '../components/layout/footer/Footer';
import LayoutContainer from '../components/layout/LayoutContainer';
import Meta from '../components/partials/Meta';
import { AD_PAGE_INSTITUTIONS } from '../lib/appConstants';
import { getDetailedCountries } from '../lib/prismaDetailedQueries';
import { getAds } from '../lib/prismaQueries';
import { DetailedPremiumAd } from '../lib/types/DetailedDatabaseTypes';
import { Searchable } from '../lib/types/UiHelperTypes';
import { generateSearchable } from '../lib/util';

type Props = {
    ads: string,
    searchableCountries: Searchable[],
    footerContent: FooterContent[],
}

const institutions: NextPage<Props> = props => {

    const { t } = useTranslation('institution');
    const langContent = {
        title: t('countries-title'),
        subtitle: t('countries-title-sub'),
        pageTitle: t('common:page-title')
    }

    const ads: DetailedPremiumAd[] = JSON.parse(props.ads);

    return (

        <>

            <Meta
                title={langContent.pageTitle + ' - ' + langContent.title}
                description='Very nice page'
            />

            <LayoutContainer footerContent={props.footerContent}>

                <CountryList
                    title={langContent.title}
                    subtitle={langContent.subtitle}
                    root={"institution"}
                    searchableCountries={props.searchableCountries}
                >

                    <PremiumList premiumAds={ads} />

                </CountryList>

            </LayoutContainer>

        </>



    )
}

export const getStaticProps: GetStaticProps = async (context) => {

    const countryList = await getDetailedCountries();
    const searchableCountries = generateSearchable({ lang: context.locale, array: { type: "Country", data: countryList } });

    // Ads
    const ads: DetailedPremiumAd[] = await getAds(AD_PAGE_INSTITUTIONS);
    const allAds = JSON.stringify(ads);

    const footerContent: FooterContent[] = [
        { title: "Countries", data: searchableCountries, type: "Searchable" },
    ]

    return {
        props: {
            ads: allAds,
            searchableCountries: searchableCountries,
            footerContent: footerContent
        }
    }

}

export default institutions