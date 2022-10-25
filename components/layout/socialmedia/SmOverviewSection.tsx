import { Box, Card, Grid, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { Country, CountrySocialMedia, Institution } from '@prisma/client';
import {
    IconBrandFacebook, IconBrandInstagram, IconBrandTwitter, IconBrandYoutube
} from '@tabler/icons';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { TotalScore, TotalScoreSet } from '../../../lib/types/SocialMediaTypes';
import { getLocalizedName } from '../../../lib/util/util';
import SmProfilesBar from '../../elements/socialmedia/charts/SmProfilesBar';
import SocialMediaRadar from '../../elements/socialmedia/charts/SmRadar';
import SocialMediaStatCard from '../../elements/socialmedia/SmStatCard';

interface Props {
    institution: Institution,
    country: Country,
    countrySocialMedia: CountrySocialMedia,
    institutionScore: TotalScore,
    countryPercentScore: TotalScoreSet,
    countryTwitterScore: TotalScoreSet,
    countryYoutubeScore: TotalScoreSet,
    classes: Record<"card" | "title" | "cardSection", string>
}

const SmOverviewSection: React.FC<Props> = (
    { institution, country, countrySocialMedia, institutionScore, countryPercentScore, countryTwitterScore, countryYoutubeScore, classes }: Props
) => {

    const { t, lang } = useTranslation('common');

    // Graph data
    const graphLabels = [
        'Total reach %',
        'Total content output %',
        'Average impressions %',
        'Average interaction %',
        'Profiles completed %',
    ]
    const graphDataInstitution = [
        institutionScore.percentData.totalReach,
        institutionScore.percentData.totalContentOutput,
        institutionScore.percentData.averageImpressions,
        institutionScore.percentData.averageInteraction,
        institutionScore.percentData.profilesCompleted,
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
                            total={institutionScore.all}
                            scoreSetTwitter={institutionScore.twitterOnly}
                            scoreSetYoutube={institutionScore.youtubeOnly}
                        />
                    </Card>
                </Grid.Col>

                <Grid.Col span={4}>
                    <Stack>
                        <SimpleGrid cols={1}>
                            <SocialMediaStatCard
                                title='Twitter'
                                value={institutionScore?.twitterOnly.total || 0}
                                diff={calculateSocialMediaDifference(institutionScore?.twitterOnly.total || 0, countryTwitterScore.total)}
                                icon={IconBrandTwitter}
                            />
                            <SocialMediaStatCard
                                title='Youtube'
                                value={institutionScore?.youtubeOnly.total || 0}
                                diff={calculateSocialMediaDifference(institutionScore?.youtubeOnly.total || 0, countryYoutubeScore.total)}
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