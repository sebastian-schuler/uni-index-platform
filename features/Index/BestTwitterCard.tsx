import { Card, CardSection, createStyles, SimpleGrid, Text, Title } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { SmBestCardMinified } from '../../lib/types/SocialMediaTypes'

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
    highestTwitter: SmBestCardMinified
}

const BestTwitterCard: React.FC<Props> = ({ highestTwitter }: Props) => {

    const { t } = useTranslation('index');
    const { classes, theme } = useStyles();

    if (highestTwitter.type !== 'twitter') return <></>;

    return (
        <Card component={Link} href={highestTwitter.Institution.url} withBorder radius="md" p="md" shadow={"sm"} className={classes.card}>
            <CardSection className={classes.section} px={"md"} pt={"lg"}>
                <Title order={5} mb={"xs"}>{t('social-media.best-tw.title')}</Title>
                <Text sx={{ lineHeight: 1.1 }}>
                    {highestTwitter.Institution.name}, {highestTwitter.Institution.countryName}
                </Text>
            </CardSection>
            <SimpleGrid cols={4}>
                <div>
                    <Text size="sm" weight="bold" color="dimmed" >{t('social-media.best-tw.followers')}</Text>
                    <Text>{highestTwitter.totalFollowers}</Text>
                </div>

                <div>
                    <Text size="sm" weight="bold" color="dimmed" >{t('social-media.best-tw.tweets')}</Text>
                    <Text>{highestTwitter.totalTweets}</Text>
                </div>

                <div>
                    <Text size="sm" weight="bold" color="dimmed" >{t('social-media.best-tw.retweets')}</Text>
                    <Text>{highestTwitter.avgRetweets.toFixed(3)}</Text>
                </div>

                <div>
                    <Text size="sm" weight="bold" color="dimmed" >{t('social-media.best-tw.likes')}</Text>
                    <Text>{highestTwitter.avgLikes.toFixed(3)}</Text>
                </div>
            </SimpleGrid>

        </Card>
    )
}

export default BestTwitterCard