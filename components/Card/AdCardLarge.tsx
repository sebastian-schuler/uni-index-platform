import { Card, createStyles, Group, Image, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconBuilding, IconSchool } from '@tabler/icons-react';
import Link from 'next/link';
import React, { memo } from 'react';
import { LARGE_AD_HEIGHT } from '../../features/Ads/AdContainer';

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
        height: "100%",
    },

    title: {
        display: 'block',
        marginTop: theme.spacing.md,
        marginBottom: `calc(${theme.spacing.xs} / 2)`,
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
    subtext: string
    imageId?: string | null
    imageExtension?: string | null
    imageFilePath?: string
    description: string
    colHeight: number
    adType: string
    disableLink?: boolean
}

const AdCardLarge: React.FC<Props> = ({ link, title, subtext, imageId, imageFilePath, imageExtension, description, colHeight, adType, disableLink }: Props) => {

    const { classes, theme } = useStyles();

    const AdCard = (
        <Card component={"div"} withBorder radius="md" shadow="sm" className={classes.card} title={title} sx={{ height: colHeight }}>

            <Card.Section>
                <Image src={imageFilePath || `/api/image/${imageId}?ext=${imageExtension}`} fit="cover" height={LARGE_AD_HEIGHT / 2} alt={""} />
            </Card.Section>

            <Card.Section className={classes.section}>
                <Group position="apart" noWrap sx={{ alignItems: "start" }}>
                    <Stack spacing={theme.spacing.xs}>
                        <Text size="xl" color={theme.colors.brandGray[3]} weight={500} sx={{ lineHeight: 1 }}>
                            {title}
                        </Text>
                        <Text sx={{ lineHeight: 1.2 }}>{subtext}</Text>
                    </Stack>
                    <ThemeIcon size={"xl"} radius="xl" className={classes.icon}>
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
        <Link href={link}>
            {AdCard}
        </Link>
    )
}

export default memo(AdCardLarge)