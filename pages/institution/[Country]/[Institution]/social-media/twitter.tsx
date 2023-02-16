
import { Button, Card, createStyles, Divider, Group, SimpleGrid, Text, Title } from '@mantine/core'
import { Country, CountrySocialMedia, Institution, InstitutionSocialMedia } from '@prisma/client'
import { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import { useRouter } from 'next/router'
import SmStatRow from '../../../../../components/elements/socialmedia/SmStatRow'
import Breadcrumb from '../../../../../layout/Breadcrumb'
import { FooterContent } from '../../../../../layout/footer/Footer'
import LayoutContainer from '../../../../../layout/LayoutContainer'
import InstitutionNav from '../../../../../layout/subnav/InstitutionNav'
import WhitePaper from '../../../../../components/WhitePaper'
import { getCountries, getCountry, getInstitution } from '../../../../../lib/prisma/prismaQueries'
import { getCountrySocialmedia, getSocialMedia } from '../../../../../lib/prisma/prismaSocialMedia'
import { TotalScore, TotalScoreSet, TwitterProfile, YoutubeChannelData, YoutubeProfile } from '../../../../../lib/types/SocialMediaTypes'
import { getStaticPathsInstitution } from '../../../../../lib/url-helper/staticPathFunctions'
import { URL_INSTITUTION_SOCIALMEDIA_TW } from '../../../../../lib/url-helper/urlConstants'
import Head from 'next/head'

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
    institutionSMString: string,
    countrySMString: string,
    footerContent: FooterContent[],
}

