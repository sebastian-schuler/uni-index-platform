import { Group, SimpleGrid, Stack } from '@mantine/core';
import { Country, SubjectType } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import GenericPageHeader from '../../../components/elements/GenericPageHeader';
import SubjectCard from '../../../components/elements/itemcards/SubjectCard';
import Breadcrumb from '../../../layout/Breadcrumb';
import { FooterContent } from '../../../layout/footer/Footer';
import LayoutContainer from '../../../layout/LayoutContainer';
import prisma from '../../../lib/prisma/prisma';
import { getSubjectsDetailedByCategory } from '../../../lib/prisma/prismaDetailedQueries';
import { getCountries, getSubjectType } from '../../../lib/prisma/prismaQueries';
import { DetailedSubject } from '../../../lib/types/DetailedDatabaseTypes';
import { SubjectCardData } from '../../../lib/types/UiHelperTypes';
import { convertSubjectToCardData } from '../../../lib/util/conversionUtil';
import { getLocalizedName } from '../../../lib/util/util';

interface Props {
  subjectTypeInfo: SubjectType,
  subjectData: SubjectCardData[],
  countryList: Country[],
  footerContent: FooterContent[],
}

const SubjectCategoryPage: NextPage<Props> = ({ subjectTypeInfo, subjectData, countryList, footerContent }: Props) => {

  const { t, lang } = useTranslation('subject');
  const courseTypeName = getLocalizedName({ lang: lang, any: subjectTypeInfo });

  return (
    <LayoutContainer footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('subject-title', { subject: courseTypeName })}</title>
        <meta key={"description"} name="description" content={t('subject-description')} />
      </Head>

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
            subjectData.map((subject, i) => (
              // searchableCountry.visible && (
              <SubjectCard key={i} data={subject} country={countryList.find(c => c.id === subject.countryId)} />
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

  const subjectCategory = "" + context?.params?.SubjectCategory;
  const lang = context.locale || "en";

  const subjectTypeInfo: SubjectType | null = await getSubjectType(subjectCategory)

  // Get all courses of this category
  const subjects: DetailedSubject[] = await getSubjectsDetailedByCategory(subjectCategory);
  const subjectData: SubjectCardData[] = subjects.map(subj => convertSubjectToCardData(subj, lang));

  // Footer Data
  // Get all countries
  const countryList = await getCountries();
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: {
      subjectTypeInfo,
      subjectData,
      countryList,
      footerContent,
    }
  }

}

export default SubjectCategoryPage