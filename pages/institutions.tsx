import { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import PremiumList from '../components/container/AdList';
import CountryList from '../components/container/CountryList';
import { FooterContent } from '../layout/footer/Footer';
import LayoutContainer from '../layout/LayoutContainer';
import { AD_PAGE_INSTITUTIONS } from '../lib/appConstants';
import { getDetailedCountries } from '../lib/prisma/prismaDetailedQueries';
import { getAds } from '../lib/prisma/prismaQueries';
import { DetailedUserAd } from '../lib/types/DetailedDatabaseTypes';
import { CountryCardData, Searchable } from '../lib/types/UiHelperTypes';
import { convertCountryToCardData } from '../lib/util/conversionUtil';
import { generateSearchable } from '../lib/util/util';

interface Props {
    stringifiedAds: string,
    searchableCountries: Searchable[],
    footerContent: FooterContent[],
}

const Institutions: NextPage<Props> = ({ stringifiedAds, searchableCountries, footerContent }: Props) => {

    const { t } = useTranslation('institution');
    const ads: DetailedUserAd[] = JSON.parse(stringifiedAds);

    return (
        <>
            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('institutions-title')}</title>
                <meta key={"description"} name="description" content={t('institutions-description')} />
            </Head>

            <LayoutContainer footerContent={footerContent}>

                <CountryList
                    title={t('institutions-title')}
                    subtitle={t('institutions-subtitle')}
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
    const countries = await getDetailedCountries();
    countries.sort((a, b) => b.popularity_score - a.popularity_score);
    const countryData: CountryCardData[] = countries.map(country => convertCountryToCardData(country, lang, "institution"));
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