
import { Button, Card, createStyles, Divider, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { Country, Institution } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import SmStatRow from '../../../../../components/elements/socialmedia/SmStatRow'
import WhitePaper from '../../../../../components/WhitePaper'
import Breadcrumb from '../../../../../layout/Breadcrumb'
import { FooterContent } from '../../../../../layout/footer/Footer'
import LayoutContainer from '../../../../../layout/LayoutContainer'
import { getCountries, getCountry, getInstitution } from '../../../../../lib/prisma/prismaQueries'
import { getCountrySocialmedia, getSocialMedia } from '../../../../../lib/prisma/prismaSocialMedia'
import { TotalScore, TotalScoreSet, YoutubeProfile } from '../../../../../lib/types/SocialMediaTypes'
import { getStaticPathsInstitution } from '../../../../../lib/url-helper/staticPathFunctions'
import { URL_INSTITUTION_SOCIALMEDIA_YT } from '../../../../../lib/url-helper/urlConstants'

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colors.light[0],
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.colors.gray[2]}`,
    },
    title: {
        fontSize: theme.fontSizes.sm,
        fontWeight: 700,
        textTransform: 'uppercase',
    },
    cardSection: {
        padding: theme.spacing.md,
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        marginTop: theme.spacing.sm,
    },
}));

interface Props {
    institution: Institution,
    country: Country,
    countryYoutubeScore: TotalScoreSet | null
    countryYoutubeProfile: YoutubeProfile | null
    institutionScore: TotalScoreSet | null
    institutionYoutubeProfile: YoutubeProfile | null
    footerContent: FooterContent[],
}

const InstitutionYoutubePage: NextPage<Props> = ({ institution, country, countryYoutubeScore, countryYoutubeProfile, institutionScore, institutionYoutubeProfile, footerContent }: Props) => {

    const { classes, theme } = useStyles();
    const { t, lang } = useTranslation('institution');
    const router = useRouter();

    const errorComponent = (
        <LayoutContainer footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('social-media-youtube-title-nodata', { institution: institution.name })}</title>
                <meta key={"description"} name="description" content={t('social-media-youtube-description', { institution: institution.name })} />
            </Head>

            <Breadcrumb countryInfo={country} institutionInfo={institution} />
            <WhitePaper>
                <Text>No Youtube data</Text>
            </WhitePaper>
        </LayoutContainer>
    );
    // IF NO SOCIAL MEDIA DATA PRESENT, RETURN ERROR COMPONENT
    if (!countryYoutubeScore || !countryYoutubeProfile || !institutionScore || !institutionYoutubeProfile) {
        return errorComponent;
    }

    // Url Back
    const urlBack = router.asPath.replace(URL_INSTITUTION_SOCIALMEDIA_YT, '');

    return (
        <LayoutContainer footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('social-media-youtube-title', { institution: institution.name })}</title>
                <meta key={"description"} name="description" content={t('social-media-youtube-description', { institution: institution.name })} />
            </Head>

            <WhitePaper>
                <Stack>
                    <Breadcrumb countryInfo={country} institutionInfo={institution} />

                    <Group position='apart'>
                        <div>
                            <Title order={3}>Youtube Details</Title>
                            <Text>All social media profiles at a glance.</Text>
                        </div>
                        <Button component={Link} href={urlBack} variant='light' radius={"md"}>Go back</Button>
                    </Group>

                    <SimpleGrid cols={2} mt={"sm"} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>

                        <Card shadow={"xs"} className={classes.card}>

                            <Title order={4}>Profile statistic</Title>
                            <Text>Basic information about the institutions twitter profile.</Text>

                            <Card.Section className={classes.cardSection}>

                                <SmStatRow
                                    title='Subscribers'
                                    countryValue={countryYoutubeProfile.subscribers}
                                    institutionValue={institutionYoutubeProfile.subscribers}
                                />
                                <Divider mt="md" mb="md" />

                                <SmStatRow
                                    title='Total views'
                                    countryValue={countryYoutubeProfile.views}
                                    institutionValue={institutionYoutubeProfile.views}
                                />
                                <Divider mt="md" mb="md" />
                                <div>
                                    <Text
                                        color="dimmed"
                                        transform="uppercase"
                                        weight={700}
                                        size="xs"
                                    >
                                        Description
                                    </Text>
                                    <Text weight={700} size="md" color={institutionYoutubeProfile.descriptionGood ? 'teal' : 'red'} sx={{ lineHeight: 1.2 }}>
                                        {
                                            institutionYoutubeProfile.descriptionGood ? "GOOD LENGTH" : "BAD LENGTH"
                                        }
                                    </Text>
                                </div>
                            </Card.Section>
                        </Card>

                        <Card shadow={"xs"} className={classes.card}>

                            <Title order={4}>Video statistic</Title>
                            <Text>Basic information about the institutions twitter profile.</Text>

                            <Card.Section className={classes.cardSection}>
                                <SmStatRow
                                    title='Total videos'
                                    countryValue={countryYoutubeProfile.videos}
                                    institutionValue={institutionYoutubeProfile.videos}
                                />
                                <Divider mt="md" mb="md" />
                                <SmStatRow
                                    title='Average likes per video'
                                    countryValue={countryYoutubeProfile.averageLikes}
                                    institutionValue={institutionYoutubeProfile.averageLikes}
                                />
                                <Divider mt="md" mb="md" />
                                <SmStatRow
                                    title='Average comments per video'
                                    countryValue={countryYoutubeProfile.averageComments}
                                    institutionValue={institutionYoutubeProfile.averageComments}
                                />
                                <Divider mt="md" mb="md" />
                                <SmStatRow
                                    title='Average views per video'
                                    countryValue={countryYoutubeProfile.averageViews}
                                    institutionValue={institutionYoutubeProfile.averageViews}
                                />
                                <Divider mt="md" mb="md" />
                                <div>
                                    <Text
                                        color="dimmed"
                                        transform="uppercase"
                                        weight={700}
                                        size="xs"
                                    >
                                        Average video tags
                                    </Text>
                                    <Text weight={700} size="md" color={institutionYoutubeProfile.videosHaveTags ? 'teal' : 'red'} sx={{ lineHeight: 1.2 }}>
                                        {
                                            institutionYoutubeProfile.videosHaveTags ? "GOOD AMOUNT" : "BAD AMOUNT"
                                        }
                                    </Text>
                                </div>
                            </Card.Section>
                        </Card>
                    </SimpleGrid>
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

    // Country data
    const countryYoutubeScore = countrySocialMedia ? JSON.parse(countrySocialMedia.avg_youtube_score) as TotalScoreSet : null;
    const countryYoutubeProfile = countrySocialMedia ? JSON.parse(countrySocialMedia.avg_youtube_profile) as YoutubeProfile : null;

    // Institution data
    const institutionScore = socialMedia ? JSON.parse(socialMedia.total_score) as TotalScore : null;
    const institutionYoutubeProfile = socialMedia && socialMedia.youtube_profile ? JSON.parse(socialMedia.youtube_profile) as YoutubeProfile : null;

    // Footer Data
    // Get all countries
    const countryList = await getCountries();
    const footerContent: FooterContent[] = [
        { title: "Countries", data: countryList, type: "Country" },
    ]

    return {
        props: {
            institution: institution,
            country: country,
            countryYoutubeScore,
            countryYoutubeProfile,
            institutionScore,
            institutionYoutubeProfile,
            footerContent: footerContent
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

export default InstitutionYoutubePage;