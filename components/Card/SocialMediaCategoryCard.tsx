import { Card, createStyles, Group, Stack, Text } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
        height: "100%",
    },

    section: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        padding: theme.spacing.md,
    },
}));

interface Props {
    title: string
    url: string
    icon: JSX.Element
    color: string
    textColor: string
    lastUpdate: string
}

const SocialMediaCategoryCard: React.FC<Props> = ({ title, url, icon, color, textColor, lastUpdate }: Props) => {

    const { classes, theme } = useStyles();
    const { t } = useTranslation('institution');

    return (
        <Card component={Link} href={url} withBorder radius="md" shadow={"sm"} className={classes.card} sx={{ backgroundColor: color }}>

            <Card.Section className={classes.section}>
                <Group position="apart" noWrap sx={{ alignItems: "start" }}>
                    <Stack spacing={theme.spacing.xs}>
                        <Text size="xl" color={textColor} weight={500} sx={{ lineHeight: 1 }}>{title}</Text>
                    </Stack>
                    {icon}
                </Group>
            </Card.Section>

            <Card.Section className={classes.section}>
                <Stack spacing={"sm"}>
                    <Text color={textColor}>{t('social-media.card-lastupdate', { date: lastUpdate })}</Text>
                </Stack>
            </Card.Section>

        </Card>
    )
}

export default SocialMediaCategoryCard