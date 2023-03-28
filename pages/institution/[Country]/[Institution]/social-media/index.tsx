
import { SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { country, institution } from '@prisma/client'
import { IconBrandTwitter, IconBrandYoutube } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import { useRouter } from 'next/router'
import SocialMediaCategoryCard from '../../../../../components/Card/SocialMediaCategoryCard'
import ResponsiveWrapper from '../../../../../components/Container/ResponsiveWrapper'
import Breadcrumb from '../../../../../features/Breadcrumb/Breadcrumb'
import { FooterContent } from '../../../../../features/Footer/Footer'
import InstitutionNav from '../../../../../features/Navigation/InstitutionNav'
import SmOverviewSection from '../../../../../features/SocialMedia/SmOverviewSection'
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
    institution: institution,
    country: country,
    lastUpdate: number,
    institutionScore: TotalScore | null
    countryScore: TotalScoreSet | null
    countryTwitterScore: TotalScoreSet | null
    countryYoutubeScore: TotalScoreSet | null
    socialMediaLinks: SocialMediaLinkProps
    footerContent: FooterContent[],
}

const InstitutionSocialMediaPage: NextPage<Props> = ({ institution, country, lastUpdate, institutionScore, countryScore, countryTwitterScore, countryYoutubeScore, socialMediaLinks, footerContent }: Props) => {

    const { t, lang } = useTranslation('institution');
    const router = useRouter();

    if (!institutionScore || !countryScore || !countryTwitterScore || !countryYoutubeScore) {
        return (
            <ResponsiveWrapper footerContent={footerContent}>

                <Head>
                    <title key={"title"}>{t('common:page-title') + " | " + t('social-media.title-nodata', { institution: institution.name })}</title>
                    <meta key={"description"} name="description" content={t('social-media.description', { institution: institution.name })} />
                </Head>

                <Breadcrumb countryInfo={country} institutionInfo={institution} />
                <InstitutionNav title={institution.name} />
                <Text>No data</Text>
            </ResponsiveWrapper>
        )
    }

    const socialMediaPages: JSX.Element[] = [];

    if (socialMediaLinks.twitter) {
        socialMediaPages.push(
            <SocialMediaCategoryCard
                key={'twitter'}
                title='Twitter'
                url={toLink(router.asPath, "twitter")}
                icon={<IconBrandTwitter size={24} color={"white"} />}
                color={"#1DA1F2"}
                textColor={"white"}
            />
        );
    }

    if (socialMediaLinks.youtube) {
        socialMediaPages.push(
            <SocialMediaCategoryCard
                key={'youtube'}
                title='Youtube'
                url={toLink(router.asPath, "youtube")}
                icon={<IconBrandYoutube size={24} color={"white"} />}
                color={"#FF0000"}
                textColor={"white"}
            />
        );
    }

    const lastUpdateString = dayjs(lastUpdate).format('DD.MM.YYYY');

    return (
        <ResponsiveWrapper footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('social-media.title', { institution: institution.name })}</title>
                <meta key={"description"} name="description" content={t('social-media.description', { institution: institution.name })} />
            </Head>

            <Breadcrumb countryInfo={country} institutionInfo={institution} />

            <InstitutionNav title={institution.name} />

            <Stack spacing={"lg"}>

                {/* Header Section */}
                <Stack>
                    <div>
                        <Title order={2}>{t('social-media.header')}</Title>
                        <Text>{t('social-media.header-text', { name: institution.name })}</Text>
                        <Text>{t('institution.label-lastupdate', { date: lastUpdateString })}</Text>
                    </div>
                    <SimpleGrid
                        breakpoints={[
                            { minWidth: 'md', cols: 4, spacing: 'md' },
                            { minWidth: 'sm', cols: 2, spacing: 'sm' },
                        ]}
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

        </ResponsiveWrapper>
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

    // Last Update
    const lastUpdate = socialMedia ? Number(socialMedia.last_update) : 0;

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
            lastUpdate,
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