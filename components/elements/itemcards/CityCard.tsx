import { Badge, Card, createStyles, Text } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { URL_LOCATION } from '../../../data/urlConstants'
import { DetailedCity } from '../../../lib/types/DetailedDatabaseTypes'
import { toLink } from '../../../lib/util'


const useStyles = createStyles((theme) => ({
    card: {
        position: 'relative',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
    },

    rating: {
        position: 'absolute',
        top: theme.spacing.xs,
        right: theme.spacing.xs + 2,
        pointerEvents: 'none',
    },

    title: {
        display: 'block',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xs / 2,
    },

    action: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        ...theme.fn.hover({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        }),
    },

    footer: {
        marginTop: theme.spacing.md,
    },
}));

type Props = {
    city: DetailedCity
}

const CityCard: React.FC<Props> = ({ city }: Props) => {

    const { classes, cx, theme } = useStyles();

    const { t } = useTranslation('common');
    const langContent = {
        universityLabel: t('card-label-universities', { count: city._count.InstitutionLocation }),
    }

    return (
        <Link href={toLink(URL_LOCATION, city.State.Country.url, city.State.url, city.url)} passHref>
            <Card component='a' withBorder radius="md" className={classes.card}>

                <Badge className={classes.rating} variant="outline">
                    {city.State.url}
                </Badge>

                <Text className={classes.title} weight={500}>
                    {city.name}
                </Text>

                <Text size="md" color="dimmed" lineClamp={4}>
                    {langContent.universityLabel}
                </Text>

            </Card>
        </Link>
    )
}

export default CityCard