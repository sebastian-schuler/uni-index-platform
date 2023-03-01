import { Anchor, Card, CardSection, createStyles, Group, SimpleGrid, Text, ThemeIcon, Stack } from '@mantine/core'
import { IconBrandTwitter, IconBrandYoutube } from '@tabler/icons-react'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import MantineLink from '../Link/MantineLink'
import CardTitle from '../Text/CardTitle'
import { SmBestCardMinified } from '../../lib/types/SocialMediaTypes'
import { URL_INSTITUTION, URL_INSTITUTION_SOCIALMEDIA, URL_LOCATION } from '../../lib/url-helper/urlConstants'
import { toLink } from '../../lib/util/util'

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
    cardData: SmBestCardMinified
}

const SocialMediaCard: React.FC<Props> = ({ cardData }: Props) => {

    const { t, lang } = useTranslation('index');
    const { classes } = useStyles({ type: cardData.type });

    const title = cardData.type === 'twitter' ? t('social-media.best-tw.title') : t('social-media.best-yt.title');
    const icon = cardData.type === 'twitter' ? <IconBrandTwitter size={32} /> : <IconBrandYoutube size={32} />;

    const socialMediaUrl = toLink(URL_INSTITUTION, cardData.Country.url, cardData.Institution.url, URL_INSTITUTION_SOCIALMEDIA);
    const institutionUrl = toLink(URL_INSTITUTION, cardData.Country.url, cardData.Institution.url);
    const countryUrl = toLink(URL_LOCATION, cardData.Country.url);

    let data = [];
    if (cardData.type === 'twitter') {
        data = [
            { text: t('social-media.best-tw.followers'), value: cardData.totalFollowers.toLocaleString(lang) },
            { text: t('social-media.best-tw.tweets'), value: cardData.totalTweets.toLocaleString(lang) },
            { text: t('social-media.best-tw.likes'), value: cardData.avgLikes.toLocaleString(lang, { maximumFractionDigits: 4 }) },
            { text: t('social-media.best-tw.retweets'), value: cardData.avgRetweets.toLocaleString(lang, { maximumFractionDigits: 4 }) },
        ];
    } else {
        data = [
            { text: t('social-media.best-yt.subs'), value: cardData.totalSubscribers.toLocaleString(lang) },
            { text: t('social-media.best-yt.videos'), value: cardData.totalVideos.toLocaleString(lang) },
            { text: t('social-media.best-yt.views'), value: cardData.avgViews.toLocaleString(lang, { maximumFractionDigits: 0 }) },
            { text: t('social-media.best-yt.comments'), value: cardData.avgComments.toLocaleString(lang, { maximumFractionDigits: 2 }) },
        ]
    }

    return (
        <Card withBorder shadow={"sm"} p={"md"} className={classes.card}>
            <CardSection className={classes.topSection}>
                <Group position='apart' noWrap>
                    <Stack spacing={'sm'}>
                        <CardTitle href={socialMediaUrl} text={title} />
                        <Text size={'lg'} lh={1}>
                            <Anchor component={Link} href={institutionUrl} lh={1}>{cardData.Institution.name}</Anchor>
                            {" | "}
                            <Anchor component={Link} href={countryUrl} lh={1}>{cardData.Country.name}</Anchor>
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