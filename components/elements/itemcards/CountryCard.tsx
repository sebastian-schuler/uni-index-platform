import { Card, createStyles, Image, Text } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { PATH_COUNTRY_IMAGES, URL_INSTITUTION, URL_LOCATION } from '../../../lib/urlConstants'
import { DetailedCountry } from '../../../lib/types/DetailedDatabaseTypes'
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

type Props = {
    country: DetailedCountry
    linkType: "location" | "institution";
}

const CountryCard: React.FC<Props> = ({ country, linkType }: Props) => {

    const { classes } = useStyles();

    const { t } = useTranslation('common');
    const langContent = {
        universityLabel: t('card-label-universities', { count: country.institutionCount }),
        courseLabel: t('card-label-courses', { count: country.subjectCount })
    }
    const name = getLocalizedName({ lang: 'en', dbTranslated: country });
    const link = linkType === 'location' ? toLink(URL_LOCATION, country.url) : toLink(URL_INSTITUTION, country.url);

    return (
        <Link href={link} passHref>
            <Card component='a' withBorder radius="md" className={classes.card}>

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

            </Card>
        </Link>
    )
}

export default CountryCard