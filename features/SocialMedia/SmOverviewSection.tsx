import { Box, Card, createStyles, Grid, Stack, Text, Title } from '@mantine/core';
import { country, institution } from '@prisma/client';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import SmIconLink from './SmIconLink';
import SmRadar from '../Charts/SmRadar';
import { getLocalizedName } from '../../lib/util/util';
import SmProfilesBar from '../Charts/SmProfilesBar';
import { SocialMediaLargeItem } from '../../lib/types/social-media/SocialMediaSimplifiedTypes';
import { CountrySocialRating } from '../../lib/types/social-media/CountrySocialRatingTypes';

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colors.light[0],
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.colors.gray[2]}`,
    },
    cardSection: {
        padding: theme.spacing.md,
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        marginTop: theme.spacing.sm,
    },
}));


interface Props {
    socialMedia: SocialMediaLargeItem
    countrySocialMedia: CountrySocialRating,
    institution: institution,
    country: country,
}

const SmOverviewSection: React.FC<Props> = (
    { socialMedia, countrySocialMedia, institution, country }: Props
) => {

    const { t, lang } = useTranslation('institution');
    const { classes, theme } = useStyles();

    // Graph data
    const graphLabels = [
        'Facebook',
        'Instagram',
        'Twitter',
        'Youtube',
    ]
    const graphDataInstitution = [
        socialMedia.facebook_score,
        socialMedia.instagram_score,
        socialMedia.twitter_score,
        socialMedia.youtube_score,
    ]
    const graphDataCountry = [
        countrySocialMedia.score.facebook,
        countrySocialMedia.score.instagram,
        countrySocialMedia.score.twitter,
        countrySocialMedia.score.youtube,
    ]

    return (
        <Box id='sectionOverview'>
            { /* OVERVIEW SECTION */}
            <Title order={3}>Overview</Title>
            <Text>All social media profiles at a glance.</Text>
            <Grid>
                <Grid.Col md={8} order={2} orderMd={1}>
                    <Card shadow={"xs"} className={classes.card}>
                        <SmRadar
                            countryName={getLocalizedName({ lang: lang, dbTranslated: country })}
                            institutionName={getLocalizedName({ lang: lang, institution: institution })}
                            labels={graphLabels}
                            dataInstitution={graphDataInstitution}
                            dataCountry={graphDataCountry}
                        />
                        {/* <SmProfilesBar

                        /> */}
                    </Card>
                </Grid.Col>

                <Grid.Col md={4} order={1} orderMd={2}>
                    <Stack>
                        <Card shadow={"xs"} className={classes.card}>
                            <Stack spacing={"sm"}>
                                <Text size="sm" weight={"bold"} color="dimmed" transform='uppercase'>{t('social-media.header-links')}</Text>
                                {
                                    socialMedia.youtube_url &&
                                    <SmIconLink
                                        type='youtube'
                                        url={socialMedia.youtube_url}
                                        label
                                        title={t('common:link-titles.yt-profile', { name: institution.name })}
                                    />
                                }
                                {
                                    socialMedia.twitter_url &&
                                    <SmIconLink
                                        type='twitter'
                                        url={socialMedia.twitter_url}
                                        label
                                        title={t('common:link-titles.tw-profile', { name: institution.name })}
                                    />
                                }
                                {
                                    socialMedia.facebook_url &&
                                    <SmIconLink
                                        type='facebook'
                                        url={socialMedia.facebook_url}
                                        label
                                        title={t('common:link-titles.fb-profile', { name: institution.name })}
                                    />
                                }
                                {
                                    socialMedia.instagram_url &&
                                    <SmIconLink
                                        type='instagram'
                                        url={socialMedia.instagram_url}
                                        label
                                        title={t('common:link-titles.in-profile', { name: institution.name })}
                                    />
                                }
                            </Stack>
                        </Card>
                    </Stack>
                </Grid.Col>

            </Grid>
        </Box>
    )
}

export default SmOverviewSection