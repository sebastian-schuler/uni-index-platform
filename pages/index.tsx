import { Grid, Stack } from '@mantine/core';
import { Country, State } from '@prisma/client';
import type { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import PremiumList from '../features/Ads/AdList';
import HeroSection from '../features/Index/HeroSection';
import SearchSection from '../features/Index/SearchSection';
import SocialMediaSection from '../features/Index/SocialMediaSection';
import CountryCard from '../components/Card/CountryCard';
import InstitutionCard from '../components/Card/InstitutionCard';
import SubjectCard from '../components/Card/SubjectCard';
import { FooterContent } from '../features/Footer/Footer';
import PopularSection from '../features/Index/PopularSection';
import ResponsiveWrapper from '../components/Container/ResponsiveWrapper';
import { AD_PAGE_INDEX } from '../lib/appConstants';
import { getPopularDetailedCountries } from '../lib/prisma/prismaDetailedQueries';
import { getInstitutionsByPopularity, getSubjectsByPopularity } from '../lib/prisma/prismaPopularQueries';
import { getAds, getCountries } from '../lib/prisma/prismaQueries';
import { getAllSocialMedia, getSocialMediaRanking } from '../lib/prisma/prismaSocialMedia';
import { DetailedCountry, DetailedInstitution, DetailedSubject, DetailedUserAd } from '../lib/types/DetailedDatabaseTypes';
import { SmBestCardMinified, SmRankingEntryMinified, TotalScore } from '../lib/types/SocialMediaTypes';
import { URL_INSTITUTIONS, URL_LOCATIONS, URL_CATEGORIES } from '../lib/url-helper/urlConstants';
import { convertCountryToCardData, convertInstitutionToCardData, convertSubjectToCardData, minifySmBestCard, minifySmRankingItem } from '../lib/util/conversionUtil';
import { getUniquesFromArray, toLink } from '../lib/util/util';
import OnlineMarketingSection from '../features/Index/OnlineMarketingSection';
import { getAllLhrSimplified } from '../lib/lighthouse/lhrSimplifier';
import { LhrSimple } from '../lib/types/lighthouse/CustomLhrTypes';
import { CountryCardData, InstitutionCardData, SubjectCardData } from '../lib/types/UiHelperTypes';
import Head from 'next/head';
import React from 'react';

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

  const { t } = useTranslation('index');

  return (
    <ResponsiveWrapper removeVerticalPadding removeContainerWrapper footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('meta.title')}</title>
        <meta key={"description"} name="description" content={t('meta.description')} />
      </Head>

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
          title={t('popular.title-courses')}
          desc={t('popular.desc-courses')}
          buttonText={t('popular.label-all-courses')}
          buttonUrl={toLink(URL_CATEGORIES)}
          brandColor
        >
          {
            subjectData.map((subject, i) => {

              const country = countryList.find(c => c.id === subject.countryId);
              if (!country) return <React.Fragment key={subject.id} />;

              return (
                <Grid.Col key={subject.id} sm={12} md={6} lg={4} sx={{ width: "100%" }}>
                  <SubjectCard data={subject} country={country} />
                </Grid.Col>
              )
            })
          }
        </PopularSection>

        <PopularSection
          title={t('popular.title-institutions')}
          desc={t('popular.desc-institutions')}
          buttonText={t('popular.label-all-institutions')}
          buttonUrl={toLink(URL_INSTITUTIONS)}
        >
          {
            institutionData.map((institute, i) => (
              <Grid.Col key={i} sm={12} md={6} lg={4} sx={{ width: "100%" }}>
                <InstitutionCard
                  data={institute}
                  country={countryList.find(c => c.id === institute.mainCountryId)}
                  state={institutionStates.find(s => s.id === institute.mainStateId)}
                />
              </Grid.Col>
            ))
          }
        </PopularSection>

        <PopularSection
          title={t('popular.title-locations')}
          desc={t('popular.desc-locations')}
          buttonText={t('popular.label-all-locations')}
          buttonUrl={toLink(URL_LOCATIONS)}
          brandColor
        >
          {
            countryData.map((country, i) => (
              <Grid.Col key={i} sm={12} md={6} lg={4} sx={{ width: "100%" }}>
                <CountryCard country={country} />
              </Grid.Col>
            ))
          }
        </PopularSection>

        <PremiumList
          premiumAds={ads}
          wrapInContainer
        />

      </Stack>

    </ResponsiveWrapper>
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
  }).slice(0, 13);

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
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }

}

export default Home;
