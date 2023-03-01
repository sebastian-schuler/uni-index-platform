import { Country, Institution } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import React from 'react'
import LhrCategoryPage from '../../../../../features/OnlineMarketing/LhrCategoryPage'
import { FooterContent } from '../../../../../features/Footer/Footer'
import { getMinifiedLhrCategory } from '../../../../../lib/lighthouse/lhrParser'
import { getCountries, getCountry, getInstitution } from '../../../../../lib/prisma/prismaQueries'
import { LhrAudit, LhrCategory } from '../../../../../lib/types/lighthouse/CustomLhrTypes'
import { getStaticPathsInstitution } from '../../../../../lib/url-helper/staticPathFunctions'

interface Props {
    institution: Institution,
    country: Country,
    lhrAudits: LhrAudit[],
    lhrCategory: LhrCategory,
    footerContent: FooterContent[],
}

const PwaPage = ({ institution, country, lhrAudits, lhrCategory, footerContent }: Props) => {

    const { t, lang } = useTranslation('institution');

    return (
        <>
            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('online-marketing.meta.pwa-title', { institution: institution?.name })}</title>
                <meta key={"description"} name="description" content={t('online-marketing.meta.pwa-title')} />
            </Head>

            <LhrCategoryPage
                country={country}
                institution={institution}
                lhrAudits={lhrAudits}
                lhrCategory={lhrCategory}
                footerContent={footerContent}
            />
        </>
    )
}


export async function getStaticProps(context: GetStaticPropsContext) {

    let countryUrl = "" + context?.params?.Country;
    let institutionUrl = "" + context?.params?.Institution;

    const country = await getCountry(countryUrl);
    const institution = await getInstitution({ institutionUrl });

    // Footer Data
    // Get all countries
    const countryList = await getCountries();
    const footerContent: FooterContent[] = [
        { title: "Countries", data: countryList, type: "Country" },
    ]

    const lhrData = await import(`../../../../../data/lighthouse/lhr-${institution?.url}.json`).catch((err) => {
        console.log("Not found");
    });

    const lhr = await getMinifiedLhrCategory(lhrData, "pwa");

    console.log("categories", lhr.categories)
    return {
        props: {
            institution,
            country,
            lhrAudits: lhr.audits,
            lhrCategory: lhr.categories[0] ?? [],
            footerContent
        }
    }

}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
    const paths = await getStaticPathsInstitution(locales || []);
    return {
        paths: paths,
        fallback: false
    }
}

export default PwaPage