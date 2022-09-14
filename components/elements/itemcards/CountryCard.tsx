import { Card, createStyles, Group, Image, List, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconBuilding, IconSchool } from '@tabler/icons'
import Flags from 'country-flag-icons/react/3x2'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { DetailedCountry } from '../../../lib/types/DetailedDatabaseTypes'
import { PATH_COUNTRY_IMAGES, URL_INSTITUTION, URL_LOCATION } from '../../../lib/url-helper/urlConstants'
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
    country: DetailedCountry
    linkType: "location" | "institution";
}

const CountryCard: React.FC<Props> = ({ country, linkType }: Props) => {

    const { classes, theme } = useStyles();

    const { t } = useTranslation('common');
    const langContent = {
        universityLabel: t('card-label-universities', { count: country.institutionCount }),
        courseLabel: t('card-label-courses', { count: country.subjectCount })
    }
    const name = getLocalizedName({ lang: 'en', dbTranslated: country });
    const link = linkType === 'location' ? toLink(URL_LOCATION, country.url) : toLink(URL_INSTITUTION, country.url);

    const Flag = Flags[country.country_code || ""] || Flags["EU"];

    return (
        <Link href={link} passHref>

            <Card component='a' withBorder p="lg" radius="md" shadow={"sm"} className={classes.card}>
                <Card.Section>
                    <Image src={toLink(PATH_COUNTRY_IMAGES, country.url + ".jpg")} alt={name} height={180} />
                </Card.Section>


                <Card.Section className={classes.section}>
                    <Group position="apart" noWrap sx={{ alignItems: "start" }}>
                        <Stack spacing={theme.spacing.xs}>
                            <Text size="xl" color={theme.colors.brandGray[3]} weight={500} sx={{ lineHeight: 1 }}>
                                {name}
                            </Text>
                        </Stack>
                        <Flag className={classes.flag} />
                    </Group>
                </Card.Section>

                <Card.Section className={classes.section}>
                    <List
                        spacing="sm"
                        size="md"
                        center
                    >
                        <List.Item
                            icon={
                                <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
                                    <IconBuilding size={18} />
                                </ThemeIcon>
                            }
                        >{country.institutionCount} Universities</List.Item>
                        <List.Item
                            icon={
                                <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
                                    <IconSchool size={18} />
                                </ThemeIcon>
                            }
                        >{country.subjectCount} Subjects</List.Item>
                    </List>
                </Card.Section>

            </Card>
            {/* <Card component='a' withBorder radius="md" className={classes.card}>

                <Card.Section>
                    <Image src={toLink(PATH_COUNTRY_IMAGES, country.url + ".jpg")} fit="cover" height={130} />
                </Card.Section>

                <Text className={classes.title} weight={500}>
                    {name}
                </Text>

                <Text size="md" color="dimmed" lineClamp={4}>
                    {langContent.universityLabel}
                </Text>

                <Text size="md" color="dimmed" lineClamp={4}>
                    {langContent.courseLabel}
                </Text>

            </Card> */}
        </Link>
    )
}

export default CountryCard