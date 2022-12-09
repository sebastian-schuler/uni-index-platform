import { Divider, Grid, SimpleGrid, Text } from '@mantine/core'
import { Country, Institution } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import LhrAuditListItem from '../../../../components/elements/onlinemarketing/LhrAuditListItem'
import LhrAuditScore from '../../../../components/elements/onlinemarketing/LhrAuditScore'
import LhrRingProgress from '../../../../components/elements/onlinemarketing/LhrRingProgress'
import Breadcrumb from '../../../../layout/Breadcrumb'
import { FooterContent } from '../../../../layout/footer/Footer'
import LayoutContainer from '../../../../layout/LayoutContainer'
import InstitutionNav from '../../../../layout/subnav/InstitutionNav'
import Meta from '../../../../components/partials/Meta'
import WhitePaper from '../../../../components/WhitePaper'
import { getCountries, getCountry, getInstitution } from '../../../../lib/prisma/prismaQueries'
import { LhrAudit, MinifiedLhrReport } from '../../../../lib/types/lighthouse/CustomLhrTypes'
import { getStaticPathsInstitution } from '../../../../lib/url-helper/staticPathFunctions'
import { getMinifiedLhr } from '../../../../lib/util/lighthouseUtil'

interface Props {
  institution: Institution,
  country: Country,
  lhReport: MinifiedLhrReport,
  footerContent: FooterContent[],
}

const InstitutionOnlineMarketing: NextPage<Props> = ({ institution, country, lhReport, footerContent }: Props) => {

  /**
   * Bundle categories and their respective audits into a single object
   * @param id - category id
   * @returns - object with category and audits
   */
  const getCategory = (id: string) => {
    const category = lhReport.categories.find(category => category.id === id);
    const audits = lhReport.audits.filter(audit => category?.metricRefs.includes(audit.id));
    return { data: category, audits: audits };
  }

  // Categories
  const categories = {
    performance: getCategory('performance'),
    accessibility: getCategory('accessibility'),
    bestPractices: getCategory('best-practices'),
    seo: getCategory('seo'),
    pwa: getCategory('pwa'),
  }

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

  /**
   * Get a list of diagnostics
   * @param refs - audit ids
   * @returns - ReactNode - list of audits of diagnostics
   */
  const getDiagnosticsList = (refs: string[]) => {

    const audits = lhReport.audits.filter(audit => refs.includes(audit.id));

    audits.sort((a, b) => {
      // Score = null is informative
      // Order is: Error, Warning, Informative, Passed
      if (a.score === null && b.score && b.score >= 0.9) {
        return -1;
      }
      if (a.score === null) {
        return 1;
      }
      if (b.score === null) {
        return -1;
      }
      return a.score - b.score;
    });

    return (
      <>
        <Divider />
        {
          audits.map((audit, i) => (
            <LhrAuditListItem key={i} audit={audit} />
          ))
        }

      </>
    )
  }

  return (
    <LayoutContainer footerContent={footerContent}>

      <Meta
        title={'Uni Index - '}
        description='Very nice page'
      />

      <Breadcrumb countryInfo={country} institutionInfo={institution} />

      <InstitutionNav title={institution.name} />

      <WhitePaper>

        <Grid>
          <Grid.Col span={4}></Grid.Col>

          <Grid.Col span={4}>
            <LhrRingProgress
              title={categories.performance.data?.title || ""}
              score={(categories.performance.data?.score || 0) * 100}
              description={"Values are estimated and may vary. The performance score is calculated directly from these metrics."}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Text size={"lg"} weight={600}>Metrics</Text>
            <SimpleGrid cols={2}>
              <div>
                {
                  getMetricsCol(categories.performance.audits, 0, 3)
                }
              </div>
              <div>
                {
                  getMetricsCol(categories.performance.audits, 3, 6)
                }
              </div>
            </SimpleGrid>
          </Grid.Col>

          <Grid.Col span={12}>
            <Text size={"lg"} weight={600}>Opportunities</Text>
            {
              getDiagnosticsList(categories.performance.data?.opportunityRefs || [])
            }

            <Text size={"lg"} weight={600}>Diagnostics</Text>
            {
              getDiagnosticsList(categories.performance.data?.diagnosticRefs || [])
            }

            <Text size={"lg"} weight={600}>Passed Audits</Text>
            {
              getDiagnosticsList(categories.performance.data?.passedRefs || [])
            }
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
  const institution = await getInstitution(institutionUrl);

  // Footer Data
  // Get all countries
  const countryList = await getCountries();
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  // TODO dynamic import, finish this
  const id = "HSKL";
  const lhrData = await import(`../../../../data/lighthouse/lhr-${id}.json`).catch((err) => {
    console.log("Not found");
  });
  const lhReport = await getMinifiedLhr(lhrData);

  return {
    props: {
      institution,
      country,
      lhReport,
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


export default InstitutionOnlineMarketing