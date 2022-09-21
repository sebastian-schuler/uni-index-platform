import { Grid, Stack } from '@mantine/core';
import type { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import PremiumList from '../components/container/AdList';
import HeroSection from '../components/elements/index/HeroSection';
import CountryCard from '../components/elements/itemcards/CountryCard';
import InstitutionCard from '../components/elements/itemcards/InstitutionCard';
import SubjectCard from '../components/elements/itemcards/SubjectCard';
import { FooterContent } from '../components/layout/footer/Footer';
import PopularSection from '../components/layout/index/PopularSection';
import LayoutContainer from '../components/layout/LayoutContainer';
import Meta from '../components/partials/Meta';
import { AD_PAGE_INDEX } from '../lib/appConstants';
import { getPopularDetailedCountries } from '../lib/prisma/prismaDetailedQueries';
import { getAds, getCountries, getInstitutionsByPopularity, getSubjectsByPopularity } from '../lib/prisma/prismaQueries';
import { DetailedCountry, DetailedInstitution, DetailedUserAd, DetailedSubject } from '../lib/types/DetailedDatabaseTypes';
import { URL_INSTITUTIONS, URL_LOCATIONS, URL_SUBJECTS } from '../lib/url-helper/urlConstants';
import { toLink } from '../lib/util';

interface Props {
  adsStringified: string,
  popularSubjects: DetailedSubject[],
  popularInstitutes: DetailedInstitution[],
  popularCountries: DetailedCountry[],
  footerContent: FooterContent[],
}

const Home: NextPage<Props> = ({ adsStringified, popularSubjects, popularCountries, popularInstitutes, footerContent }: Props) => {

  const ads: DetailedUserAd[] = JSON.parse(adsStringified);
  const { t } = useTranslation('common');
  const langContent = {
    pageTitle: t('page-title'),
    title: t('nav-home'),

    titlePopularCourses: t('title-popular-courses'),
    titlePopularInstitutions: t('title-popular-institutions'),
    titlePopularLocations: t('title-popular-locations'),

    linkCourses: t('link-all-courses'),
    linkInstitutions: t('link-all-institutions'),
    linkLocations: t('link-all-locations'),
  }

  return (

    <LayoutContainer removeVerticalPadding removeContainerWrapper footerContent={footerContent}>

      <Meta
        title={langContent.pageTitle + " - " + langContent.title}
        description='Very nice page'
      />

      <HeroSection />

      <Stack spacing={0} mb={"xl"}>

        <PopularSection
          title={langContent.titlePopularCourses}
          subtext="The most popular courses on our platform"
          buttonText={langContent.linkCourses}
          buttonUrl={toLink(URL_SUBJECTS)}
        >
          {
            popularSubjects.map((subject, i) => (
              <Grid.Col key={i} sm={12} md={6} lg={4} sx={{ width: "100%" }}>
                <SubjectCard subject={subject} />
              </Grid.Col>
            ))
          }
        </PopularSection>

        <PopularSection
          title={langContent.titlePopularInstitutions}
          subtext="Universities with the most popular courses"
          buttonText={langContent.linkInstitutions}
          buttonUrl={toLink(URL_INSTITUTIONS)}
          brandColor
        >
          {
            popularInstitutes.map((institute, i) => (
              institute.InstitutionLocation.length !== 0 && (
                <Grid.Col key={i} sm={12} md={6} lg={4} sx={{ width: "100%" }}>
                  <InstitutionCard institution={institute} />
                </Grid.Col>
              )
            ))
          }
        </PopularSection>

        <PopularSection
          title={langContent.titlePopularLocations}
          subtext="Popular countries for studying"
          buttonText={langContent.linkLocations}
          buttonUrl={toLink(URL_LOCATIONS)}
        >
          {
            popularCountries.map((country, i) => (
              <Grid.Col key={i} sm={12} md={6} lg={4} sx={{ width: "100%" }}>
                <CountryCard country={country} linkType={"location"} />
              </Grid.Col>
            ))
          }
        </PopularSection>

        <PremiumList premiumAds={ads} wrapInContainer />

      </Stack>

    </LayoutContainer>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {

  // Popular ...
  const popularSubjectsDetailed: DetailedSubject[] = await getSubjectsByPopularity(6);
  const popularInstitutesDetailed: DetailedInstitution[] = await getInstitutionsByPopularity(6);
  const popularCountriesDetailed: DetailedCountry[] = await getPopularDetailedCountries();

  // TODO - in detailed institution we get all subjects and all types, but we connect subjects twice I think? check!

  // Ads
  const ads: DetailedUserAd[] = await getAds(AD_PAGE_INDEX);
  const allAds = JSON.stringify(ads);

  // Footer Data
  const countryList = await getCountries("asc");

  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: {
      adsStringified: allAds,
      popularSubjects: popularSubjectsDetailed,
      popularInstitutes: popularInstitutesDetailed,
      popularCountries: popularCountriesDetailed,
      footerContent: footerContent,
    }
  }

}

export default Home;
