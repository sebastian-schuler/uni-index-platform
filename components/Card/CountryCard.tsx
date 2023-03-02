import { Card, createStyles, Group, Image, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconBuilding, IconSchool } from '@tabler/icons-react'
import Flags from 'country-flag-icons/react/3x2'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { CountryCardData } from '../../lib/types/UiHelperTypes'
import CardTitle from '../Text/CardTitle'

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
        height: "100%",
    },

    section: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        padding: theme.spacing.md,
    },

    flag: {
        width: "2rem",
        opacity: 0.75,
    }

}));

type Props = {
    country: CountryCardData
}

const CountryCard: React.FC<Props> = ({ country }: Props) => {

    const { classes, theme } = useStyles();
    const { t, lang } = useTranslation('common');
    const Flag = Flags[country.countryCode || ""] || Flags["EU"];

    return (
        <Card radius="md" shadow={"sm"} className={classes.card}>
            <Card.Section>
                <Image src={country.imgSrc} alt={country.name} fit="cover" height={180} />
            </Card.Section>

            <Card.Section className={classes.section}>
                <Group position="apart" noWrap sx={{ alignItems: "start" }}>
                    <CardTitle
                        href={country.url}
                        text={country.name}
                    />
                    <Flag className={classes.flag} />
                </Group>
            </Card.Section>

            <Card.Section className={classes.section}>
                <Stack spacing={"sm"}>

                    <Group noWrap>
                        <ThemeIcon size={"md"} radius="xl">
                            <IconBuilding size={18} />
                        </ThemeIcon>
                        <Text>{t('card-country.label-institutions', { count: country.institutionCount, countStr: country.institutionCount.toLocaleString(lang) })}</Text>
                    </Group>

                    <Group noWrap>
                        <ThemeIcon size={"md"} radius="xl">
                            <IconSchool size={18} />
                        </ThemeIcon>
                        <Text>{t('card-country.label-subjects', { count: country.subjectCount, countStr: country.subjectCount.toLocaleString(lang) })}</Text>
                    </Group>

                </Stack>
            </Card.Section>

        </Card>
    )
}

export default CountryCard