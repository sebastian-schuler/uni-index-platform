import { Card, createStyles, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconBuilding, IconSchool } from '@tabler/icons-react';
import Link from 'next/link';
import React, { memo } from 'react';

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
    description: string
    colHeight: number
    adType: string
    disableLink?: boolean
}
const AdCardSmall: React.FC<Props> = ({ title, link, subtext, description, colHeight, adType, disableLink }: Props) => {

    const { classes, theme } = useStyles();

    const AdCard = (
        <Card component={"div"} withBorder radius="md" shadow="sm" className={classes.card} title={title} sx={{ height: colHeight }}>

            <Card.Section className={classes.section}>
                <Group position="apart" noWrap sx={{ alignItems: "start" }}>
                    <Stack spacing={theme.spacing.xs}>
                        <Text size="lg" color={theme.colors.brandGray[3]} weight={500} sx={{ lineHeight: 1 }}>
                            {title}
                        </Text>
                        <Text sx={{ lineHeight: 1.2 }}>{subtext}</Text>
                    </Stack>
                    <ThemeIcon size={"md"} radius="xl" className={classes.icon}>
                        {
                            adType === "subject" ? <IconSchool size={18} /> : <IconBuilding size={16} />
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
        <Link href={link}>
            {AdCard}
        </Link>
    )
}

export default memo(AdCardSmall)