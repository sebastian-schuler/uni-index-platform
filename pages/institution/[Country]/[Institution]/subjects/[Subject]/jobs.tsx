import { country, institution, subject } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import ResponsiveWrapper from '../../../../../../components/Container/ResponsiveWrapper'
import Breadcrumb from '../../../../../../features/Breadcrumb/Breadcrumb'
import { FooterContent } from '../../../../../../features/Footer/Footer'
import SubjectNav from '../../../../../../features/Navigation/SubjectNav'
import { getCountries, getCountry, getInstitution, getSubject } from '../../../../../../lib/prisma/prismaQueries'
import { getSubjectPaths } from '../../../../../../lib/prisma/prismaUrlPaths'
import { URL_INSTITUTION, URL_INSTITUTION_SUBJECTS } from '../../../../../../lib/url-helper/urlConstants'
import { getDBLocale, toLink } from '../../../../../../lib/util/util'

type Props = {
    country: country | null,
    institution: institution | null,
    subject: subject | null,

    footerContent: FooterContent[],
}

const SubjectJobs: NextPage<Props> = ({ country, institution, subject, footerContent }: Props) => {

    const query = useRouter().query;

    const title = subject?.name + " - " + subject?.degree;

    const countryUrl = (query.Country || "") as string;
    const institutionUrl = (query.Institution || "") as string;

    return (
        <ResponsiveWrapper footerContent={footerContent}>

            <Breadcrumb
                countryInfo={country}
                institutionInfo={institution}
                subjectInfo={subject}
            />

            <SubjectNav
                title={title}
                backButton={{
                    url: toLink(URL_INSTITUTION, countryUrl, institutionUrl, URL_INSTITUTION_SUBJECTS),
                    text: "Back"
                }}
            />

            <p>Jobs</p>

        </ResponsiveWrapper>
    )
}

export async function getStaticProps(context: GetStaticPropsContext) {

    let countryQuery = "" + context?.params?.Country;
    let institutionUrl = "" + context?.params?.Institution;
    let subjectQuery = "" + context?.params?.Subject;
    let localeDb = getDBLocale(context.locale);

    // Get information single objects
    const country: country | null = await getCountry(countryQuery);
    const institution: institution | null = await getInstitution({ institutionUrl });
    const subject: subject | null = await getSubject(subjectQuery, institutionUrl);

    // const jobs = await getJobsFromApi({ wo: "Berlin", was: "Informatik" });

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
                    Country: subject.city?.state.country.url,
                    Institution: subject.institution.url,
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