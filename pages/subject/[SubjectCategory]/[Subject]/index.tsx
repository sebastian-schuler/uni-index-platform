import { Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';
import { Country, Institution, Subject, SubjectType } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import GenericPageHeader from '../../../../components/elements/GenericPageHeader';
import Breadcrumb from '../../../../components/layout/Breadcrumb';
import { FooterContent } from '../../../../components/layout/footer/Footer';
import LayoutContainer from '../../../../components/layout/LayoutContainer';
import Link from '../../../../components/mui/NextLinkMui';
import Meta from '../../../../components/partials/Meta';
import { URL_INSTITUTION } from '../../../../data/urlConstants';
import { getCountries, getSubjectSubjectTypePaths, getSubjectType } from '../../../../lib/prismaQueries';
import { getLocalizedName, toLink } from '../../../../lib/util';

type Props = {
  footerContent: FooterContent[],
  courseTypeInfo: SubjectType,
  courseInfo: Subject,
  institutionInfo: Institution,
  countryInfo: Country,
  subjects: (Subject & {
    City: {
      State: {
        Country: Country;
      };
    };
    Institution: Institution;
  })[]
}

const SubjectFromCategoryPage: NextPage<Props> = props => {

  const { footerContent, courseTypeInfo, courseInfo, institutionInfo, countryInfo, subjects } = props;
  const query = useRouter().query;

  const { t, lang } = useTranslation('subject');
  const langContent = {
    pageTitle: t('common:page-title')
  }

  const localizedCountryName = getLocalizedName({ lang: lang, subject: courseInfo });

  return (

    <LayoutContainer footerContent={footerContent}>

      <Meta
        title={langContent.pageTitle + ' - ' + localizedCountryName}
        description='Very nice page'
      />

      <Breadcrumb
        subjectTypeInfo={courseTypeInfo}
        subjectInfo={courseInfo}
        countryInfo={countryInfo}
        institutionInfo={institutionInfo}
      />

      <GenericPageHeader title={localizedCountryName} description={"Find institutes offering this course"} />

      <Grid container columnSpacing={4}>

        <Grid item xs={12} sm={3} xl={2}>
          ffffffffffffffffffffffffffff
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
              subjects.map((subject, i) => (

                // TODO layout
                <Grid key={i} item xs={4} sm={5} xl={3}>
                  <Card sx={{}}>
                    <CardActionArea component={Link} href={toLink(URL_INSTITUTION, subject.City.State.Country.url, subject.Institution.url, subject.url)} title={getLocalizedName({ lang: lang, subject: subject })}>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {getLocalizedName({ lang: lang, subject: subject })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {subject.Institution.name}
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

  let subjectTypeUrl = "" + context?.params?.SubjectCategory;
  let subjectUrl = "" + context?.params?.Subject;

  const courseTypeInfo = await getSubjectType(subjectTypeUrl);
  // const courseInfo = await getSubject(subjectUrl);
  // const countryInfo = await getCountrySubjectBySubject(subjectUrl);

  // TODO need IDs of location and institution
  // TODO these are all courses with specific names, not specific courses...
  // const institutionInfo = await getSubjectInstitutionBySubject(subjectUrl, 0 , 0);

  // const subjects = courseInfo !== null ? await getSubjectsInstitutionByName(courseInfo.name) : [];

  // Footer Data
  // Get all countries
  const countryList = await getCountries("asc");
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: {
      // subjects: subjects,

      courseTypeInfo: courseTypeInfo,
      // courseInfo: courseInfo,
      // institutionInfo: institutionInfo?.Institution,
      // countryInfo: countryInfo?.City?.State.Country,

      footerContent: footerContent
    }
  }

}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {

  const courses = await getSubjectSubjectTypePaths();

  let paths: {
    params: ParsedUrlQuery;
    locale?: string | undefined;
  }[] = [];

  // Add locale to every possible path
  locales?.forEach((locale) => {
    courses.forEach((course) => {
      paths.push({
        params: {
          SubjectCategory: course.SubjectType.url,
          Subject: course.url
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

export default SubjectFromCategoryPage;