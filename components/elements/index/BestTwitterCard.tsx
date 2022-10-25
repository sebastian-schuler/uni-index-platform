import { Card, CardSection, createStyles, SimpleGrid, Text, Title } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { SocialMediaDBEntry, TotalScore, TwitterProfile } from '../../../lib/types/SocialMediaTypes'
import { URL_INSTITUTION, URL_INSTITUTION_SOCIALMEDIA } from '../../../lib/url-helper/urlConstants'
import { getLocalizedName, toLink } from '../../../lib/util/util'

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
    highestTwitter: SocialMediaDBEntry
}

const BestTwitterCard: React.FC<Props> = ({ highestTwitter }: Props) => {

    const { t, lang } = useTranslation('common');
    const { classes, theme } = useStyles();

    const totalScore = JSON.parse(highestTwitter.total_score) as TotalScore;
    const results = highestTwitter.twitter_profile ? JSON.parse(highestTwitter.twitter_profile) as TwitterProfile : null;
    const url = toLink(URL_INSTITUTION, highestTwitter.Institution.City.State.Country.url, highestTwitter.Institution.url, URL_INSTITUTION_SOCIALMEDIA);

    return (
        <Link href={url} passHref>
            <Card component='a' withBorder radius="md" p="md" shadow={"sm"} className={classes.card}>
                <CardSection className={classes.section}>
                    <Title order={5}>Best Twitter profile</Title>
                    <Text sx={{ lineHeight: 1.1 }}>
                        {highestTwitter.Institution.name}, {getLocalizedName({ lang: lang, dbTranslated: highestTwitter.Institution.City.State.Country })}
                    </Text>
                </CardSection>
                <SimpleGrid cols={4}>
                    <div>
                        <Text size={"sm"} weight={"bold"} color="dimmed">Total<br />followers</Text>
                        <Text>{results?.followers}</Text>
                    </div>

                    <div>
                        <Text size={"sm"} weight={"bold"} color="dimmed">Total<br />tweets</Text>
                        <Text>{results?.tweets}</Text>
                    </div>

                    <div>
                        <Text size={"sm"} weight={"bold"} color="dimmed">Average<br />interaction</Text>
                        <Text>{results?.averageInteraction.toFixed(3)}</Text>
                    </div>

                    <div>
                        <Text size={"sm"} weight={"bold"} color="dimmed">Avgerage<br />likes</Text>
                        <Text>{results?.averageLikes.toFixed(3)}</Text>
                    </div>
                </SimpleGrid>

            </Card>
        </Link>
    )
}

export default BestTwitterCard