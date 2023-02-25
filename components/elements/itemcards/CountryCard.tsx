import { Card, createStyles, Group, Image, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconBuilding, IconSchool } from '@tabler/icons-react'
import Flags from 'country-flag-icons/react/3x2'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { CountryCardData } from '../../../lib/types/UiHelperTypes'

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
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
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
    data: CountryCardData
}

const CountryCard: React.FC<Props> = ({ data }: Props) => {

    const { classes, theme } = useStyles();

    const { t } = useTranslation('common');
    const langContent = {
        universityLabel: t('card-label-universities', { count: data.institutionCount }),
        courseLabel: t('card-label-courses', { count: data.subjectCount })
    }

    const Flag = Flags[data.countryCode || ""] || Flags["EU"];

    return (
        <Card component={Link} href={data.url} p="lg" radius="md" shadow={"sm"} className={classes.card}>
            <Card.Section>
                <Image src={data.imgSrc} alt={data.name} height={180} />
            </Card.Section>

            <Card.Section className={classes.section}>
                <Group position="apart" noWrap sx={{ alignItems: "start" }}>
                    <Stack spacing={theme.spacing.xs}>
                        <Text size="xl" color={theme.colors.brandGray[3]} weight={500} sx={{ lineHeight: 1 }}>
                            {data.name}
                        </Text>
                    </Stack>
                    <Flag className={classes.flag} />
                </Group>
            </Card.Section>

            <Card.Section className={classes.section}>
                <Stack spacing={"sm"}>

                    <Group noWrap>
                        <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
                            <IconBuilding size={18} />
                        </ThemeIcon>
                        <Text>{data.institutionCount} Universities</Text>
                    </Group>

                    <Group noWrap>
                        <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
                            <IconSchool size={18} />
                        </ThemeIcon>
                        <Text>{data.subjectCount} Subjects</Text>
                    </Group>

                </Stack>
            </Card.Section>

        </Card>
    )
}

export default CountryCard