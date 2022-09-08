import { Card, createStyles, Text } from '@mantine/core';
import Link from 'next/link';
import React, { memo } from 'react';

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
    colHeight: number
    disableLink?: boolean
}
const SmallAd: React.FC<Props> = ({ title, link, headline, subtext, colHeight, disableLink }: Props) => {

    const { classes } = useStyles();

    if (!disableLink) {
        return (
            <Link href={link} passHref>
                <Card component='a' withBorder radius="md" className={classes.card} title={title} sx={{ height: colHeight }}>

                    <Text className={classes.title} weight={500}>
                        {headline}
                    </Text>
                    <Text size="md" color="dimmed" lineClamp={4}>
                        {subtext}
                    </Text>

                </Card>
            </Link>
        )
    } else {
        return (
            <Card component='div' withBorder radius="md" className={classes.card} title={title} sx={{ height: colHeight }}>

                <Text className={classes.title} weight={500}>
                    {headline}
                </Text>
                <Text size="md" color="dimmed" lineClamp={4}>
                    {subtext}
                </Text>

            </Card>
        )
    }
}

export default memo(SmallAd)