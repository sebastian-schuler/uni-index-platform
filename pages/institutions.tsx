import { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import ResponsiveWrapper from '../components/Container/ResponsiveWrapper';
import AdContainer from '../features/Ads/AdContainer';
import CountryList from '../features/CountryList/CountryList';
import { FooterContent } from '../features/Footer/Footer';
import { getAdCardArray } from '../lib/ads/adConverter';
import { AD_PAGE_INSTITUTIONS } from '../lib/appConstants';
import { getDetailedCountries } from '../lib/prisma/prismaDetailedQueries';
import { AdCardData, CountryCardData, Searchable } from '../lib/types/UiHelperTypes';
import { convertCountryToCardData } from '../lib/util/conversionUtil';
import { generateSearchable } from '../lib/util/util';

interface Props {
    ads: AdCardData[][],
    searchableCountries: Searchable[],
    footerContent: FooterContent[],
}

const Institutions: NextPage<Props> = ({ ads, searchableCountries, footerContent }: Props) => {

    const { t } = useTranslation('institution');

    return (
        <>
            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('meta.institutions-title')}</title>
                <meta key={"description"} name="description" content={t('meta.institutions-description')} />
            </Head>

            <ResponsiveWrapper footerContent={footerContent}>

                <CountryList
                    title={t('institutions.title')}
                    subtitle={t('institutions.subtitle')}
                    searchableCountries={searchableCountries}
                >
                    <AdContainer ads={ads} />
                </CountryList>

            </ResponsiveWrapper>
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
    const ads = await getAdCardArray(AD_PAGE_INSTITUTIONS, lang);

    const footerContent: FooterContent[] = [
        { title: "Countries", data: searchableCountries, type: "Searchable" },
    ]

    return {
        props: {
            ads,
            searchableCountries,
            footerContent,
        }
    }

}

export default Institutions;