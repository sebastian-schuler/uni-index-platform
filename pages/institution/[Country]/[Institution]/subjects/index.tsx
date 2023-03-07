import { Group, SimpleGrid } from '@mantine/core';
import { Country, Institution } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import SubjectCard from '../../../../../components/Card/SubjectCard';
import WhitePaper from '../../../../../components/Paper/WhitePaper';
import Breadcrumb from '../../../../../features/Breadcrumb/Breadcrumb';
import { FooterContent } from '../../../../../features/Footer/Footer';
import ResponsiveWrapper from '../../../../../components/Container/ResponsiveWrapper';
import InstitutionNav from '../../../../../features/Navigation/InstitutionNav';
import { getDetailedSubjectsByInstitution } from '../../../../../lib/prisma/prismaDetailedQueries';
import { getCountries, getCountry, getInstitution } from '../../../../../lib/prisma/prismaQueries';
import { DetailedSubject } from '../../../../../lib/types/DetailedDatabaseTypes';
import { getStaticPathsInstitution } from '../../../../../lib/url-helper/staticPathFunctions';
import { convertSubjectToCardData } from '../../../../../lib/util/conversionUtil';
import { SubjectCardData } from '../../../../../lib/types/UiHelperTypes';
import React from 'react';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  institution: Institution,
  country: Country,
  footerContent: FooterContent[],
  subjectData: SubjectCardData[]
  countryList: Country[]
}

const SubjectsPage = ({ institution, country, footerContent, subjectData, countryList }: Props) => {

  const { t, lang } = useTranslation('institution');

  return (
    <ResponsiveWrapper footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('meta.subjects-title', { institution: institution?.name })}</title>
        <meta key={"description"} name="description" content={t('meta.subjects-description')} />
      </Head>

      <Breadcrumb countryInfo={country} institutionInfo={institution} />

      <InstitutionNav title={institution.name} />

      <WhitePaper>
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
          cols={3}
          spacing="lg"
          breakpoints={[
            { maxWidth: 980, cols: 3, spacing: 'md' },
            { maxWidth: 755, cols: 2, spacing: 'sm' },
            { maxWidth: 600, cols: 1, spacing: 'sm' },
          ]}
        >

          {
            subjectData.map((subject, i) => {

              const country = countryList.find(c => c.id === subject.countryId);
              if (!country) return <React.Fragment key={subject.id} />;

              return (
                <SubjectCard
                  key={i}
                  data={subject}
                  country={country}
                />
              )
            })
          }

        </SimpleGrid>

      </WhitePaper>

    </ResponsiveWrapper >
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {

  const lang = context.locale || "en";
  let countryUrl = "" + context?.params?.Country;
  let institutionUrl = "" + context?.params?.Institution;

  const country = await getCountry(countryUrl);
  const institution = await getInstitution({ institutionUrl });

  const detailedSubjects: DetailedSubject[] = institution ? (await getDetailedSubjectsByInstitution(institution.id)) : [];
  const subjectData: SubjectCardData[] = detailedSubjects.map(subj => convertSubjectToCardData(subj, lang));
  const countryList = await getCountries();

  // Footer Data
  // Get all countries
  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: {
      institution,
      subjectData,
      country,
      countryList,
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

export default SubjectsPage;