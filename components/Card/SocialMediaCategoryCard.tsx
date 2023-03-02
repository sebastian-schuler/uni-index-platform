import { Card, createStyles, Group, Stack, Text } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'

type StyleParams = {
    color: string
}

const useStyles = createStyles((theme, _params: StyleParams) => ({
    card: {
        backgroundColor: _params.color,
        height: "100%",

        '&:hover': {
            backgroundColor: theme.fn.lighten(_params.color, 0.2),
        }
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
}

const SocialMediaCategoryCard: React.FC<Props> = ({ title, url, icon, color, textColor }: Props) => {

    const { classes, theme } = useStyles({ color: color });
    const { t } = useTranslation('institution');

    return (
        <Card component={Link} href={url} withBorder radius="md" shadow={"sm"} className={classes.card}>

            <Card.Section className={classes.section}>
                <Group position="apart" noWrap sx={{ alignItems: "start" }}>
                    <Stack spacing={theme.spacing.xs}>
                        <Text size="xl" color={textColor} weight={500} sx={{ lineHeight: 1 }}>{title}</Text>
                    </Stack>
                    {icon}
                </Group>
            </Card.Section>

        </Card>
    )
}

export default SocialMediaCategoryCard