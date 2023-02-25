
import { ActionIcon, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { Country, Institution, InstitutionSocialMedia } from '@prisma/client'
import { IconBrandTwitter, IconBrandYoutube } from '@tabler/icons-react'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import SocialMediaCard from '../../../../../components/elements/itemcards/SocialMediaCard'
import WhitePaper from '../../../../../components/WhitePaper'
import Breadcrumb from '../../../../../layout/Breadcrumb'
import { FooterContent } from '../../../../../layout/footer/Footer'
import LayoutContainer from '../../../../../layout/LayoutContainer'
import SmOverviewSection from '../../../../../layout/socialmedia/SmOverviewSection'
import InstitutionNav from '../../../../../layout/subnav/InstitutionNav'
import { getCountries, getCountry, getInstitution } from '../../../../../lib/prisma/prismaQueries'
import { getCountrySocialmedia, getSocialMedia } from '../../../../../lib/prisma/prismaSocialMedia'
import { TotalScore, TotalScoreSet } from '../../../../../lib/types/SocialMediaTypes'
import { getStaticPathsInstitution } from '../../../../../lib/url-helper/staticPathFunctions'
import { toLink } from '../../../../../lib/util/util'

export interface SocialMediaLinkProps {
    twitter: string | null
    youtube: string | null
    instagram: string | null
    facebook: string | null
}

interface Props {
    institution: Institution,
    country: Country,
    institutionScore: TotalScore | null
    countryScore: TotalScoreSet | null
    countryTwitterScore: TotalScoreSet | null
    countryYoutubeScore: TotalScoreSet | null
    socialMediaLinks: SocialMediaLinkProps
    footerContent: FooterContent[],
}

const InstitutionSocialMediaPage: NextPage<Props> = ({ institution, country, institutionScore, countryScore, countryTwitterScore, countryYoutubeScore, socialMediaLinks, footerContent }: Props) => {

    const { t, lang } = useTranslation('institution');
    const router = useRouter();

    if (!institutionScore || !countryScore || !countryTwitterScore || !countryYoutubeScore) {
        return (
            <LayoutContainer footerContent={footerContent}>

                <Head>
                    <title key={"title"}>{t('common:page-title') + " | " + t('social-media-title-nodata', { institution: institution.name })}</title>
                    <meta key={"description"} name="description" content={t('social-media-description', { institution: institution.name })} />
                </Head>

                <Breadcrumb countryInfo={country} institutionInfo={institution} />
                <InstitutionNav title={institution.name} />
                <WhitePaper>
                    <Text>No data</Text>
                </WhitePaper>
            </LayoutContainer>
        )
    }

    const socialMediaPages: JSX.Element[] = [];

    if (socialMediaLinks.twitter) {
        socialMediaPages.push(
            <SocialMediaCard
                key={'twitter'}
                title='Twitter'
                url={toLink(router.asPath, "twitter")}
                icon={<IconBrandTwitter size={24} color={"white"} />}
                color={"#1DA1F2"}
                textColor={"white"}
                lastUpdate={"00/00/0000"}
            />
        );
    }

    if (socialMediaLinks.youtube) {
        socialMediaPages.push(
            <SocialMediaCard
                key={'youtube'}
                title='Youtube'
                url={toLink(router.asPath, "youtube")}
                icon={<IconBrandYoutube size={24} color={"white"} />}
                color={"#FF0000"}
                textColor={"white"}
                lastUpdate={"00/00/0000"} // TODO get last update
            />
        );
    }

    return (
        <LayoutContainer footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('social-media-title', { institution: institution.name })}</title>
                <meta key={"description"} name="description" content={t('social-media-description', { institution: institution.name })} />
            </Head>

            <Breadcrumb countryInfo={country} institutionInfo={institution} />

            <InstitutionNav title={institution.name} />

            <WhitePaper>
                <Stack spacing={"lg"}>

                    {/* Header Section */}
                    <Stack>
                        <div>
                            <Title order={2}>Social Media Statistics</Title>
                            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
                        </div>
                        <SimpleGrid
                            breakpoints={[
                                { minWidth: 'md', cols: 4, spacing: 'md' },
                                { minWidth: 'sm', cols: 1, spacing: 'sm' },
                            ]}
                            spacing={"xl"}
                        >
                            {socialMediaPages}
                        </SimpleGrid>
                    </Stack>

                    <SmOverviewSection
                        socialMediaLinks={socialMediaLinks}
                        country={country}
                        institution={institution}
                        institutionScore={institutionScore}
                        countryPercentScore={countryScore}
                        countryTwitterScore={countryTwitterScore}
                        countryYoutubeScore={countryYoutubeScore}
                    />

                </Stack>
            </WhitePaper>

        </LayoutContainer>
    )
}

export async function getStaticProps(context: GetStaticPropsContext) {

    let countryUrl = "" + context?.params?.Country;
    let institutionUrl = "" + context?.params?.Institution;

    const country = await getCountry(countryUrl);
    const institution = await getInstitution({ institutionUrl });
    const socialMedia = institution ? (await getSocialMedia(institution.id)) : null;
    const countrySocialMedia = country ? (await getCountrySocialmedia(country.id)) : null;

    // Institution data
    const institutionScore = socialMedia ? JSON.parse(socialMedia.total_score) as TotalScore : null;

    // Country data
    const countryScore = countrySocialMedia ? JSON.parse(countrySocialMedia.avg_total_score) as TotalScoreSet : null;
    const countryTwitterScore = countrySocialMedia ? JSON.parse(countrySocialMedia.avg_twitter_score) as TotalScoreSet : null;
    const countryYoutubeScore = countrySocialMedia ? JSON.parse(countrySocialMedia.avg_youtube_score) as TotalScoreSet : null;

    // Social Media Links
    const socialMediaLinks: SocialMediaLinkProps = {
        twitter: socialMedia?.twitter_url || null,
        youtube: socialMedia?.youtube_url || null,
        instagram: socialMedia?.instagram_url || null,
        facebook: socialMedia?.facebook_url || null,
    }

    // Footer Data
    // Get all countries
    const countryList = await getCountries();
    const footerContent: FooterContent[] = [
        { title: "Countries", data: countryList, type: "Country" },
    ]

    return {
        props: {
            institution,
            country,
            institutionScore,
            countryScore,
            countryTwitterScore,
            countryYoutubeScore,
            socialMediaLinks,
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

export default InstitutionSocialMediaPage