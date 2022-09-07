import { Grid } from '@mui/material';
import { SubjectType } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import GenericPageHeader from '../../../components/elements/GenericPageHeader';
import SubjectCard from '../../../components/elements/itemcards/SubjectCard';
import Breadcrumb from '../../../components/layout/Breadcrumb';
import { FooterContent } from '../../../components/layout/footer/Footer';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import Meta from '../../../components/partials/Meta';
import prisma from '../../../lib/prisma';
import { getCountries, getSubjectsDetailedByCategory, getSubjectType } from '../../../lib/prismaQueries';
import { DetailedSubject } from '../../../lib/types/DetailedDatabaseTypes';
import { getDBLocale, getLocalizedName } from '../../../lib/util';

type Props = {
  subjectTypeInfo: SubjectType,
  subjects: DetailedSubject[],
  footerContent: FooterContent[],
}

const SubjectCategoryPage: NextPage<Props> = props => {

  const { subjectTypeInfo, subjects, footerContent } = props;

  const { t, lang } = useTranslation('subject');
  const langContent = {
    pageTitle: t('common:page-title')
  }

  const query = useRouter().query;
  const courseTypeName = getLocalizedName({ lang: lang, any: props.subjectTypeInfo });

  return (
    <LayoutContainer footerContent={props.footerContent}>

      <Meta
        title={langContent.pageTitle + " - " + courseTypeName}
        description='Very nice page'
      />


      <Breadcrumb subjectTypeInfo={props.subjectTypeInfo} />

      <GenericPageHeader title={courseTypeName} description={"Find courses of this type"} />

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

                <Grid key={i} item xs={4} sm={5} xl={3}>
                  <SubjectCard subject={subject} />
                </Grid>

              ))
            }
          </Grid>

        </Grid>
      </Grid>

    </LayoutContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {

  const courseTypes = await prisma.subjectType.findMany();

  let paths: {
    params: ParsedUrlQuery;
    locale?: string | undefined;
  }[] = [];

  // Add locale to every possible path
  locales?.forEach((locale) => {
    courseTypes.forEach((subjectTypes) => {
      paths.push({
        params: {
          SubjectCategory: subjectTypes.url,
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

export async function getStaticProps(context: GetStaticPropsContext) {

  let subjectCategory = "" + context?.params?.SubjectCategory;
  let localeDb = getDBLocale(context.locale);

  const subjectTypeInfo: SubjectType | null = await getSubjectType(subjectCategory)

  // Get all courses of this category
  const subjects: DetailedSubject[] = await getSubjectsDetailedByCategory(subjectCategory);

  // Footer Data
  // Get all countries
  const countryList = await getCountries("asc");
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: { subjectTypeInfo: subjectTypeInfo, subjects: subjects, footerContent: footerContent }
  }

}

export default SubjectCategoryPage