import { Card, createStyles, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconBuilding } from '@tabler/icons-react'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { DetailedCity } from '../../lib/types/DetailedDatabaseTypes'
import { URL_LOCATION } from '../../lib/url-helper/urlConstants'
import { getLocalizedName, toLink } from '../../lib/util/util'

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

type Props = {
    city: DetailedCity
}

const CityCard: React.FC<Props> = ({ city }: Props) => {

    const { classes, theme } = useStyles();

    const { t } = useTranslation('common');
    const langContent = {
        universityLabel: t('card-city.label-universities', { count: city._count.InstitutionLocation }),
    }

    return (
        <Card component={Link} href={toLink(URL_LOCATION, city.State.Country.url, city.State.url, city.url)} withBorder radius="md" shadow={"sm"} className={classes.card}>

            <Card.Section className={classes.section}>
                <Group position="apart" noWrap sx={{ alignItems: "start" }}>
                    <Stack spacing={theme.spacing.xs}>
                        <Text size="xl" color={theme.colors.brandGray[3]} weight={500} sx={{ lineHeight: 1 }}>
                            {city.name}
                        </Text>
                        <Text size={"sm"}>
                            {getLocalizedName({ lang: 'en', state: city.State })}
                        </Text>
                    </Stack>
                </Group>
            </Card.Section>

            <Card.Section className={classes.section}>
                <Stack spacing={"sm"}>

                    <Group noWrap>
                        <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
                            <IconBuilding size={18} />
                        </ThemeIcon>
                        <Text>{langContent.universityLabel}</Text>
                    </Group>

                </Stack>
            </Card.Section>

        </Card>
    )
}

export default CityCard