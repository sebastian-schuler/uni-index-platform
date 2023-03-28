
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
import { getCountrySocialmedia, getSocialMedia } from '../../../../../lib/prisma/prismaSocialMedia'
import { TotalScore, TotalScoreSet, TwitterProfile } from '../../../../../lib/types/SocialMediaTypes'
import { getStaticPathsInstitution } from '../../../../../lib/url-helper/staticPathFunctions'
import { URL_INSTITUTION_SOCIALMEDIA_TW } from '../../../../../lib/url-helper/urlConstants'

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
    institution: institution,
    country: country,
    countryTwitterScore: TotalScoreSet | null
    countryTwitterProfile: TwitterProfile | null
    institutionScore: TotalScoreSet | null
    institutionTwitterProfile: TwitterProfile | null
    footerContent: FooterContent[],
}

const InstitutionTwitterPage: NextPage<Props> = ({ institution, country, countryTwitterScore, countryTwitterProfile, institutionScore, institutionTwitterProfile, footerContent }: Props) => {

    const { classes, theme } = useStyles();
    const { t, lang } = useTranslation('institution');
    const router = useRouter();

    const errorComponent = (
        <ResponsiveWrapper footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('social-media-twitter-title-nodata', { institution: institution.name })}</title>
                <meta key={"description"} name="description" content={t('social-media-twitter-description', { institution: institution.name })} />
            </Head>

            <Breadcrumb countryInfo={country} institutionInfo={institution} />

            <Text>No Twitter data</Text>

        </ResponsiveWrapper>
    );

    // IF NO SOCIAL MEDIA DATA PRESENT, RETURN ERROR COMPONENT
    if (!institutionTwitterProfile || !countryTwitterProfile || !institutionScore || !countryTwitterScore) {
        return errorComponent;
    }

    // Url Back
    const urlBack = router.asPath.replace(URL_INSTITUTION_SOCIALMEDIA_TW, '');

    return (
        <ResponsiveWrapper footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('social-media-twitter-title', { institution: institution.name })}</title>
                <meta key={"description"} name="description" content={t('social-media-twitter-description', { institution: institution.name })} />
            </Head>

            <Stack>
                <Breadcrumb countryInfo={country} institutionInfo={institution} />

                <Group position='apart'>
                    <div>
                        <Title order={3}>Twitter Details</Title>
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
                                title='Followers'
                                countryValue={countryTwitterProfile.followers}
                                institutionValue={institutionTwitterProfile.followers}
                            />
                            <Divider mt="md" mb="md" />

                            <SmStatRow
                                title='Following'
                                countryValue={countryTwitterProfile.following}
                                institutionValue={institutionTwitterProfile.following}
                            />

                            <Divider mt="md" mb="md" />

                            <SmStatRow
                                title='List appearances'
                                countryValue={countryTwitterProfile.listed}
                                institutionValue={institutionTwitterProfile.listed}
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
                                <Text weight={700} size="md" color={institutionTwitterProfile.isVerified ? 'teal' : 'red'} sx={{ lineHeight: 1.2 }}>
                                    {
                                        institutionTwitterProfile.isVerified ? "VERIFIED" : "NOT VERIFIED"
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
                                <Text weight={700} size="md" color={institutionTwitterProfile.isWebsiteLinked ? 'teal' : 'red'} sx={{ lineHeight: 1.2 }}>
                                    {
                                        institutionTwitterProfile.isWebsiteLinked ? "LINK IN PROFILE" : "NO LINK IN PROFILE"
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
                                countryValue={countryTwitterProfile.tweets}
                                institutionValue={institutionTwitterProfile.tweets}
                            />
                            <Divider mt="md" mb="md" />
                            <SmStatRow
                                title='Average likes per tweet'
                                countryValue={countryTwitterProfile.avgLikes}
                                institutionValue={institutionTwitterProfile.avgLikes}
                            />
                            <Divider mt="md" mb="md" />
                            <SmStatRow
                                title='Average replies per tweet'
                                countryValue={countryTwitterProfile.avgReplies}
                                institutionValue={institutionTwitterProfile.avgReplies}
                            />
                            <Divider mt="md" mb="md" />
                            <SmStatRow
                                title='Average retweets per tweet'
                                countryValue={countryTwitterProfile.avgRetweets}
                                institutionValue={institutionTwitterProfile.avgRetweets}
                            />
                        </Card.Section>
                    </Card>
                </SimpleGrid>
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

    // Country data
    const countryTwitterScore = countrySocialMedia ? JSON.parse(countrySocialMedia.avg_twitter_score) as TotalScoreSet : null;
    const countryTwitterProfile = countrySocialMedia ? JSON.parse(countrySocialMedia.avg_twitter_profile) as TwitterProfile : null;

    // Institution data
    const institutionScore = socialMedia ? JSON.parse(socialMedia.total_score) as TotalScore : null;
    const institutionTwitterProfile = socialMedia && socialMedia.twitter_profile ? JSON.parse(socialMedia.twitter_profile) as TwitterProfile : null;

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
            countryTwitterScore,
            countryTwitterProfile,
            institutionScore,
            institutionTwitterProfile,
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

export default InstitutionTwitterPage