import { Group, SimpleGrid, Stack } from '@mantine/core';
import { SubjectType } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { ParsedUrlQuery } from 'querystring';
import GenericPageHeader from '../../../components/elements/GenericPageHeader';
import SubjectCard from '../../../components/elements/itemcards/SubjectCard';
import Breadcrumb from '../../../components/layout/Breadcrumb';
import { FooterContent } from '../../../components/layout/footer/Footer';
import LayoutContainer from '../../../components/layout/LayoutContainer';
import Meta from '../../../components/partials/Meta';
import prisma from '../../../lib/prisma/prisma';
import { getSubjectsDetailedByCategory } from '../../../lib/prisma/prismaDetailedQueries';
import { getCountries, getSubjectType } from '../../../lib/prisma/prismaQueries';
import { DetailedSubject } from '../../../lib/types/DetailedDatabaseTypes';
import { getDBLocale, getLocalizedName } from '../../../lib/util';

interface Props {
  subjectTypeInfo: SubjectType,
  subjects: DetailedSubject[],
  footerContent: FooterContent[],
}

const SubjectCategoryPage: NextPage<Props> = ({ subjectTypeInfo, subjects, footerContent }: Props) => {

  const { t, lang } = useTranslation('subject');
  const langContent = {
    pageTitle: t('common:page-title')
  }

  const courseTypeName = getLocalizedName({ lang: lang, any: subjectTypeInfo });

  return (
    <LayoutContainer footerContent={footerContent}>

      <Meta
        title={langContent.pageTitle + " - " + courseTypeName}
        description='Very nice page'
      />


      <Breadcrumb subjectTypeInfo={subjectTypeInfo} />

      <Stack>

        <GenericPageHeader title={courseTypeName} description={"Find courses of this type"} />

        <Group position='apart' >
          {/* <SearchBox
            label={langContent.searchLabel}
            placeholder={langContent.searchPlaceholder}
            searchableList={dataList}
            setSearchableList={setDataList}
          />
          <OrderBySelect orderBy={orderBy} handleChange={handleOrderChange} /> */}
        </Group>

        <SimpleGrid
          cols={4}
          spacing="lg"
          breakpoints={[
            { maxWidth: 980, cols: 3, spacing: 'md' },
            { maxWidth: 755, cols: 2, spacing: 'sm' },
            { maxWidth: 600, cols: 1, spacing: 'sm' },
          ]}
        >
          {
            subjects.map((subject, i) => (
              // searchableCountry.visible && (
                <SubjectCard key={i} subject={subject} />
              // )
            ))
          }
        </SimpleGrid>

      </Stack>

    </LayoutContainer >
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
  const countryList = await getCountries();
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: { subjectTypeInfo: subjectTypeInfo, subjects: subjects, footerContent: footerContent }
  }

}

export default SubjectCategoryPage