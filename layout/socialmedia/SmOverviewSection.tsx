import { Box, Card, createStyles, Grid, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { Country, CountrySocialMedia, Institution, InstitutionSocialMedia } from '@prisma/client';
import {
    IconBrandFacebook, IconBrandInstagram, IconBrandTwitter, IconBrandYoutube
} from '@tabler/icons';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { TotalScore, TotalScoreSet } from '../../lib/types/SocialMediaTypes';
import { getLocalizedName } from '../../lib/util/util';
import SmProfilesBar from '../../components/elements/socialmedia/charts/SmProfilesBar';
import SocialMediaRadar from '../../components/elements/socialmedia/charts/SmRadar';
import SmIconLink from '../../components/elements/socialmedia/SmIconLink';
import SocialMediaStatCard from '../../components/elements/socialmedia/SmStatCard';
import { SocialMediaLinkProps } from '../../pages/institution/[Country]/[Institution]/social-media';

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
    socialMediaLinks: SocialMediaLinkProps
    institution: Institution,
    country: Country,
    institutionScore: TotalScore,
    countryPercentScore: TotalScoreSet,
    countryTwitterScore: TotalScoreSet,
    countryYoutubeScore: TotalScoreSet,
}

const SmOverviewSection: React.FC<Props> = (
    { socialMediaLinks, institution, country, institutionScore, countryPercentScore, countryTwitterScore, countryYoutubeScore }: Props
) => {

    const { t, lang } = useTranslation('common');
    const { classes, theme } = useStyles();

    // Graph data
    const graphLabels = [
        'Total reach %',
        'Total content output %',
        'Average visibility %',
        'Average interaction %',
        'Profiles completed %',
    ]
    const graphDataInstitution = [
        institutionScore.percent.all.totalReach,
        institutionScore.percent.all.totalContentOutput,
        institutionScore.percent.all.averageImpressions,
        institutionScore.percent.all.averageInteraction,
        institutionScore.percent.all.profilesCompleted,
    ]
    const graphDataCountry = [
        countryPercentScore.totalReach,
        countryPercentScore.totalContentOutput,
        countryPercentScore.averageImpressions,
        countryPercentScore.averageInteraction,
        countryPercentScore.profilesCompleted,
    ]

    return (
        <Box id='sectionOverview'>
            { /* OVERVIEW SECTION */}
            <Title order={3}>Overview</Title>
            <Text>All social media profiles at a glance.</Text>
            <Grid>
                <Grid.Col span={8}>
                    <Card shadow={"xs"} className={classes.card}>
                        <SocialMediaRadar
                            countryName={getLocalizedName({ lang: lang, dbTranslated: country })}
                            institutionName={getLocalizedName({ lang: lang, institution: institution })}
                            labels={graphLabels}
                            dataInstitution={graphDataInstitution}
                            dataCountry={graphDataCountry}
                        />
                        <SmProfilesBar
                            total={institutionScore.percent.all}
                            scoreSetTwitter={institutionScore.percent.twitter}
                            scoreSetYoutube={institutionScore.percent.youtube}
                        />
                    </Card>
                </Grid.Col>

                <Grid.Col span={4}>
                    <Stack>
                        <SimpleGrid cols={1}>
                            <SocialMediaStatCard
                                title='Twitter'
                                value={institutionScore?.percent.twitter.total || 0}
                                diff={calculateSocialMediaDifference(institutionScore?.percent.twitter.total || 0, countryTwitterScore.total)}
                                icon={IconBrandTwitter}
                            />
                            <SocialMediaStatCard
                                title='Youtube'
                                value={institutionScore?.percent.youtube.total || 0}
                                diff={calculateSocialMediaDifference(institutionScore?.percent.youtube.total || 0, countryYoutubeScore.total)}
                                icon={IconBrandYoutube}
                            />
                            <SocialMediaStatCard
                                title='Instagram'
                                value={0}
                                diff={calculateSocialMediaDifference(0, 0)}
                                icon={IconBrandInstagram}
                            />
                            <SocialMediaStatCard
                                title='Facebook'
                                value={0}
                                diff={calculateSocialMediaDifference(0, 0)}
                                icon={IconBrandFacebook}
                            />
                        </SimpleGrid>
                        <Card shadow={"xs"} className={classes.card}>
                            <Stack spacing={"sm"}>
                                <Text size="xs" color="dimmed" className={classes.title}>
                                    Social Media Links
                                </Text>
                                {
                                    socialMediaLinks.youtube &&
                                    <SmIconLink type='youtube' url={socialMediaLinks.youtube} label title={`Youtube channel of ${institution.name}`} />
                                }
                                {
                                    socialMediaLinks.twitter &&
                                    <SmIconLink type='twitter' url={socialMediaLinks.twitter} label title={`Twitter profile of ${institution.name}`} />
                                }
                                {
                                    socialMediaLinks.facebook &&
                                    <SmIconLink type='facebook' url={socialMediaLinks.facebook} label title={`Facebook profile of ${institution.name}`} />
                                }
                                {
                                    socialMediaLinks.instagram &&
                                    <SmIconLink type='instagram' url={socialMediaLinks.instagram} label title={`Instagram profile of ${institution.name}`} />
                                }
                            </Stack>
                        </Card>
                    </Stack>
                </Grid.Col>

            </Grid>
        </Box>
    )
}

const calculateSocialMediaDifference = (points: number, average: number) => {
    return points === 0 ? -100 : (points - average) / 100
}

export default SmOverviewSection