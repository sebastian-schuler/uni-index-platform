import { Card, CardSection, createStyles, SimpleGrid, Space, Text, Title } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { SmBestCardMinified, SocialMediaDBEntry, TotalScore, YoutubeProfile } from '../../../lib/types/SocialMediaTypes'
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
    highestYoutube: SmBestCardMinified
}

const BestYoutubeCard: React.FC<Props> = ({ highestYoutube }: Props) => {

    const { t, lang } = useTranslation('common');
    const { classes, theme } = useStyles();

    if (highestYoutube.type !== 'youtube') return <></>;

    return (
        <Link href={highestYoutube.Institution.url} passHref>
            <Card component='a' withBorder radius="md" p="md" shadow={"sm"} className={classes.card}>
                <CardSection className={classes.section} px={"md"} pt={"lg"}>
                    <Title order={5} mb={"xs"}>Best Youtube profile</Title>
                    <Text sx={{ lineHeight: 1.1 }}>
                        {highestYoutube.Institution.name}, {highestYoutube.Institution.countryName}
                    </Text>
                </CardSection>
                <SimpleGrid cols={4}>
                    <div>
                        <Text size={"sm"} weight={"bold"} color="dimmed">Total<br />Subscribers</Text>
                        <Text>{highestYoutube.totalSubscribers}</Text>
                    </div>

                    <div>
                        <Text size={"sm"} weight={"bold"} color="dimmed">Total<br />Videos</Text>
                        <Text>{highestYoutube.totalVideos}</Text>
                    </div>

                    <div>
                        <Text size={"sm"} weight={"bold"} color="dimmed">Average<br />views</Text>
                        <Text>{highestYoutube.avgViews.toFixed(0)}</Text>
                    </div>

                    <div>
                        <Text size={"sm"} weight={"bold"} color="dimmed">Avgerage<br />comments</Text>
                        <Text>{highestYoutube.avgComments.toFixed(2)}</Text>
                    </div>
                </SimpleGrid>

            </Card>
        </Link>
    )
}

export default BestYoutubeCard