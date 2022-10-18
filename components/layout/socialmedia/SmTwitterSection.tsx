import { Box, Card, createStyles, Divider, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import React from 'react'
import { TotalScore, TotalScoreSet, TwitterResults } from '../../../lib/types/SocialMediaTypes';
import SmStatRow from '../../elements/socialmedia/SmStatRow';

interface Props {
    twitterResult: TwitterResults
    countryTwitterResults: TwitterResults
    classes: Record<"card" | "title" | "cardSection", string>
}

const SmTwitterSection: React.FC<Props> = ({ twitterResult, countryTwitterResults, classes }: Props) => {

    return (
        <Box id='sectionTwitterDetails'>
            { /* OVERVIEW SECTION */}
            <Title order={3}>Twitter Details</Title>
            <Text>All social media profiles at a glance.</Text>
            <SimpleGrid cols={2} mt={"sm"} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>

                <Card shadow={"xs"} className={classes.card}>

                    <Title order={4}>Profile statistic</Title>
                    <Text>Basic information about the institutions twitter profile.</Text>

                    <Card.Section className={classes.cardSection}>

                        <SmStatRow
                            title='Followers'
                            countryValue={countryTwitterResults.followers}
                            institutionValue={twitterResult.followers}
                        />
                        <Divider mt="md" mb="md" />

                        <SmStatRow
                            title='Following'
                            countryValue={countryTwitterResults.following}
                            institutionValue={twitterResult.following}
                        />

                        <Divider mt="md" mb="md" />

                        <SmStatRow
                            title='List appearances'
                            countryValue={countryTwitterResults.listed}
                            institutionValue={twitterResult.listed}
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
                            <Text weight={700} size="md" color={twitterResult.verifiedMultiplier > 0 ? 'teal' : 'red'} sx={{ lineHeight: 1.2 }}>
                                {
                                    twitterResult.verifiedMultiplier > 0 ? "VERIFIED" : "NOT VERIFIED"
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
                            <Text weight={700} size="md" color={twitterResult.websitelinkMultiplier > 0 ? 'teal' : 'red'} sx={{ lineHeight: 1.2 }}>
                                {
                                    twitterResult.websitelinkMultiplier > 0 ? "LINK IN PROFILE" : "NO LINK IN PROFILE"
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
                            institutionValue={twitterResult.tweets}
                        />
                        <Divider mt="md" mb="md" />
                        <SmStatRow
                            title='Average likes per tweet'
                            countryValue={countryTwitterResults.averageLikes}
                            institutionValue={twitterResult.averageLikes}
                        />
                        <Divider mt="md" mb="md" />
                        <SmStatRow
                            title='Average interaction per tweet'
                            countryValue={countryTwitterResults.averageInteraction}
                            institutionValue={twitterResult.averageInteraction}
                        />
                        <Divider mt="md" mb="md" />
                        <SmStatRow
                            title='Average retweets per tweet'
                            countryValue={countryTwitterResults.averageRetweets}
                            institutionValue={twitterResult.averageRetweets}
                        />
                    </Card.Section>
                </Card>

            </SimpleGrid>
        </Box>
    )
}

export default SmTwitterSection