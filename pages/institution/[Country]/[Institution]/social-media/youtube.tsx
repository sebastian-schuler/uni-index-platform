
import { Button, Card, createStyles, Divider, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { country, institution } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ResponsiveWrapper from '../../../../../components/Container/ResponsiveWrapper'
import Breadcrumb from '../../../../../features/Breadcrumb/Breadcrumb'
import { FooterContent } from '../../../../../features/Footer/Footer'
import SmStatRow from '../../../../../features/SocialMedia/SmStatRow'
import { getCountries, getCountry, getInstitution } from '../../../../../lib/prisma/prismaQueries'
import { getCountrySocialmedia, getInstitutionYoutubeData } from '../../../../../lib/prisma/prismaSocialMedia'
import { CountryYoutubeSummary } from '../../../../../lib/types/social-media/CountrySocialRatingTypes'
import { YoutubeChannel } from '../../../../../lib/types/social-media/YoutubeTypes'
import { getStaticPathsInstitution } from '../../../../../lib/url-helper/staticPathFunctions'
import { URL_INSTITUTION_SOCIALMEDIA_YT } from '../../../../../lib/url-helper/urlConstants'
import YoutubeEmbed from '../../../../../components/Embed/YoutubeEmbed'
import YtVideoEmbedDetails from '../../../../../features/SocialMedia/YtVideoEmbedDetails'

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colors.light[0],
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.colors.gray[4]}`,
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
    institution: institution,
    country: country,
    youtubeProfile: YoutubeChannel | null
    avgYoutubeProfile: CountryYoutubeSummary | null,
    avgYoutubeScore: number | null,
    footerContent: FooterContent[],
}

const InstitutionYoutubePage: NextPage<Props> = ({ institution, country, youtubeProfile, avgYoutubeProfile, avgYoutubeScore, footerContent }: Props) => {

    const { classes, theme } = useStyles();
    const { t, lang } = useTranslation('institution');
    const router = useRouter();

    const errorComponent = (
        <ResponsiveWrapper footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('social-media-youtube-title-nodata', { institution: institution.name })}</title>
                <meta key={"description"} name="description" content={t('social-media-youtube-description', { institution: institution.name })} />
            </Head>

            <Breadcrumb countryInfo={country} institutionInfo={institution} />
            <Text>No Youtube data</Text>
        </ResponsiveWrapper>
    );
    // IF NO SOCIAL MEDIA DATA PRESENT, RETURN ERROR COMPONENT
    if (!avgYoutubeProfile || !youtubeProfile) {
        return errorComponent;
    }

    // Url Back
    const urlBack = router.asPath.replace(URL_INSTITUTION_SOCIALMEDIA_YT, '');

    return (
        <ResponsiveWrapper footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('social-media-youtube-title', { institution: institution.name })}</title>
                <meta key={"description"} name="description" content={t('social-media-youtube-description', { institution: institution.name })} />
            </Head>

            <Stack>
                <Breadcrumb countryInfo={country} institutionInfo={institution} />

                <Group position='apart'>
                    <div>
                        <Title order={2}>Youtube Details</Title>
                        <Text>{institution.name} Youtube channel statistics compared to the averages of institutions in {country.name}.</Text>
                    </div>
                    <Button component={Link} href={urlBack} variant='light' radius={"md"}>Go back</Button>
                </Group>

                <SimpleGrid cols={2} mt={"sm"} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>

                    <Card className={classes.card}>

                        <Title order={4}>Channel</Title>
                        <Text>General stats of the channel.</Text>

                        <Card.Section className={classes.cardSection}>

                            <SmStatRow
                                title='Subscribers'
                                countryValue={avgYoutubeProfile.subscribers}
                                institutionValue={youtubeProfile.meta.metrics.subscriberCount}
                            />

                            <Divider mt="md" mb="md" />

                            <SmStatRow
                                title='Total views'
                                countryValue={avgYoutubeProfile.totalViews}
                                institutionValue={youtubeProfile.meta.metrics.viewCount}
                            />

                            <Divider mt="md" mb="md" />

                            <SmStatRow
                                title='Avg. videos per month'
                                countryValue={avgYoutubeProfile.videosPerMonth}
                                institutionValue={youtubeProfile.meta.metrics.avgVideosPerMonth}
                            />

                            <Divider mt="md" mb="md" />

                            <SmStatRow
                                title='Total videos'
                                countryValue={avgYoutubeProfile.videos}
                                institutionValue={youtubeProfile.meta.metrics.videoCount}
                            />

                        </Card.Section>
                    </Card>

                    <Card className={classes.card}>

                        <Title order={4}>Video averages</Title>
                        <Text>Average stats of all videos of this institutions Youtube channel.</Text>

                        <Card.Section className={classes.cardSection}>

                            <SmStatRow
                                title='Average likes per video'
                                countryValue={avgYoutubeProfile.videoLikes}
                                institutionValue={youtubeProfile.raw.averages.avgLikes}
                            />
                            <Divider mt="md" mb="md" />
                            <SmStatRow
                                title='Average comments per video'
                                countryValue={avgYoutubeProfile.videoComments}
                                institutionValue={youtubeProfile.raw.averages.avgComments}
                            />
                            <Divider mt="md" mb="md" />
                            <SmStatRow
                                title='Average views per video'
                                countryValue={avgYoutubeProfile.videoViews}
                                institutionValue={youtubeProfile.raw.averages.avgViews}
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
                                <Text weight={700} size="md" color={youtubeProfile.raw.multiplier.isWellTagged ? 'teal' : 'red'} sx={{ lineHeight: 1.2 }}>
                                    {
                                        youtubeProfile.raw.multiplier.isWellTagged ? "GOOD AMOUNT" : "BAD AMOUNT"
                                    }
                                </Text>
                            </div>
                        </Card.Section>
                    </Card>
                </SimpleGrid>

                <Title order={3} mt='lg'>Best Performing Videos</Title>

                <Stack spacing={'lg'}>

                    {
                        youtubeProfile.bestVideos.map((video, index) => (
                            <YtVideoEmbedDetails key={index} video={video} />
                        ))
                    }

                </Stack>

            </Stack>
        </ResponsiveWrapper>
    )
}

export async function getStaticProps(context: GetStaticPropsContext) {

    let countryUrl = "" + context?.params?.Country;
    let institutionUrl = "" + context?.params?.Institution;

    const country = await getCountry(countryUrl);
    const institution = await getInstitution({ institutionUrl });
    const institutionSocialMedia = institution ? (await getInstitutionYoutubeData(institution.id)) : null;
    const countrySocialMedia = country ? (await getCountrySocialmedia(country.id)) : null;

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
        youtubeProfile: institutionSocialMedia?.youtube_data || null,
        avgYoutubeProfile: countrySocialMedia?.profile.youtube || null,
        avgYoutubeScore: countrySocialMedia?.count || null,
        footerContent,
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

export default InstitutionYoutubePage;