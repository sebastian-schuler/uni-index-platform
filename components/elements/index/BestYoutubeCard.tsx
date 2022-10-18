import { Card, CardSection, createStyles, SimpleGrid, Text, Title } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { SmRankingEntry, SocialMediaDBEntry, TotalScore, TwitterResults, YoutubeResults } from '../../../lib/types/SocialMediaTypes'
import { getLocalizedName } from '../../../lib/util/util'
import WhiteCard from '../../layout/WhiteCard'

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
        transition: "all .2s ease-in-out",
        height: "100%",

        '&:hover': {
            transform: "scale(1.05)",
        }
    },

    section: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },

}));

interface Props {
    highestYoutube: SocialMediaDBEntry
}

const BestYoutubeCard: React.FC<Props> = ({ highestYoutube }: Props) => {

    const { t, lang } = useTranslation('common');
    const { classes, theme } = useStyles();

    const totalScore = JSON.parse(highestYoutube.total_score) as TotalScore;
    const results = highestYoutube.youtube_scores ? JSON.parse(highestYoutube.youtube_scores) as YoutubeResults : null;

    return (
        <Card withBorder radius="md" p="md" shadow={"sm"} className={classes.card}>
            <CardSection className={classes.section}>
                <Title order={5}>Best Youtube profile</Title>
                <Text sx={{ lineHeight: 1.1 }}>
                    {highestYoutube.Institution.name}, {getLocalizedName({ lang: lang, dbTranslated: highestYoutube.Institution.City.State.Country })}
                </Text>
            </CardSection>
            <SimpleGrid cols={4}>
                <div>
                    <Text size={"sm"} weight={"bold"} color="dimmed">Total<br/>Subscribers</Text>
                    <Text>{results?.subs}</Text>
                </div>

                <div>
                    <Text size={"sm"} weight={"bold"} color="dimmed">Total<br/>Videos</Text>
                    <Text>{results?.videos}</Text>
                </div>

                <div>
                    <Text size={"sm"} weight={"bold"} color="dimmed">Average<br/>views</Text>
                    <Text>{results?.averageViews.toFixed(0)}</Text>
                </div>

                <div>
                    <Text size={"sm"} weight={"bold"} color="dimmed">Avgerage<br/>comments</Text>
                    <Text>{results?.averageComments.toFixed(2)}</Text>
                </div>
            </SimpleGrid>

        </Card>
    )
}

export default BestYoutubeCard