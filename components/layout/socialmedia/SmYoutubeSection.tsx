import { Box, Card, createStyles, Divider, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import React from 'react'
import { TotalScore, TotalScoreSet, TwitterResults, YoutubeResults } from '../../../lib/types/SocialMediaTypes';
import SmStatRow from '../../elements/socialmedia/SmStatRow';

interface Props {
    youtubeResult: YoutubeResults
    countryYoutubeResults: YoutubeResults
    classes: Record<"card" | "title" | "cardSection", string>
}

const SmYoutubeSection: React.FC<Props> = ({ youtubeResult, countryYoutubeResults, classes }: Props) => {

    return (
        <Box id='sectionTwitterDetails'>
            { /* OVERVIEW SECTION */}
            <Title order={3}>Youtube Details</Title>
            <Text>All social media profiles at a glance.</Text>
            <SimpleGrid cols={2} mt={"sm"} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>

                <Card shadow={"xs"} className={classes.card}>

                    <Title order={4}>Profile statistic</Title>
                    <Text>Basic information about the institutions twitter profile.</Text>

                    <Card.Section className={classes.cardSection}>

                        <SmStatRow
                            title='Subscribers'
                            countryValue={countryYoutubeResults.subs}
                            institutionValue={youtubeResult.subs}
                        />
                        <Divider mt="md" mb="md" />

                        <SmStatRow
                            title='Total views'
                            countryValue={countryYoutubeResults.views}
                            institutionValue={youtubeResult.views}
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
                            <Text weight={700} size="md" color={youtubeResult.descriptionGood > 0 ? 'teal' : 'red'} sx={{ lineHeight: 1.2 }}>
                                {
                                    youtubeResult.descriptionGood > 0 ? "GOOD LENGTH" : "BAD LENGTH"
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
                            countryValue={countryYoutubeResults.videos}
                            institutionValue={youtubeResult.videos}
                        />
                        <Divider mt="md" mb="md" />
                        <SmStatRow
                            title='Average likes per video'
                            countryValue={countryYoutubeResults.averageLikes}
                            institutionValue={youtubeResult.averageLikes}
                        />
                        <Divider mt="md" mb="md" />
                        <SmStatRow
                            title='Average comments per video'
                            countryValue={countryYoutubeResults.averageComments}
                            institutionValue={youtubeResult.averageComments}
                        />
                        <Divider mt="md" mb="md" />
                        <SmStatRow
                            title='Average views per video'
                            countryValue={countryYoutubeResults.averageViews}
                            institutionValue={youtubeResult.averageViews}
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
                            <Text weight={700} size="md" color={youtubeResult.videosHaveTags > 0 ? 'teal' : 'red'} sx={{ lineHeight: 1.2 }}>
                                {
                                    youtubeResult.videosHaveTags > 0 ? "GOOD AMOUNT" : "BAD AMOUNT"
                                }
                            </Text>
                        </div>
                    </Card.Section>
                </Card>

            </SimpleGrid>
        </Box>
    )
}

export default SmYoutubeSection