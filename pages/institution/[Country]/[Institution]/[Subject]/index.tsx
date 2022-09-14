import { Country, Institution, Subject } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import Breadcrumb from '../../../../../components/layout/Breadcrumb'
import { FooterContent } from '../../../../../components/layout/footer/Footer'
import LayoutContainer from '../../../../../components/layout/LayoutContainer'
import SubjectNav from '../../../../../components/layout/subnav/SubjectNav'
import Meta from '../../../../../components/partials/Meta'
import { URL_INSTITUTION, URL_INSTITUTION_SUBJECTS } from '../../../../../lib/url-helper/urlConstants'
import { getCountries, getCountry, getInstitution, getSubject, getSubjectInstitutionBySubject, getSubjectPaths } from '../../../../../lib/prisma/prismaQueries'
import { getDBLocale, toLink } from '../../../../../lib/util'
import WhitePaper from '../../../../../components/elements/institution/WhitePaper'
import { Stack, Text } from '@mantine/core'


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

  const countryUrl = (query.Country || "") as string;
  const institutionUrl = (query.Institution || "") as string;


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
          url: toLink(URL_INSTITUTION, countryUrl, institutionUrl, URL_INSTITUTION_SUBJECTS),
          text: "Back"
        }}
      />

      <WhitePaper>
        <Stack>

          <Stack spacing={0}>
            <Text size={"lg"} weight={"bold"}>Study length</Text>
            <Text>{subject?.semester_count} Semesters</Text>
          </Stack>

          <Stack spacing={0}>
            <Text size={"lg"} weight={"bold"}>Degree</Text>
            <Text>{subject?.degree}</Text>
          </Stack>

        </Stack>
      </WhitePaper>

    </LayoutContainer>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {

  let countryQuery = context?.params?.Country?.toString() || "";
  let institutionQuery = context?.params?.Institution?.toString() || "";
  let subjectQuery = context?.params?.Subject?.toString() || "";

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