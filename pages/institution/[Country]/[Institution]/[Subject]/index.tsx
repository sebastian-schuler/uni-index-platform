import { Grid, Stack, Typography } from '@mui/material'
import { Country, Institution, Subject } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import Breadcrumb from '../../../../../components/layout/Breadcrumb'
import { FooterContent } from '../../../../../components/layout/footer/Footer'
import LayoutContainer from '../../../../../components/layout/LayoutContainer'
import SubjectNav from '../../../../../components/layout/subnav/SubjectNav'
import Meta from '../../../../../components/partials/Meta'
import { URL_INSTITUTION, URL_INSTITUTION_SUBJECTS } from '../../../../../data/urlConstants'
import { getCountries, getCountry, getInstitution, getSubject, getSubjectInstitutionBySubject, getSubjectPaths } from '../../../../../lib/prismaQueries'
import { getDBLocale, toLink } from '../../../../../lib/util'


type Props = {

  country: Country,
  institution: Institution,
  subject: Subject & {
    Institution: Institution
  },

  footerContent: FooterContent[],

}

const SubjectFromInstitutionPage: NextPage<Props> = props => {

  const { country, institution, subject, footerContent } = props;

  const query = useRouter().query;

  const title = subject?.name + " - " + subject?.degree;

  return (
    <LayoutContainer footerContent={footerContent}>

      <Meta
        title={'Uni Index - '}
        description='Very nice page'
      />

      <Breadcrumb
        countryInfo={country}
        institutionInfo={institution}
        subjectInfo={subject}
      />

      <SubjectNav
        title={title}
        backButton={{
          url: toLink(URL_INSTITUTION, query.Country, query.Institution, URL_INSTITUTION_SUBJECTS),
          text: "Back"
        }}
      />

      <Grid container>

        <Grid item xs={12} sm={6} xl={4} padding={1}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography fontWeight={600}>Semester Count</Typography>
            <Typography>{subject?.semester_count}</Typography>
          </Stack>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography fontWeight={600}>Degree</Typography>
            <Typography>{subject?.degree}</Typography>
          </Stack>
        </Grid>

      </Grid>

    </LayoutContainer>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {

  let countryQuery = context?.params?.Country?.toString() || "";
  let institutionQuery = context?.params?.Institution?.toString() || "";
  let subjectQuery = context?.params?.Subject?.toString() || "";
  let localeDb = getDBLocale(context.locale);

  // Get information single objects
  const country: Country | null = await getCountry(countryQuery);
  const institution: Institution | null = await getInstitution(institutionQuery);
  const subjectInfo = await getSubjectInstitutionBySubject(subjectQuery, institutionQuery);

  // Footer Data
  // Get all countries
  const countryList = await getCountries("asc");
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