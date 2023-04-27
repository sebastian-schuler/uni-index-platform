
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
import { getCountrySocialmedia, getInstitutionTwitterData } from '../../../../../lib/prisma/prismaSocialMedia'
import { CountryTwitterSummary } from '../../../../../lib/types/social-media/CountrySocialRatingTypes'
import { TwitterProfile } from '../../../../../lib/types/social-media/TwitterTypes'
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
    twitterProfile: TwitterProfile | null
    avgTwitterProfile: CountryTwitterSummary | null,
    avgTwitterScore: number | null,
    footerContent: FooterContent[],
}

const InstitutionTwitterPage: NextPage<Props> = ({ institution, country, twitterProfile, avgTwitterProfile, avgTwitterScore, footerContent }: Props) => {

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
    if (!avgTwitterProfile || !twitterProfile) {
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
                                countryValue={avgTwitterProfile.avgFollowers}
                                institutionValue={twitterProfile.meta.metrics.followerCount}
                            />
                            <Divider mt="md" mb="md" />

                            <SmStatRow
                                title='Following'
                                countryValue={avgTwitterProfile.avgFollowing}
                                institutionValue={twitterProfile.meta.metrics.followingCount}
                            />

                            <Divider mt="md" mb="md" />

                            <SmStatRow
                                title='List appearances'
                                countryValue={avgTwitterProfile.avgListed}
                                institutionValue={twitterProfile.meta.metrics.listedCount}
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
                                <Text weight={700} size="md" color={twitterProfile.raw.multiplier.isVerified ? 'teal' : 'red'} sx={{ lineHeight: 1.2 }}>
                                    {
                                        twitterProfile.raw.multiplier.isVerified ? "VERIFIED" : "NOT VERIFIED"
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
                                <Text weight={700} size="md" color={twitterProfile.raw.multiplier.isLinked ? 'teal' : 'red'} sx={{ lineHeight: 1.2 }}>
                                    {
                                        twitterProfile.raw.multiplier.isLinked ? "LINK IN PROFILE" : "NO LINK IN PROFILE"
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
                                countryValue={avgTwitterProfile.avgTweets}
                                institutionValue={twitterProfile.meta.metrics.tweetCount}
                            />
                            <Divider mt="md" mb="md" />
                            <SmStatRow
                                title='Average likes per tweet'
                                countryValue={0}
                                institutionValue={twitterProfile.raw.averages.avgLikes}
                            />
                            <Divider mt="md" mb="md" />
                            <SmStatRow
                                title='Average replies per tweet'
                                countryValue={0}
                                institutionValue={twitterProfile.raw.averages.avgReplies}
                            />
                            <Divider mt="md" mb="md" />
                            <SmStatRow
                                title='Average retweets per tweet'
                                countryValue={0}
                                institutionValue={twitterProfile.raw.averages.avgRetweets}
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
    const institutionSocialMedia = institution ? (await getInstitutionTwitterData(institution.id)) : null;
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
        twitterProfile: institutionSocialMedia?.twitter_data || null,
        avgTwitterProfile: countrySocialMedia?.profile.twitter || null,
        avgTwitterScore: countrySocialMedia?.count || null,
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

export default InstitutionTwitterPage