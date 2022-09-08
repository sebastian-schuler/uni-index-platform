import { Card, createStyles, Image, Text, Group, Box } from '@mantine/core'
import Link from 'next/link'
import path from 'path'
import React, { memo } from 'react'
import { PATH_PLACEHOLDER_IMAGES } from '../../../lib/urlConstants'

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
    },

    title: {
        display: 'block',
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xs / 2,
    },

    body: {
        padding: theme.spacing.md,
    },
}));

interface Props {
    link: string
    title: string
    headline: string
    subtext: string
    imgUrl: string
    colHeight: number
    disableLink?: boolean
}

const MediumAd: React.FC<Props> = ({ title, link, headline, subtext, imgUrl, colHeight, disableLink }: Props) => {

    const { classes } = useStyles();

    if (disableLink) {
        return (
            <Card component='div' withBorder radius="md" p={0} className={classes.card} title={title} >
                <Group noWrap spacing={0}>
                    <Box sx={{ width: "50%" }}>
                        <Image src={imgUrl || path.join(PATH_PLACEHOLDER_IMAGES, "460x140.png")} fit="cover" height={colHeight} />
                    </Box>
                    <div className={classes.body}>
                        <Text transform="uppercase" color="dimmed" weight={700} size="xs">
                            Germany
                        </Text>
                        <Text className={classes.title} mt="xs" mb="md">
                            {headline}
                        </Text>
                        <Group noWrap spacing="xs">
                            <Text size="xs">{subtext}</Text>
                        </Group>
                    </div>
                </Group>
            </Card>
        )
    }

    return (
        <Link href={link} passHref>
            <Card component='a' withBorder radius="md" p={0} className={classes.card} title={title} >
                <Group noWrap spacing={0}>
                    <Box sx={{ width: "50%" }}>
                        <Image src={imgUrl || path.join(PATH_PLACEHOLDER_IMAGES, "460x140.png")} fit="cover" height={colHeight} />
                    </Box>
                    <div className={classes.body}>
                        <Text transform="uppercase" color="dimmed" weight={700} size="xs">
                            Germany
                        </Text>
                        <Text className={classes.title} mt="xs" mb="md">
                            {headline}
                        </Text>
                        <Group noWrap spacing="xs">
                            <Text size="xs">{subtext}</Text>
                        </Group>
                    </div>
                </Group>
            </Card>
        </Link>
    )
}

export default memo(MediumAd)