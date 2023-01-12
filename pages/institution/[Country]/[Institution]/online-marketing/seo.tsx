import { Button, Grid } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { Country, Institution } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext } from 'next';
import LhrAuditList from '../../../../../components/elements/onlinemarketing/LhrAuditList';
import LhrRingProgress from '../../../../../components/elements/onlinemarketing/LhrRingProgress';
import Meta from '../../../../../components/partials/Meta';
import WhitePaper from '../../../../../components/WhitePaper';
import Breadcrumb from '../../../../../layout/Breadcrumb';
import { FooterContent } from '../../../../../layout/footer/Footer';
import LayoutContainer from '../../../../../layout/LayoutContainer';
import { getMinifiedLhrCategory } from '../../../../../lib/lighthouse/lhrParser';
import { getCountries, getCountry, getInstitution } from '../../../../../lib/prisma/prismaQueries';
import { LhrAudit, LhrCategory } from '../../../../../lib/types/lighthouse/CustomLhrTypes';
import { getStaticPathsInstitution } from '../../../../../lib/url-helper/staticPathFunctions';
import { URL_INSTITUTION, URL_INSTITUTION_ONLINEMARKETING } from '../../../../../lib/url-helper/urlConstants';
import { toLink } from '../../../../../lib/util/util';

interface Props {
    institution: Institution,
    country: Country,
    lhrAudits: LhrAudit[],
    lhrCategory: LhrCategory,
    footerContent: FooterContent[],
}

const SeoPage = ({ institution, country, lhrAudits, lhrCategory, footerContent }: Props) => {

    return (
        <LayoutContainer footerContent={footerContent}>

            <Meta
                title={'Uni Index - '}
                description='Very nice page'
            />

            <Breadcrumb countryInfo={country} institutionInfo={institution} />

            <WhitePaper>

                <Button variant='outline' component={NextLink} href={toLink(URL_INSTITUTION, country.url, institution.url, URL_INSTITUTION_ONLINEMARKETING)}>Back to Online Marketing</Button>

                <Grid>

                    <Grid.Col span={4}>
                        <LhrRingProgress
                            title={lhrCategory.title || ""}
                            score={(lhrCategory.score || 0) * 100}
                            description={"Values are estimated and may vary. The performance score is calculated directly from these metrics."}
                            size={"lg"}
                        />
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

            </WhitePaper>
        </LayoutContainer>
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

    // TODO dynamic import, finish this
    const id = "HSKL";
    const lhrData = await import(`../../../../../data/lighthouse/lhr-${id}.json`).catch((err) => {
        console.log("Not found");
    });

    const lhr = await getMinifiedLhrCategory(lhrData, "seo");

    return {
        props: {
            institution,
            country,
            lhrAudits: lhr.audits,
            lhrCategory: lhr.categories[0],
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


export default SeoPage;