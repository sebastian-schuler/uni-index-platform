import { Anchor, Card, createStyles, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconBuilding, IconSchool } from '@tabler/icons-react';
import Link from 'next/link';
import React, { memo } from 'react';

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
    description: string
    colHeight: number
    adType: string
    disableLink?: boolean
}
const SmallAd: React.FC<Props> = ({ title, link, headline, subtext, description, colHeight, adType, disableLink }: Props) => {

    const { classes, theme } = useStyles();

    const AdCard = (
        <Card component={"div"} withBorder radius="md" shadow="sm" className={classes.card} title={title} sx={{ height: colHeight }}>

            <Card.Section className={classes.section}>
                <Group position="apart" noWrap sx={{ alignItems: "start" }}>
                    <Stack spacing={theme.spacing.xs}>
                        <Text size="xl" color={theme.colors.brandGray[3]} weight={500} sx={{ lineHeight: 1 }}>
                            {headline}
                        </Text>
                        <Text sx={{ lineHeight: 1.2 }}>{subtext}</Text>
                    </Stack>
                    <ThemeIcon color={theme.colors.brandOrange[5]} size={"lg"} radius="xl" className={classes.icon}>
                        {
                            adType === "subject" ? <IconSchool size={24} /> : <IconBuilding size={22} />
                        }
                    </ThemeIcon>
                </Group>
            </Card.Section>

            <Card.Section px={theme.spacing.md} py={theme.spacing.sm} sx={{ flex: 1 }}>

                <Text size="md" color="dimmed" lineClamp={3} sx={{ flex: 1, lineBreak: "normal", overflowWrap: "break-word", wordBreak: "break-word" }}>
                    {description}
                </Text>

            </Card.Section>

        </Card>
    )

    if (disableLink) return AdCard;

    return (
        <Anchor component={Link} href={link}>
            {AdCard}
        </Anchor>
    )
}

export default memo(SmallAd)