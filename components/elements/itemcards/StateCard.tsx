import { Card, createStyles, Group, List, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconBuildingSkyscraper, IconSchool } from '@tabler/icons'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { DetailedState } from '../../../lib/types/DetailedDatabaseTypes'
import { URL_LOCATION } from '../../../lib/url-helper/urlConstants'
import { getLocalizedName, toLink } from '../../../lib/util'

const useStyles = createStyles((theme) => ({

    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
        transition: "all .2s ease-in-out",
        height: "100%",

        '&:hover': {
            transform: "scale(1.05)",
        }
    },

    section: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        padding: theme.spacing.md,
    },

    label: {
        textTransform: 'uppercase',
        fontSize: theme.fontSizes.xs,
        fontWeight: 700,
    },

}));

interface Props {
    state: DetailedState
}

const StateCard: React.FC<Props> = ({ state }: Props) => {

    const { classes, theme } = useStyles();
    const { lang } = useTranslation('common');

    const url = toLink(URL_LOCATION, state.Country.url, state.url);
    // const cities = state.City.map(({ name }) => name).join(', ');

    return (
        <Link href={url} passHref>
            <Card component='a' withBorder radius="md" p="md" shadow={"sm"} className={classes.card}>

                <Card.Section className={classes.section}>
                    <Group position="apart" noWrap sx={{ alignItems: "start" }}>
                        <Stack spacing={theme.spacing.xs}>
                            <Text size="lg" color={theme.colors.brandGray[3]} weight={500} sx={{ lineHeight: 1 }}>
                                {getLocalizedName({ lang: lang, state: state })}
                            </Text>
                        </Stack>
                    </Group>
                </Card.Section>

                <Card.Section className={classes.section}>
                    <Stack spacing={"sm"}>

                        <Group noWrap>
                            <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
                                <IconBuildingSkyscraper size={18} />
                            </ThemeIcon>
                            <Text>{state._count.City} cities with universities.</Text>
                        </Group>

                        <Group noWrap>
                            <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
                                <IconSchool size={18} />
                            </ThemeIcon>
                            <Text>{ } subjects to study</Text>
                        </Group>

                    </Stack>
                </Card.Section>

            </Card>
        </Link>
    )
}

export default StateCard