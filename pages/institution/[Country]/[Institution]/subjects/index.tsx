import { Group, SimpleGrid } from '@mantine/core';
import { Country, Institution } from '@prisma/client';
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next';
import SubjectCard from '../../../../../components/elements/itemcards/SubjectCard';
import WhitePaper from '../../../../../components/WhitePaper';
import Breadcrumb from '../../../../../components/layout/Breadcrumb';
import { FooterContent } from '../../../../../components/layout/footer/Footer';
import LayoutContainer from '../../../../../components/layout/LayoutContainer';
import InstitutionNav from '../../../../../components/layout/subnav/InstitutionNav';
import Meta from '../../../../../components/partials/Meta';
import { getDetailedSubjectsByInstitution } from '../../../../../lib/prisma/prismaDetailedQueries';
import { getCountries, getCountry, getInstitution } from '../../../../../lib/prisma/prismaQueries';
import { DetailedSubject, SubjectCardData } from '../../../../../lib/types/DetailedDatabaseTypes';
import { getStaticPathsInstitution } from '../../../../../lib/url-helper/staticPathFunctions';
import { convertSubjectToCardData } from '../../../../../lib/util/conversionUtil';

interface Props {
  institution: Institution,
  country: Country,
  footerContent: FooterContent[],
  subjectData: SubjectCardData[]
  countryList: Country[]
}

const subjects: NextPage<Props> = ({ institution, country, footerContent, subjectData, countryList }: Props) => {

  return (
    <LayoutContainer footerContent={footerContent}>

      <Meta
        title={'Uni Index - '}
        description='Very nice page'
      />

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
            subjectData.map((subject, i) => (
              // searchable.visible && (
              <SubjectCard
                key={i}
                data={subject}
                country={countryList.find(c => c.id === subject.countryId)}
              />
              // )
            ))
          }

        </SimpleGrid>

      </WhitePaper>

    </LayoutContainer >
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {

  const lang = context.locale || "en";
  let countryUrl = "" + context?.params?.Country;
  let institutionUrl = "" + context?.params?.Institution;

  const country = await getCountry(countryUrl);
  const institution = await getInstitution(institutionUrl);

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

export default subjects;