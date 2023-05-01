
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
import { CountrySocialRating } from '../../../../../lib/types/social-media/CountrySocialRatingTypes'
import { SocialMediaLargeItem } from '../../../../../lib/types/social-media/SocialMediaSimplifiedTypes'
import { getStaticPathsInstitution } from '../../../../../lib/url-helper/staticPathFunctions'
import { toLink } from '../../../../../lib/util/util'

interface Props {
    institution: institution,
    country: country,
    lastUpdate: number,
    socialMedia: SocialMediaLargeItem | null,
    countrySocialMedia: CountrySocialRating | null,
    footerContent: FooterContent[],
}

const InstitutionSocialMediaPage: NextPage<Props> = ({ institution, country, lastUpdate, countrySocialMedia, socialMedia, footerContent }: Props) => {

    const { t, lang } = useTranslation('institution');
    const router = useRouter();

    if (!socialMedia || !countrySocialMedia) {
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

    if (socialMedia.twitter_data) {
        socialMediaPages.push(
            <SocialMediaCategoryCard
                key={'twitter'}
                title='Twitter'
                url={toLink(router.asPath, "twitter")}
                icon={<IconBrandTwitter size={24} color={"white"} />}
                color={"#1DA1F2"}
                textColor={"white"}
                rating={socialMedia.twitter_score}
            />
        );
    }

    if (socialMedia.youtube_data) {
        socialMediaPages.push(
            <SocialMediaCategoryCard
                key={'youtube'}
                title='Youtube'
                url={toLink(router.asPath, "youtube")}
                icon={<IconBrandYoutube size={24} color={"white"} />}
                color={"#FF0000"}
                textColor={"white"}
                rating={socialMedia.youtube_score}
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
                    socialMedia={socialMedia}
                    countrySocialMedia={countrySocialMedia}
                    country={country}
                    institution={institution}
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

    // Last Update
    const lastUpdate = socialMedia ? Number(socialMedia.last_update) : 0;

    // Footer Data
    // Get all countries
    const countryList = await getCountries();
    const footerContent: FooterContent[] = [
        { title: "Countries", data: countryList, type: "Country" },
    ]

    if (!institution || !country) {
        return { notFound: true }
    }

    const props: Props = {
        institution,
        country,
        lastUpdate,
        socialMedia,
        countrySocialMedia,
        footerContent
    }

    return { props };
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {

    const paths = await getStaticPathsInstitution(locales || []);

    return {
        paths: paths,
        fallback: false
    }
}

export default InstitutionSocialMediaPage