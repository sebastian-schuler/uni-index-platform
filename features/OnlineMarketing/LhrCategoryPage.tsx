import { Button, Grid, Group, Space } from "@mantine/core"
import { Country, Institution } from "@prisma/client"
import Link from "next/link"
import Breadcrumb from "../Breadcrumb/Breadcrumb"
import { FooterContent } from "../Footer/Footer"
import ResponsiveWrapper from "../../components/Container/ResponsiveWrapper"
import { LhrAudit, LhrCategory } from "../../lib/types/lighthouse/CustomLhrTypes"
import { URL_INSTITUTION, URL_INSTITUTION_OM } from "../../lib/url-helper/urlConstants"
import { toLink } from "../../lib/util/util"
import WhitePaper from "../../components/Paper/WhitePaper"
import LhrAuditList from "./LhrAuditList"
import LhrRingProgress from "./LhrRingProgress"

interface Props {
    institution: Institution,
    country: Country,
    lhrAudits: LhrAudit[],
    lhrCategory: LhrCategory,
    footerContent: FooterContent[],
}

const LhrCategoryPage = ({ institution, country, lhrAudits, lhrCategory, footerContent }: Props) => {

    const backLink = toLink(URL_INSTITUTION, country.url, institution.url, URL_INSTITUTION_OM);

    return (
        <ResponsiveWrapper footerContent={footerContent}>

            <Group position="apart">
                <Breadcrumb countryInfo={country} institutionInfo={institution} />
                <Button variant='outline' component={Link} href={backLink}>Back to Online Marketing</Button>
            </Group>

            <Space h="md" />

            <WhitePaper>
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
        </ResponsiveWrapper>
    )
}

export default LhrCategoryPage