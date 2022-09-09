import { Card, createStyles, Image, Text } from '@mantine/core';
import Link from 'next/link';
import React, { memo } from 'react';
import { PATH_PLACEHOLDER_IMAGES } from '../../../lib/urlConstants';
import { toLink } from '../../../lib/util';

const useStyles = createStyles((theme) => ({
    card: {
        position: 'relative',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
    },

    title: {
        display: 'block',
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xs / 2,
    },
}));

interface Props {
    link: string
    title: string
    headline: string
    subtext: string
    imgUrl?: string
    description: string
    colHeight: number
    disableLink?: boolean
}

const LargeAd: React.FC<Props> = ({ title, link, headline, subtext, imgUrl, description, colHeight, disableLink }: Props) => {

    const { classes } = useStyles();
    if (disableLink) {
        return (
            <Card component='div' withBorder radius="md" shadow="sm" className={classes.card} title={title} sx={{height: colHeight}}>
                <Card.Section>
                    <Image src={imgUrl || toLink(PATH_PLACEHOLDER_IMAGES, "460x140.png")} fit="cover" height={130} />
                </Card.Section>
                <Text className={classes.title} weight={500}>
                    {headline}
                </Text>
                <Text size="md" color="dimmed" lineClamp={4}>
                    {subtext}
                </Text>
                <Text size="md" color="dimmed" lineClamp={4}>
                    {description}
                </Text>
            </Card>
        )
    }

    return (
        <Link href={link} passHref>
            <Card component='a' withBorder radius="md" shadow="sm" className={classes.card} title={title} sx={{height: colHeight}}>

                <Card.Section>
                    <Image src={imgUrl || toLink(PATH_PLACEHOLDER_IMAGES, "460x140.png")} fit="cover" height={130} />
                </Card.Section>

                <Text className={classes.title} weight={500}>
                    {headline}
                </Text>

                <Text size="md" color="dimmed" lineClamp={4}>
                    {subtext}
                </Text>
                <Text size="md" color="dimmed" lineClamp={4}>
                    {description}
                </Text>

            </Card>
        </Link>
    )
}

export default memo(LargeAd)