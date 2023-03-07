import { Group, SimpleGrid, Stack, useMantineTheme } from '@mantine/core';
import { Country, SubjectType } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import GenericPageHeader from '../../../components/Block/GenericPageHeader';
import SubjectCard from '../../../components/Card/SubjectCard';
import Breadcrumb from '../../../features/Breadcrumb/Breadcrumb';
import { FooterContent } from '../../../features/Footer/Footer';
import ResponsiveWrapper from '../../../components/Container/ResponsiveWrapper';
import prisma from '../../../lib/prisma/prisma';
import { getSubjectsDetailedByCategory } from '../../../lib/prisma/prismaDetailedQueries';
import { getCountries, getSubjectType } from '../../../lib/prisma/prismaQueries';
import { DetailedSubject } from '../../../lib/types/DetailedDatabaseTypes';
import { SubjectCardData } from '../../../lib/types/UiHelperTypes';
import { convertSubjectToCardData } from '../../../lib/util/conversionUtil';
import { getLocalizedName } from '../../../lib/util/util';

interface Props {
  categoryInfo: SubjectType,
  subjectData: SubjectCardData[],
  countryList: Country[],
  footerContent: FooterContent[],
}

const SubjectCategoryPage: NextPage<Props> = ({ categoryInfo, subjectData, countryList, footerContent }: Props) => {

  const { t, lang } = useTranslation('category');
  const courseTypeName = getLocalizedName({ lang: lang, any: categoryInfo });
  const theme = useMantineTheme();

  return (
    <ResponsiveWrapper footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('meta.category-title', { subject: courseTypeName })}</title>
        <meta key={"description"} name="description" content={t('meta.category-description')} />
      </Head>

      <Breadcrumb subjectTypeInfo={categoryInfo} />

      <Stack>

        <GenericPageHeader title={t('category.title', { category: courseTypeName })} description={t('category.subtitle', { category: courseTypeName })} />

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
            { maxWidth: theme.breakpoints.lg, cols: 3, spacing: 'md' },
            { maxWidth: theme.breakpoints.md, cols: 2, spacing: 'sm' },
            { maxWidth: theme.breakpoints.sm, cols: 1, spacing: 'sm' },
          ]}
        >
          {
            subjectData.map((subject, i) => {

              const country = countryList.find(c => c.id === subject.countryId);
              if (!country) return null;

              return (
                <SubjectCard key={i} data={subject} country={country} />
              )
            })
          }
        </SimpleGrid>

      </Stack>

    </ResponsiveWrapper >
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {

  const categories = await prisma.subjectType.findMany();

  let paths: {
    params: ParsedUrlQuery;
    locale?: string | undefined;
  }[] = [];

  // Add locale to every possible path
  locales?.forEach((locale) => {
    categories.forEach((category) => {
      paths.push({
        params: {
          Category: category.url,
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

  const category = "" + context?.params?.Category;
  const lang = context.locale || "en";

  const categoryInfo: SubjectType | null = await getSubjectType(category)

  // Get all courses of this category
  const subjects: DetailedSubject[] = await getSubjectsDetailedByCategory(category);
  const subjectData: SubjectCardData[] = subjects.map(subj => convertSubjectToCardData(subj, lang));

  // Footer Data
  // Get all countries
  const countryList = await getCountries();
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: {
      categoryInfo,
      subjectData,
      countryList,
      footerContent,
    }
  }

}

export default SubjectCategoryPage