import { Stack, Text } from '@mantine/core'
import { Country, Institution } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import ResponsiveWrapper from '../../../../../../components/Container/ResponsiveWrapper'
import MantineLink from '../../../../../../components/Link/MantineLink'
import WhitePaper from '../../../../../../components/Paper/WhitePaper'
import Breadcrumb from '../../../../../../features/Breadcrumb/Breadcrumb'
import { FooterContent } from '../../../../../../features/Footer/Footer'
import SubjectNav from '../../../../../../features/Navigation/SubjectNav'
import { getSubjectDetailedByUrl } from '../../../../../../lib/prisma/prismaDetailedQueries'
import { getCountries, getCountry, getInstitution } from '../../../../../../lib/prisma/prismaQueries'
import { getSubjectPaths } from '../../../../../../lib/prisma/prismaUrlPaths'
import { DetailedSubject } from '../../../../../../lib/types/DetailedDatabaseTypes'
import { URL_INSTITUTION, URL_INSTITUTION_SUBJECTS } from '../../../../../../lib/url-helper/urlConstants'
import { toLink } from '../../../../../../lib/util/util'


interface Props {
    country: Country,
    institution: Institution,
    subject: DetailedSubject,
    footerContent: FooterContent[],
}

const SubjectFromInstitutionPage: NextPage<Props> = ({ country, institution, subject, footerContent }: Props) => {

    const { t } = useTranslation('institution');
    const query = useRouter().query;

    const title = subject?.name + " - " + subject?.degree;

    const countryUrl = (query.Country || "") as string;
    const institutionUrl = (query.Institution || "") as string;


    return (
        <ResponsiveWrapper footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('meta.subject-title', { institution: institution?.name, subject: subject.name })}</title>
                <meta key={"description"} name="description" content={t('meta.subject-description', { institution: institution?.name, subject: subject.name })} />
            </Head>

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

            <WhitePaper>
                <Stack>

                    <Stack spacing={0}>
                        <Text size={"lg"} weight={"bold"}>Study length</Text>
                        <Text>{subject?.duration} Semesters</Text>
                    </Stack>

                    <Stack spacing={0}>
                        <Text size={"lg"} weight={"bold"}>Degree</Text>
                        <Text>{subject?.degree}</Text>
                    </Stack>

                    <Stack spacing={0}>
                        <Text size={"lg"} weight={"bold"}>Length ({subject?.duration_type})</Text>
                        <Text>{subject?.duration}</Text>
                    </Stack>

                    <Stack spacing={0}>
                        <Text size={"lg"} weight={"bold"}>Admission</Text>
                        <Text>{subject?.admission}</Text>
                    </Stack>

                    <Stack spacing={0}>
                        <Text size={"lg"} weight={"bold"}>Website</Text>
                        <MantineLink url={subject?.website} type="external">{subject?.website}</MantineLink>
                    </Stack>

                </Stack>
            </WhitePaper>

        </ResponsiveWrapper>
    )
}

export async function getStaticProps(context: GetStaticPropsContext) {

    let countryUrl = context?.params?.Country?.toString() || "";
    let institutionUrl = context?.params?.Institution?.toString() || "";
    let subjectUrl = context?.params?.Subject?.toString() || "";

    // Get information single objects
    const country: Country | null = await getCountry(countryUrl);
    const institution: Institution | null = await getInstitution({ institutionUrl });
    const subjectInfo: DetailedSubject | null = institution && (await getSubjectDetailedByUrl(subjectUrl, institution.id));

    // Footer Data
    // Get all countries
    const countryList = await getCountries();
    const footerContent: FooterContent[] = [
        { title: "Countries", data: countryList, type: "Country" },
    ]

    return {
        props: {
            institution: institution,
            country: country,
            subject: subjectInfo,
            footerContent: footerContent
        }
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

export default SubjectFromInstitutionPage