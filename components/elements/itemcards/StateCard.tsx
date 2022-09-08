import { Card, createStyles, Text } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { DetailedState } from '../../../lib/types/DetailedDatabaseTypes'
import { URL_LOCATION } from '../../../lib/urlConstants'
import { getLocalizedName, toLink } from '../../../lib/util'

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
    state: DetailedState
}

const StateCard: React.FC<Props> = ({ state }: Props) => {

    const { classes } = useStyles();
    const { lang } = useTranslation('common');

    const url = toLink(URL_LOCATION, state.Country.url, state.url);
    const cities = state.City.map(({ name }) => name).join(', ');

    return (
        <Link href={url} passHref>
            <Card component='a' withBorder radius="md" className={classes.card}>

                <Text className={classes.title} weight={500}>
                    {getLocalizedName({ lang: lang, state: state })}
                </Text>

                <Text size="md" color="dimmed" lineClamp={4}>
                    Total Cities: {state._count.City}
                </Text>

                <Text size="md" color="dimmed" lineClamp={4}>
                    Most popular: {cities}
                </Text>

            </Card>
        </Link>
    )
}

export default StateCard