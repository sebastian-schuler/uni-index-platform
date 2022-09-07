import { Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';
import { Country, Institution, Subject, SubjectType } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import Breadcrumb from '../../../../components/layout/Breadcrumb';
import { FooterContent } from '../../../../components/layout/footer/Footer';
import LayoutContainer from '../../../../components/layout/LayoutContainer';
import InstitutionNav from '../../../../components/layout/subnav/InstitutionNav';
import Link from '../../../../components/mui/NextLinkMui';
import Meta from '../../../../components/partials/Meta';
import { URL_INSTITUTION } from '../../../../data/urlConstants';
import { getCountries, getCountry, getInstitution, getInstitutionPaths, getSubjectsSubjectTypeByInstitution } from '../../../../lib/prismaQueries';
import { toLink } from '../../../../lib/util';

type Props = {

  institution: Institution,
  country: Country,
  footerContent: FooterContent[],
  courseList: (Subject & {
    CourseType: SubjectType;
  })[]

}

const subjects: NextPage<Props> = props => {

  const { institution, country, footerContent, courseList } = props;

  const query = useRouter().query;

  return (
    <LayoutContainer footerContent={footerContent}>

      <Meta
        title={'Uni Index - '}
        description='Very nice page'
      />

      <Breadcrumb countryInfo={country} institutionInfo={institution} />

      <InstitutionNav title={institution.name} />

      <Grid container columnSpacing={4}>

        <Grid item xs={12} sm={3} xl={2}>
          Filter
          {/* <SearchBox
    label={langContent.searchLabel}
    placeholder={langContent.searchPlaceholder}
    searchableList={dataList}
    setSearchableList={setDataList}
    /> */}
        </Grid>

        <Grid item
          xs={12} sm={9} xl={10}
          flexGrow={1}
          component={'section'}
        >

          <Grid container columnSpacing={4}>
            {
              courseList.map((course, i) => (

                <Grid key={i} item xs={4} sm={5} xl={3}>
                  <Card sx={{}}>
                    <CardActionArea component={Link} href={toLink(URL_INSTITUTION, query.Country, query.Institution, course.url)} title={course.name}>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {course.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Semester: {course.semester_count}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>

              ))
            }
          </Grid>

        </Grid>
      </Grid>

    </LayoutContainer>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {

  let countryUrl = "" + context?.params?.Country;
  let institutionUrl = "" + context?.params?.Institution;

  const country = await getCountry(countryUrl);
  const institution = await getInstitution(institutionUrl);
  const courseList = await getSubjectsSubjectTypeByInstitution(institutionUrl, "asc");

  // Footer Data
  // Get all countries
  const countryList = await getCountries("asc");
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: { institution: institution, courseList: courseList, country: country, footerContent: footerContent }
  }
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {

  const institutions = await getInstitutionPaths();

  let paths: {
    params: ParsedUrlQuery;
    locale?: string | undefined;
  }[] = [];

  // Add locale to every possible path
  locales?.forEach((locale) => {
    institutions.forEach((institution) => {

      // Iterate every Institution but also every InstitutionLocation (unis can have multiple locations, even in different countries)
      institution.Subject.forEach((subject) => {
        paths.push({
          params: {
            Country: subject.City?.State.Country.url,
            Institution: institution.url
          },
          locale,
        });
      })

    })
  });

  return {
    paths: paths,
    fallback: false
  }
}

export default subjects;