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
        padding: theme.spacing.md,
    },
}));

interface Props {
    title: string
    url: string
    icon: JSX.Element
    color: string
    textColor: string
    rating: number
}

const SocialMediaCategoryCard: React.FC<Props> = ({ title, url, icon, color, textColor, rating }: Props) => {

    const { classes, theme } = useStyles({ color: color });
    const { t, lang } = useTranslation('institution');

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

            <Card.Section className={classes.section}>
                <Text color='white'>{t('social-media.card-rating-label')}</Text>
                <div>
                    <Text component='span' color='white' size={'xl'}>{rating.toLocaleString(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    <Text component='span' color='white' size={'md'} ml={'sm'}>/ 10</Text>
                </div>
            </Card.Section>

        </Card>
    )
}

export default SocialMediaCategoryCard