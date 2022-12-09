import { Country, Institution, Subject } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import Breadcrumb from '../../../../../layout/Breadcrumb'
import { FooterContent } from '../../../../../layout/footer/Footer'
import LayoutContainer from '../../../../../layout/LayoutContainer'
import SubjectNav from '../../../../../layout/subnav/SubjectNav'
import Meta from '../../../../../components/partials/Meta'
import { URL_INSTITUTION, URL_INSTITUTION_SUBJECTS } from '../../../../../lib/url-helper/urlConstants'
import { getCountries, getCountry, getInstitution, getSubject } from '../../../../../lib/prisma/prismaQueries'
import { getDBLocale, toLink } from '../../../../../lib/util/util'
import { ParsedUrlQuery } from 'querystring'
import { getJobsFromApi } from '../../../../../lib/apis/jobsHandler'
import WhitePaper from '../../../../../components/WhitePaper'
import { getSubjectPaths } from '../../../../../lib/prisma/prismaUrlPaths'

type Props = {
    country: Country,
    institution: Institution,
    subject: Subject,

    footerContent: FooterContent[],
}

const SubjectJobs: NextPage<Props> = props => {

    const query = useRouter().query;

    const title = props.subject.name + " - " + props.subject.degree

    const countryUrl = (query.Country || "") as string;
    const institutionUrl = (query.Institution || "") as string;

    return (
        <LayoutContainer footerContent={props.footerContent}>

            <Meta
                title={'Uni Index - '}
                description='Very nice page'
            />

            <Breadcrumb
                countryInfo={props.country}
                institutionInfo={props.institution}
                subjectInfo={props.subject}
            />

            <SubjectNav
                title={title}
                backButton={{
                    url: toLink(URL_INSTITUTION, countryUrl, institutionUrl, URL_INSTITUTION_SUBJECTS),
                    text: "Back"
                }}
            />

            <WhitePaper>
                <p>Jobs</p>
            </WhitePaper>

        </LayoutContainer>
    )
}

export async function getStaticProps(context: GetStaticPropsContext) {

    let countryQuery = "" + context?.params?.Country;
    let institutionQuery = "" + context?.params?.Institution;
    let subjectQuery = "" + context?.params?.Subject;
    let localeDb = getDBLocale(context.locale);

    // Get information single objects
    const country: Country | null = await getCountry(countryQuery);
    const institution: Institution | null = await getInstitution(institutionQuery);
    const subject: Subject | null = await getSubject(subjectQuery, institutionQuery);

    const jobs = await getJobsFromApi({ wo: "Berlin", was: "Informatik" });

    // Footer Data
    // Get all countries
    const countryList = await getCountries();
    const footerContent: FooterContent[] = [
        { title: "Countries", data: countryList, type: "Country" },
    ]

    return {
        props: { institution: institution, country: country, subject: subject, footerContent: footerContent }
    }

}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {

    const subjects = await getSubjectPaths();

    let paths: {
        params: ParsedUrlQuery;
        locale?: string | undefined;
    }[] = [];

    // Add locale to every possible path
    locales?.forEach((locale) => {
        subjects.forEach((subject) => {
            paths.push({
                params: {
                    Country: subject.City?.State.Country.url,
                    Institution: subject.Institution.url,
                    Subject: subject.url
                },
                locale,
            });
        })
    });

    return {
        paths: paths,
        fallback: false
    }
}

export default SubjectJobs