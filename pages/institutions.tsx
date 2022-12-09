import { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import PremiumList from '../components/container/AdList';
import CountryList from '../components/container/CountryList';
import { FooterContent } from '../layout/footer/Footer';
import LayoutContainer from '../layout/LayoutContainer';
import Meta from '../components/partials/Meta';
import { AD_PAGE_INSTITUTIONS } from '../lib/appConstants';
import { getDetailedCountries } from '../lib/prisma/prismaDetailedQueries';
import { getAds } from '../lib/prisma/prismaQueries';
import { CountryCardData, DetailedUserAd } from '../lib/types/DetailedDatabaseTypes';
import { Searchable } from '../lib/types/UiHelperTypes';
import { convertCountryToCardData } from '../lib/util/conversionUtil';
import { generateSearchable } from '../lib/util/util';

interface Props {
    stringifiedAds: string,
    searchableCountries: Searchable[],
    footerContent: FooterContent[],
}

const Institutions: NextPage<Props> = ({ stringifiedAds, searchableCountries, footerContent }: Props) => {

    const { t } = useTranslation('institution');
    const langContent = {
        title: t('countries-title'),
        subtitle: t('countries-title-sub'),
        pageTitle: t('common:page-title')
    }

    const ads: DetailedUserAd[] = JSON.parse(stringifiedAds);

    return (
        <>
            <Meta
                title={langContent.pageTitle + ' - ' + langContent.title}
                description='Very nice page'
            />

            <LayoutContainer footerContent={footerContent}>

                <CountryList
                    title={langContent.title}
                    subtitle={langContent.subtitle}
                    searchableCountries={searchableCountries}
                >
                    <PremiumList premiumAds={ads} />
                </CountryList>

            </LayoutContainer>
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {

    const lang = context.locale || "en";
    const countryList = await getDetailedCountries();
    const countryData: CountryCardData[] = countryList.map(country => convertCountryToCardData(country, lang, "institution"));
    const searchableCountries = generateSearchable({ type: "Country", data: countryData });

    // Ads
    const ads: DetailedUserAd[] = await getAds(AD_PAGE_INSTITUTIONS);
    const stringifiedAds = JSON.stringify(ads);

    const footerContent: FooterContent[] = [
        { title: "Countries", data: searchableCountries, type: "Searchable" },
    ]

    return {
        props: {
            stringifiedAds: stringifiedAds,
            searchableCountries: searchableCountries,
            footerContent: footerContent
        }
    }

}

export default Institutions;