import { Grid, Stack } from '@mantine/core';
import { Country, State } from '@prisma/client';
import type { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import PremiumList from '../components/container/AdList';
import HeroSection from '../layout/index/HeroSection';
import SearchSection from '../layout/index/SearchSection';
import SocialMediaSection from '../layout/index/SocialMediaSection';
import CountryCard from '../components/elements/itemcards/CountryCard';
import InstitutionCard from '../components/elements/itemcards/InstitutionCard';
import SubjectCard from '../components/elements/itemcards/SubjectCard';
import { FooterContent } from '../layout/footer/Footer';
import PopularSection from '../layout/index/PopularSection';
import LayoutContainer from '../layout/LayoutContainer';
import Meta from '../components/partials/Meta';
import { AD_PAGE_INDEX } from '../lib/appConstants';
import { getPopularDetailedCountries } from '../lib/prisma/prismaDetailedQueries';
import { getInstitutionsByPopularity, getSubjectsByPopularity } from '../lib/prisma/prismaPopularQueries';
import { getAds, getCountries } from '../lib/prisma/prismaQueries';
import { getAllSocialMedia, getSocialMediaRanking } from '../lib/prisma/prismaSocialMedia';
import { CountryCardData, DetailedCountry, DetailedInstitution, DetailedSubject, DetailedUserAd, InstitutionCardData, SubjectCardData } from '../lib/types/DetailedDatabaseTypes';
import { SmBestCardMinified, SmRankingEntryMinified, TotalScore } from '../lib/types/SocialMediaTypes';
import { URL_INSTITUTIONS, URL_LOCATIONS, URL_SUBJECTS } from '../lib/url-helper/urlConstants';
import { convertCountryToCardData, convertInstitutionToCardData, convertSubjectToCardData, minifySmBestCard, minifySmRankingItem } from '../lib/util/conversionUtil';
import { getUniquesFromArray, toLink } from '../lib/util/util';
import OnlineMarketingSection from '../layout/index/OnlineMarketingSection';
import { getAllLhrSimplified } from '../lib/lighthouse/lhrSimplifier';
import { LhrSimple } from '../lib/types/lighthouse/CustomLhrTypes';

interface Props {
  simpleLhReports: LhrSimple[],
  adsStringified: string,
  institutionData: InstitutionCardData[],
  subjectData: SubjectCardData[],
  countryData: CountryCardData[],
  countryList: Country[],
  institutionStates: State[],
  socialMediaList: SmRankingEntryMinified[],
  highestTwitter: SmBestCardMinified,
  highestYoutube: SmBestCardMinified,
  footerContent: FooterContent[],
}

const Home: NextPage<Props> = ({ simpleLhReports, adsStringified, institutionData, subjectData, countryData, countryList,
  institutionStates, socialMediaList, highestTwitter, highestYoutube, footerContent }: Props) => {

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
        highestTwitter={highestTwitter}
        highestYoutube={highestYoutube}
        countries={countryList}
      />

      <OnlineMarketingSection simpleLhReports={simpleLhReports} />

      <SearchSection />

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
                <InstitutionCard
                  data={institute}
                  country={countryList.find(c => c.id === institute.mainCountryId)}
                  state={institutionStates.find(s => s.id === institute.mainStateId)}
                />
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
  const subjectsDetailed: DetailedSubject[] = await getSubjectsByPopularity(6);
  const institutionsDetailed: DetailedInstitution[] = await getInstitutionsByPopularity(6);
  const countriesDetailed: DetailedCountry[] = await getPopularDetailedCountries();

  // Convert to CardData to lower size
  const institutionData: InstitutionCardData[] = institutionsDetailed.map(inst => convertInstitutionToCardData(inst, lang));
  const subjectData: SubjectCardData[] = subjectsDetailed.map(subj => convertSubjectToCardData(subj, lang));
  const countryData: CountryCardData[] = countriesDetailed.map(country => convertCountryToCardData(country, lang, "location"));

  // List of states for popular institutes
  const institutionStates = getUniquesFromArray({ type: "State", data: institutionsDetailed.map(inst => inst.City.State) }) as State[];

  // === SOCIAL MEDIA ===
  const socialMediaRankingList = await getSocialMediaRanking();
  const socialMediaList = await getAllSocialMedia();

  // Sort by total score, get top 5
  let socialMediaTopList: SmRankingEntryMinified[] = socialMediaRankingList.map((item) => minifySmRankingItem(item));
  socialMediaTopList = socialMediaTopList.sort((a, b) => {
    return b.combinedScore - a.combinedScore;
  }).slice(0, 10);

  // Highest Youtube score
  socialMediaList.sort((a, b) => {
    const totalScoreA = JSON.parse(a.total_score) as TotalScore;
    const totalScoreB = JSON.parse(b.total_score) as TotalScore;
    return totalScoreB.percent.youtube.total - totalScoreA.percent.youtube.total;
  });
  const highestYoutube = minifySmBestCard(socialMediaList[0], "youtube", lang);

  // Highest Twitter score
  socialMediaList.sort((a, b) => {
    const totalScoreA = JSON.parse(a.total_score) as TotalScore;
    const totalScoreB = JSON.parse(b.total_score) as TotalScore;
    return totalScoreB.percent.twitter.total - totalScoreA.percent.twitter.total;
  });
  const highestTwitter = minifySmBestCard(socialMediaList[0], "twitter", lang);

  // === ONLINE MARKETING ===
  const simpleLhReports = await getAllLhrSimplified(4);

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
      simpleLhReports,
      adsStringified,
      institutionData,
      subjectData,
      countryList,
      institutionStates,
      socialMediaList: socialMediaTopList,
      highestTwitter,
      highestYoutube,
      countryData,
      footerContent,
    }
  }

}

export default Home;