const InstitutionSocialMedia: NextPage<Props> = ({ institution, country, footerContent, institutionSMString, countrySMString }: Props) => {

    const { classes, theme } = useStyles();
    const { t, lang } = useTranslation('institution');
    const router = useRouter();

    const institutionSM: InstitutionSocialMedia | null = JSON.parse(institutionSMString);
    const countrySM: CountrySocialMedia | null = JSON.parse(countrySMString);

    const errorComponent = (
        <LayoutContainer footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('social-media-twitter-title-nodata', { institution: institution.name })}</title>
                <meta key={"description"} name="description" content={t('social-media-twitter-description', { institution: institution.name })} />
            </Head>

            <Breadcrumb countryInfo={country} institutionInfo={institution} />
            <WhitePaper>
                <Text>No Twitter data</Text>
            </WhitePaper>
        </LayoutContainer>
    );

    // IF NO SOCIAL MEDIA DATA PRESENT, RETURN ERROR COMPONENT
    if (!institutionSM || !institutionSM || !countrySM || !countrySM) {
        return errorComponent;
    }

    const institutionScore = JSON.parse(institutionSM.total_score) as TotalScore;

    // Country data
    const countryScore = JSON.parse(countrySM.avg_total_score) as TotalScoreSet;
    const countryTwitterScore = JSON.parse(countrySM.avg_twitter_score) as TotalScoreSet;
    const countryYoutubeScore = JSON.parse(countrySM.avg_youtube_score) as TotalScoreSet;
    // const countryPercentScore = JSON.parse(countrySM.avg_total_score_percent) as TotalScoreSet;
    const countryTwitterResults = JSON.parse(countrySM.avg_twitter_profile) as TwitterProfile;
    const countryYoutubeResults = JSON.parse(countrySM.avg_youtube_profile) as YoutubeProfile;

    // Institution data
    const twitterProfile = institutionSM.twitter_profile !== null ? JSON.parse(institutionSM.twitter_profile) as TwitterProfile : null;
    const youtubeProfile = institutionSM.youtube_profile !== null ? JSON.parse(institutionSM.youtube_profile) as YoutubeProfile : null;
    // const facebookResults = (socialMedia?.facebook_results as unknown) as FacebookResult;
    // const twitterResults = (socialMedia?.twitter_results as unknown) as TwitterResult;
    const youtubeData = institutionSM.youtube_data !== null ? JSON.parse(institutionSM.youtube_data) as YoutubeChannelData : null;
    // const instagramResults = (socialMedia?.instagram_results as unknown) as InstagramResult;
    // const youtubeLink = youtubeData ? "https://www.youtube.com/channel/" + youtubeData.id : null;

    // Url Back
    const urlBack = router.asPath.replace(URL_INSTITUTION_SOCIALMEDIA_TW, '');

    // IF NO SOCIAL MEDIA DATA PRESENT, RETURN ERROR COMPONENT
    if (!twitterProfile) {
        return errorComponent;
    }

    return (
        <LayoutContainer footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('social-media-twitter-title', { institution: institution.name })}</title>
                <meta key={"description"} name="description" content={t('social-media-twitter-description', { institution: institution.name })} />
            </Head>

            <WhitePaper>
                <Breadcrumb countryInfo={country} institutionInfo={institution} />

                <Group position='apart'>
                    <div>
                        <Title order={3}>Twitter Details</Title>
                        <Text>All social media profiles at a glance.</Text>
                    </div>
                    <Link href={urlBack} passHref>
                        <Button component='a' variant='light' radius={"md"}>Go back</Button>
                    </Link>
                </Group>

                <SimpleGrid cols={2} mt={"sm"} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>

                    <Card shadow={"xs"} className={classes.card}>

                        <Title order={4}>Profile statistic</Title>
                        <Text>Basic information about the institutions twitter profile.</Text>

                        <Card.Section className={classes.cardSection}>

                            <SmStatRow
                                title='Followers'
                                countryValue={countryTwitterResults.followers}
                                institutionValue={twitterProfile.followers}
                            />
                            <Divider mt="md" mb="md" />

                            <SmStatRow
                                title='Following'
                                countryValue={countryTwitterResults.following}
                                institutionValue={twitterProfile.following}
                            />

                            <Divider mt="md" mb="md" />

                            <SmStatRow
                                title='List appearances'
                                countryValue={countryTwitterResults.listed}
                                institutionValue={twitterProfile.listed}
                            />

                            <Divider mt="md" mb="md" />

                            <div>
                                <Text
                                    color="dimmed"
                                    transform="uppercase"
                                    weight={700}
                                    size="xs"
                                >
                                    Profile status
                                </Text>
                                <Text weight={700} size="md" color={twitterProfile.isVerified ? 'teal' : 'red'} sx={{ lineHeight: 1.2 }}>
                                    {
                                        twitterProfile.isVerified ? "VERIFIED" : "NOT VERIFIED"
                                    }
                                </Text>
                            </div>

                            <Divider mt="md" mb="md" />

                            <div>
                                <Text
                                    color="dimmed"
                                    transform="uppercase"
                                    weight={700}
                                    size="xs"
                                >
                                    Website link
                                </Text>
                                <Text weight={700} size="md" color={twitterProfile.isWebsiteLinked ? 'teal' : 'red'} sx={{ lineHeight: 1.2 }}>
                                    {
                                        twitterProfile.isWebsiteLinked ? "LINK IN PROFILE" : "NO LINK IN PROFILE"
                                    }
                                </Text>
                            </div>

                        </Card.Section>
                    </Card>

                    <Card shadow={"xs"} className={classes.card}>

                        <Title order={4}>Tweet statistic</Title>
                        <Text>Basic information about the institutions twitter profile.</Text>

                        <Card.Section className={classes.cardSection}>
                            <SmStatRow
                                title='Total tweets'
                                countryValue={countryTwitterResults.tweets}
                                institutionValue={twitterProfile.tweets}
                            />
                            <Divider mt="md" mb="md" />
                            <SmStatRow
                                title='Average likes per tweet'
                                countryValue={countryTwitterResults.avgLikes}
                                institutionValue={twitterProfile.avgLikes}
                            />
                            <Divider mt="md" mb="md" />
                            <SmStatRow
                                title='Average replies per tweet'
                                countryValue={countryTwitterResults.avgReplies}
                                institutionValue={twitterProfile.avgReplies}
                            />
                            <Divider mt="md" mb="md" />
                            <SmStatRow
                                title='Average retweets per tweet'
                                countryValue={countryTwitterResults.avgRetweets}
                                institutionValue={twitterProfile.avgRetweets}
                            />
                        </Card.Section>
                    </Card>
                </SimpleGrid>
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
            institutionSMString: JSON.stringify(socialMedia),
            countrySMString: JSON.stringify(countrySocialMedia),
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

export default InstitutionSocialMedia