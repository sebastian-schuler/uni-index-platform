import { Grid, Stack } from '@mantine/core';
import { country, state } from '@prisma/client';
import type { GetStaticProps, NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import React from 'react';
import CountryCard from '../components/Card/CountryCard';
import InstitutionCard from '../components/Card/InstitutionCard';
import SubjectCard from '../components/Card/SubjectCard';
import ResponsiveWrapper from '../components/Container/ResponsiveWrapper';
import AdContainer from '../features/Ads/AdContainer';
import { FooterContent } from '../features/Footer/Footer';
import HeroSection from '../features/Index/HeroSection';
import OnlineMarketingSection from '../features/Index/OnlineMarketingSection';
import PopularSection from '../features/Index/PopularSection';
import SearchSection from '../features/Index/SearchSection';
import SocialMediaSection from '../features/Index/SocialMediaSection';
import { getAdCardArray } from '../lib/ads/adConverter';
import { AD_PAGE_INDEX } from '../lib/appConstants';
import { getAllLhrSimplified } from '../lib/lighthouse/lhrSimplifier';
import { getPopularDetailedCountries } from '../lib/prisma/prismaDetailedQueries';
import { getInstitutionsByPopularity, getSubjectsByPopularity } from '../lib/prisma/prismaPopularQueries';
import { getCountries } from '../lib/prisma/prismaQueries';
import { getBestSocialMedia, getSocialMediaRanking } from '../lib/prisma/prismaSocialMedia';
import { DetailedCountry, DetailedInstitution, DetailedSubject } from '../lib/types/DetailedDatabaseTypes';
import { AdCardData, CountryCardData, InstitutionCardData, SubjectCardData } from '../lib/types/UiHelperTypes';
import { LhrSimple } from '../lib/types/lighthouse/CustomLhrTypes';
import { BestSocialMediaItem, SocialMediaGenericRankingItem } from '../lib/types/social-media/SocialMediaSimplifiedTypes';
import { URL_CATEGORIES, URL_INSTITUTIONS, URL_LOCATIONS } from '../lib/url-helper/urlConstants';
import { convertCountryToCardData, convertInstitutionToCardData, convertSubjectToCardData } from '../lib/util/conversionUtil';
import { getUniquesFromArray, toLink } from '../lib/util/util';

interface Props {
  simpleLhReports: LhrSimple[],
  ads: AdCardData[][],
  institutionData: InstitutionCardData[],
  subjectData: SubjectCardData[],
  countryData: CountryCardData[],
  countryList: country[],
  institutionStates: state[],
  socialMediaList: SocialMediaGenericRankingItem[],
  bestTwitter: BestSocialMediaItem | null,
  bestYoutube: BestSocialMediaItem | null,
  footerContent: FooterContent[],
}

const Home: NextPage<Props> = ({ simpleLhReports, ads, institutionData, subjectData, countryData, countryList,
  institutionStates, socialMediaList, bestTwitter, bestYoutube, footerContent }: Props) => {

  const { t } = useTranslation('index');

  return (
    <ResponsiveWrapper removeVerticalPadding removeContainerWrapper footerContent={footerContent}>

      <Head>
        <title key={"title"}>{t('common:page-title') + ' | ' + t('meta.title')}</title>
        <meta key={"description"} name="description" content={t('meta.description') as string} />
      </Head>

      <HeroSection />

      <SocialMediaSection
        socialMediaList={socialMediaList}
        bestTwitter={bestTwitter}
        bestYoutube={bestYoutube}
        countries={countryList}
      />

      <OnlineMarketingSection simpleLhReports={simpleLhReports} />

      <SearchSection />

      <Stack spacing={0} mb={"xl"}>

        <PopularSection
          title={t('popular.title-courses')}
          desc={t('popular.desc-courses') as string}
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
          desc={t('popular.desc-institutions') as string}
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
          desc={t('popular.desc-locations') as string}
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

        <AdContainer
          ads={ads}
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
  const institutionStates = getUniquesFromArray({ type: "State", data: institutionsDetailed.map(inst => inst.city.state) }) as state[];

  // === SOCIAL MEDIA ===
  let socialMediaRankingList = await getSocialMediaRanking({ take: 10 });

  // Best social media
  const bestYoutube = await getBestSocialMedia({ type: "youtube", lang });
  const bestTwitter = await getBestSocialMedia({ type: "twitter", lang });

  // === ONLINE MARKETING ===
  const simpleLhReports = await getAllLhrSimplified(4);

  // Ads
  const ads = await getAdCardArray(AD_PAGE_INDEX, lang);

  // Footer Data
  const countryList = await getCountries();

  const footerContent: FooterContent[] = [
    { title: "Countries", data: countryList, type: "Country" },
  ]

  const props:Props = {
    simpleLhReports,
    ads,
    institutionData,
    subjectData,
    countryList,
    institutionStates,
    socialMediaList: socialMediaRankingList,
    bestYoutube,
    bestTwitter,
    countryData,
    footerContent,
  }

  return {
    props,
    revalidate: 60 * 60 * 24, // 24 hours
  }

}

export default Home;
