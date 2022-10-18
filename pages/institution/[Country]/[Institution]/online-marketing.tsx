import { Country, Institution } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import Breadcrumb from '../../../../components/layout/Breadcrumb'
import { FooterContent } from '../../../../components/layout/footer/Footer'
import LayoutContainer from '../../../../components/layout/LayoutContainer'
import InstitutionNav from '../../../../components/layout/subnav/InstitutionNav'
import Meta from '../../../../components/partials/Meta'
import { getCountries, getCountry, getInstitution } from '../../../../lib/prisma/prismaQueries'
import { getStaticPathsInstitution } from '../../../../lib/url-helper/staticPathFunctions'
import fs from 'fs';
import Result from '../../../../lib/types/lighthouse/lhr'
import { LhrAudit, MinifiedLhrReport } from '../../../../lib/types/lighthouse/CustomLhrTypes'
import WhitePaper from '../../../../components/WhitePaper'
import { Center, Grid, Group, Paper, RingProgress, Text } from '@mantine/core'
import LhrRingProgress from '../../../../components/elements/onlinemarketing/LhrRingProgress'

interface Props {
  institution: Institution,
  country: Country,
  lhrReport: MinifiedLhrReport,
  footerContent: FooterContent[],
}

const InstitutionOnlineMarketing: NextPage<Props> = ({ institution, country, lhrReport, footerContent }: Props) => {

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

          <Grid.Col span={4}>
            <LhrRingProgress
              title={lhrReport.performance?.title || ""}
              score={(lhrReport.performance?.score || 0) * 100}
              description={"Values are estimated and may vary. The performance score is calculated directly from these metrics."}
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
  const institution = await getInstitution(institutionUrl);

  // Footer Data
  // Get all countries
  const countryList = await getCountries();
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  // TODO dynamic import, finish this
  const id = "4a4abf13-b17a-4e8e-9f4f-403637ada531";
  const lhrData = await import(`../../../../data/lighthouse/lhr-${id}.json`).catch((err) => {
    console.log("Not found");
  });
  let lhrReport: MinifiedLhrReport = {
    accessibility: null,
    bestPractices: null,
    performance: null,
    pwa: null,
    seo: null,
  }

  // TODO Move minify function to separate file
  if (lhrData) {
    const lhr = lhrData as Result;
    const lhrCategoryNames = ["performance", "accessibility", "best-practices", "seo", "pwa"];

    for (const categoryName of lhrCategoryNames) {

      const category = lhr.categories[categoryName];

      const auditRefs: string[] = [];
      category.auditRefs.forEach((auditRef) => {
        auditRefs.push(auditRef.id);
      });

      const audits: LhrAudit[] = auditRefs.map((auditRef) => {
        const audit = lhr.audits[auditRef]
        return {
          id: audit.id,
          title: audit.title,
          scoreDisplayMode: audit.scoreDisplayMode,
          score: audit.score,
          displayValue: audit.displayValue || null,
        }
      });

      lhrReport[categoryName] = {
        title: category.title,
        score: category.score,
        audits: audits,
      }
    }

  }

  return {
    props: {
      institution,
      country,
      lhrReport,
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