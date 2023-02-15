import { Country, Institution } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext } from 'next'
import React from 'react'
import LhrCategoryPage from '../../../../../components/elements/onlinemarketing/LhrCategoryPage'
import { FooterContent } from '../../../../../layout/footer/Footer'
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
    return (
        <LhrCategoryPage
            country={country}
            institution={institution}
            lhrAudits={lhrAudits}
            lhrCategory={lhrCategory}
            footerContent={footerContent}
        />
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

    console.log("categories",lhr.categories)
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