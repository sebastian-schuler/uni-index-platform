import { Button, Divider, Grid, Group, SimpleGrid, Space, Text } from '@mantine/core';
import { Country, Institution } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Link from 'next/link';
import ResponsiveWrapper from '../../../../../components/Container/ResponsiveWrapper';
import WhitePaper from '../../../../../components/Paper/WhitePaper';
import Breadcrumb from '../../../../../features/Breadcrumb/Breadcrumb';
import { FooterContent } from '../../../../../features/Footer/Footer';
import LhrAuditList from '../../../../../features/OnlineMarketing/LhrAuditList';
import LhrAuditScore from '../../../../../features/OnlineMarketing/LhrAuditScore';
import LhrRingProgress from '../../../../../features/OnlineMarketing/LhrRingProgress';
import { getMinifiedLhrCategory } from '../../../../../lib/lighthouse/lhrParser';
import { getCountries, getCountry, getInstitution } from '../../../../../lib/prisma/prismaQueries';
import { LhrAudit, LhrCategory } from '../../../../../lib/types/lighthouse/CustomLhrTypes';
import { getStaticPathsInstitution } from '../../../../../lib/url-helper/staticPathFunctions';
import { URL_INSTITUTION, URL_INSTITUTION_OM } from '../../../../../lib/url-helper/urlConstants';
import { toLink } from '../../../../../lib/util/util';

/**
 * Return a column of Metrics
 * @param audits - array of audits
 * @param fromIndex - index of first audit to be displayed
 * @param toIndex - index of last audit to be displayed
 * @returns ReactNode - column of audits
 */
const getMetricsCol = (audits: LhrAudit[], fromIndex: number, toIndex: number) => {
    const auditsToDisplay = audits.slice(fromIndex, toIndex);
    return (
        <>
            <Divider />
            {
                auditsToDisplay.map((audit, index) => (
                    <LhrAuditScore
                        key={index}
                        title={audit.title || ""}
                        displayedScore={audit.displayValue || ""}
                        score={audit.score || 0}
                    />
                ))
            }
        </>
    )
}

interface Props {
    institution: Institution,
    country: Country,
    lhrAudits: LhrAudit[],
    lhrCategory: LhrCategory,
    footerContent: FooterContent[],
}

const Performance = ({ institution, country, lhrAudits, lhrCategory, footerContent }: Props) => {

    const audits = lhrAudits.filter(audit => lhrCategory.metricRefs.includes(audit.id));
    const { t, lang } = useTranslation('institution');

    return (
        <ResponsiveWrapper footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('online-marketing.meta.performance-title', { institution: institution?.name })}</title>
                <meta key={"description"} name="description" content={t('online-marketing.meta.performance-title')} />
            </Head>

            <Group position="apart">
                <Breadcrumb countryInfo={country} institutionInfo={institution} />
                <Button
                    variant='outline'
                    component={Link}
                    href={toLink(URL_INSTITUTION, country.url, institution.url, URL_INSTITUTION_OM)}
                >Back to Online Marketing</Button>
            </Group>

            <Space h="md" />

            <Grid mt={"md"}>
                <Grid.Col span={12}>
                    <LhrRingProgress
                        title={lhrCategory.title || ""}
                        score={(lhrCategory.score || 0) * 100}
                        description={"Values are estimated and may vary. The performance score is calculated directly from these metrics."}
                        size={"lg"}
                    />
                </Grid.Col>

                <Grid.Col span={12}>
                    <Text size={"lg"} weight={600}>Metrics</Text>
                    <SimpleGrid cols={2}>
                        <div>
                            {getMetricsCol(audits, 0, 3)}
                        </div>
                        <div>
                            {getMetricsCol(audits, 3, 6)}
                        </div>
                    </SimpleGrid>
                </Grid.Col>

                <Grid.Col span={12}>

                    <LhrAuditList
                        title='Opportunities'
                        auditList={lhrAudits}
                        refs={lhrCategory.opportunityRefs || []}
                    />

                    <LhrAuditList
                        title='Diagnostics'
                        auditList={lhrAudits}
                        refs={lhrCategory.diagnosticRefs || []}
                    />

                    <LhrAuditList
                        title='Passed Audits'
                        auditList={lhrAudits}
                        refs={lhrCategory.passedRefs || []}
                    />

                </Grid.Col>
            </Grid>

        </ResponsiveWrapper>
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
    const lhr = await getMinifiedLhrCategory(lhrData, "performance");

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


export default Performance;