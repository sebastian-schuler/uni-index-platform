import { Anchor, Card, CardSection, Group, SimpleGrid, Stack, Text, ThemeIcon, createStyles } from '@mantine/core'
import { IconBrandTwitter, IconBrandYoutube } from '@tabler/icons-react'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { BestSocialMediaItem } from '../../lib/types/social-media/SocialMediaSimplifiedTypes'
import MantineLink from '../Link/MantineLink'
import CardTitle from '../Text/CardTitle'

interface StyleProps {
    type: 'twitter' | 'youtube'
}

const useStyles = createStyles((theme, _params: StyleProps) => ({

    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
    },

    topSection: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },

    bottomSection: {
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        padding: theme.spacing.md,
        marginTop: theme.spacing.sm,
    },

    icon: {
        backgroundColor: _params.type === "twitter" ? theme.colors.twitter[5] : theme.colors.youtube[5],
    }

}));

interface Props {
    cardData: BestSocialMediaItem
}

const SocialMediaCard: React.FC<Props> = ({ cardData }: Props) => {

    const { t, lang } = useTranslation('index');
    const { classes } = useStyles({ type: cardData.type });

    const title = cardData.type === 'twitter' ? t('social-media.best-tw.title') : t('social-media.best-yt.title');
    const icon = cardData.type === 'twitter' ? <IconBrandTwitter size={32} /> : <IconBrandYoutube size={32} />;

    let data = [];
    let url = ''
    if (cardData.type === 'twitter') {
        url = cardData.meta.url; // TODO Check if urls correct
        data = [
            { text: t('social-media.best-tw.followers'), value: cardData.meta.metrics.followerCount.toLocaleString(lang) },
            { text: t('social-media.best-tw.tweets'), value: cardData.meta.metrics.tweetCount.toLocaleString(lang) },
            { text: t('social-media.best-tw.likes'), value: cardData.raw.averages.avgLikes.toLocaleString(lang, { maximumFractionDigits: 4 }) },
            { text: t('social-media.best-tw.retweets'), value: cardData.raw.averages.avgRetweets.toLocaleString(lang, { maximumFractionDigits: 4 }) },
        ];
    } else {
        url = cardData.meta.channelName;
        data = [
            { text: t('social-media.best-yt.subs'), value: cardData.meta.metrics.subscriberCount.toLocaleString(lang) },
            { text: t('social-media.best-yt.videos'), value: cardData.meta.metrics.videoCount.toLocaleString(lang) },
            { text: t('social-media.best-yt.views'), value: cardData.raw.averages.avgViews.toLocaleString(lang, { maximumFractionDigits: 0 }) },
            { text: t('social-media.best-yt.comments'), value: cardData.raw.averages.avgComments.toLocaleString(lang, { maximumFractionDigits: 2 }) },
        ]
    }

    return (
        <Card withBorder shadow={"sm"} p={"md"} className={classes.card}>
            <CardSection className={classes.topSection}>
                <Group position='apart' noWrap>
                    <Stack spacing={'sm'}>
                        <CardTitle href={cardData.institution.href} text={title} />
                        <Text size={'md'} lh={1}>
                            <Anchor component={Link} href={cardData.institution.href} lh={1}>{cardData.institution.name}</Anchor>
                            {" | "}
                            <Anchor component={Link} href={cardData.country.href} lh={1}>{cardData.country.name}</Anchor>
                        </Text>
                    </Stack>
                    <ThemeIcon size={"lg"} className={classes.icon} >
                        {icon}
                    </ThemeIcon>
                </Group>
            </CardSection>
            <SimpleGrid cols={2}>
                {
                    data.map((item, index) => (
                        <div key={index}>
                            <Text color="dimmed" >{item.text}</Text>
                            <Text size={'xl'}>{item.value}</Text>
                        </div>
                    ))
                }
            </SimpleGrid>
            <CardSection className={classes.bottomSection}>
                {cardData.href &&
                    <MantineLink type='external' url={cardData.href}>{cardData.href}</MantineLink>
                }
            </CardSection>
        </Card>
    )
}

export default SocialMediaCard