import { Card, createStyles, Group, Image, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconBuilding, IconSchool } from '@tabler/icons';
import Link from 'next/link';
import React, { memo } from 'react';
import { PATH_PLACEHOLDER_IMAGES } from '../../../lib/url-helper/urlConstants';
import { toLink } from '../../../lib/util/util';
import { LARGE_AD_HEIGHT } from '../../container/AdList';

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
        transition: "all .2s ease-in-out",
        height: "100%",

        '&:hover': {
            transform: "scale(1.05)",
        }
    },

    title: {
        display: 'block',
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xs / 2,
    },

    section: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        padding: theme.spacing.md,
    },

    icon: {
        opacity: 0.75,
    }
}));

interface Props {
    link: string
    title: string
    headline: string
    subtext: string
    imgUrl?: string
    description: string
    colHeight: number
    adType: string
    disableLink?: boolean
}

const LargeAd: React.FC<Props> = ({ link, title, headline, subtext, imgUrl, description, colHeight, adType, disableLink }: Props) => {

    const { classes, theme } = useStyles();

    const AdCard = (
        <Card component={disableLink ? "div" : "a"} withBorder radius="md" shadow="sm" className={classes.card} title={title} sx={{ height: colHeight }}>

            <Card.Section>
                <Image src={imgUrl || toLink(PATH_PLACEHOLDER_IMAGES, "460x140.png")} fit="cover" height={LARGE_AD_HEIGHT / 2} alt={""} />
            </Card.Section>

            <Card.Section className={classes.section}>
                <Group position="apart" noWrap sx={{ alignItems: "start" }}>
                    <Stack spacing={theme.spacing.xs}>
                        <Text size="xl" color={theme.colors.brandGray[3]} weight={500} sx={{ lineHeight: 1 }}>
                            {headline}
                        </Text>
                        <Text sx={{ lineHeight: 1.2 }}>{subtext}</Text>
                    </Stack>
                    <ThemeIcon color={theme.colors.brandOrange[5]} size={"xl"} radius="xl" className={classes.icon}>
                        {
                            adType === "subject" ? <IconSchool size={32} /> : <IconBuilding size={28} />
                        }
                    </ThemeIcon>
                </Group>
            </Card.Section>

            <Card.Section px={theme.spacing.md} py={theme.spacing.sm}>

                <Text size="md" color="dimmed" lineClamp={4} sx={{ lineBreak: "normal", overflowWrap: "break-word", wordBreak: "break-word" }}>
                    {description}
                </Text>

            </Card.Section>

        </Card>
    );

    if (disableLink) return AdCard;

    return (
        <Link href={link} passHref>
            {AdCard}
        </Link>
    )
}

export default memo(LargeAd)