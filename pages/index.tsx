import { Grid, Stack } from '@mantine/core';
import { Country } from '@prisma/client';
import type { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import PremiumList from '../components/container/AdList';
import HeroSection from '../components/elements/index/HeroSection';
import SocialMediaSection from '../components/elements/index/SocialMediaSection';
import CountryCard from '../components/elements/itemcards/CountryCard';
import InstitutionCard from '../components/elements/itemcards/InstitutionCard';
import SubjectCard from '../components/elements/itemcards/SubjectCard';
import { FooterContent } from '../components/layout/footer/Footer';
import PopularSection from '../components/layout/index/PopularSection';
import LayoutContainer from '../components/layout/LayoutContainer';
import Meta from '../components/partials/Meta';
import { AD_PAGE_INDEX } from '../lib/appConstants';
import { getPopularDetailedCountries } from '../lib/prisma/prismaDetailedQueries';
import { getInstitutionsByPopularity, getSubjectsByPopularity } from '../lib/prisma/prismaPopularQueries';
import { getAds, getCountries } from '../lib/prisma/prismaQueries';
import { getAllSocialMedia, getSocialMediaRanking } from '../lib/prisma/prismaSocialMedia';
import { CountryCardData, DetailedCountry, DetailedInstitution, DetailedSubject, DetailedUserAd, InstitutionCardData, SubjectCardData } from '../lib/types/DetailedDatabaseTypes';
import { SmRankingEntry, SmRankingEntryMinified, TotalScore, TotalScoreSet } from '../lib/types/SocialMediaTypes';
import { URL_INSTITUTIONS, URL_LOCATIONS, URL_SUBJECTS } from '../lib/url-helper/urlConstants';
import { convertCountryToCardData, convertInstitutionToCardData, convertSubjectToCardData, minifySmRankingItem } from '../lib/util/conversionUtil';
import { toLink } from '../lib/util/util';

interface Props {
  adsStringified: string,
  institutionData: InstitutionCardData[],
  subjectData: SubjectCardData[],
  countryData: CountryCardData[],
  countryList: Country[],
  socialMediaList: SmRankingEntryMinified[],
  highestTwitterStringified: string,
  highestYoutubeStringified: string,
  footerContent: FooterContent[],
}

const Home: NextPage<Props> = ({ adsStringified, institutionData, subjectData, countryData, countryList, socialMediaList, highestTwitterStringified, highestYoutubeStringified, footerContent }: Props) => {

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

      <SocialMediaSection
        socialMediaList={socialMediaList}
        highestTwitterStringified={highestTwitterStringified}
        highestYoutubeStringified={highestYoutubeStringified}
        countries={countryList}
      />

      <Stack spacing={0} mb={"xl"}>

        <PopularSection
          title={langContent.titlePopularCourses}
          subtext="The most popular courses on our platform"
          buttonText={langContent.linkCourses}
          buttonUrl={toLink(URL_SUBJECTS)}
          brandColor
        >
          {
            subjectData.map((subject, i) => (
              <Grid.Col key={i} sm={12} md={6} lg={4} sx={{ width: "100%" }}>
                <SubjectCard data={subject} country={countryList.find(c => c.id === subject.countryId)} />
              </Grid.Col>
            ))
          }
        </PopularSection>

        <PopularSection
          title={langContent.titlePopularInstitutions}
          subtext="Universities with the most popular courses"
          buttonText={langContent.linkInstitutions}
          buttonUrl={toLink(URL_INSTITUTIONS)}
        >
          {
            institutionData.map((institute, i) => (
              // institute.InstitutionLocation.length !== 0 && (
              <Grid.Col key={i} sm={12} md={6} lg={4} sx={{ width: "100%" }}>
                <InstitutionCard data={institute} country={countryList.find(c => c.id === institute.mainCountryId)} />
              </Grid.Col>
              // )
            ))
          }
        </PopularSection>

        <PopularSection
          title={langContent.titlePopularLocations}
          subtext="Popular countries for studying"
          buttonText={langContent.linkLocations}
          buttonUrl={toLink(URL_LOCATIONS)}
          brandColor
        >
          {
            countryData.map((country, i) => (
              <Grid.Col key={i} sm={12} md={6} lg={4} sx={{ width: "100%" }}>
                <CountryCard data={country} />
              </Grid.Col>
            ))
          }
        </PopularSection>

        <PremiumList
          premiumAds={ads}
          wrapInContainer
        />

      </Stack>

    </LayoutContainer>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {

  const lang = context.locale || "en";

  // Popular ...
  const popularSubjectsDetailed: DetailedSubject[] = await getSubjectsByPopularity(6);
  const popularInstitutesDetailed: DetailedInstitution[] = await getInstitutionsByPopularity(6);
  const popularCountriesDetailed: DetailedCountry[] = await getPopularDetailedCountries();

  // Convert to CardData to lower size
  const institutionData: InstitutionCardData[] = popularInstitutesDetailed.map(inst => convertInstitutionToCardData(inst, lang));
  const subjectData: SubjectCardData[] = popularSubjectsDetailed.map(subj => convertSubjectToCardData(subj, lang));
  const countryData: CountryCardData[] = popularCountriesDetailed.map(country => convertCountryToCardData(country, lang, "location"));

  // === SOCIAL MEDIA ===
  const socialMediaRankingList = await getSocialMediaRanking();
  const socialMediaList = await getAllSocialMedia();

  // Sort by total score, get top 5
  let socialMediaTopList: SmRankingEntryMinified[] = socialMediaRankingList.map((item) => minifySmRankingItem(item));
  socialMediaTopList = socialMediaTopList.sort((a, b) => {
    return b.total_score - a.total_score;
  }).slice(0, 5);

  // Highest Twitter score
  socialMediaList.sort((a, b) => {
    const aScore = a.youtube_scores ? (JSON.parse(a.youtube_scores) as TotalScoreSet).total : 0;
    const bScore = b.youtube_scores ? (JSON.parse(b.youtube_scores) as TotalScoreSet).total : 0;
    return bScore - aScore;
  });
  const highestYoutubeStringified = JSON.stringify(socialMediaList[0]);

  // Highest Twitter score
  socialMediaList.sort((a, b) => {
    const aScore = a.twitter_scores ? (JSON.parse(a.twitter_scores) as TotalScoreSet).total : 0;
    const bScore = b.twitter_scores ? (JSON.parse(b.twitter_scores) as TotalScoreSet).total : 0;
    return bScore - aScore;
  });
  const highestTwitterStringified = JSON.stringify(socialMediaList[0]);

  // === ADS ===
  const ads: DetailedUserAd[] = await getAds(AD_PAGE_INDEX);
  const adsStringified = JSON.stringify(ads);

  // Footer Data
  const countryList = await getCountries();

  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  return {
    props: {
      adsStringified,
      institutionData,
      subjectData,
      countryList,
      socialMediaList: socialMediaTopList,
      highestTwitterStringified,
      highestYoutubeStringified,
      countryData,
      footerContent,
    }
  }

}

export default Home;
