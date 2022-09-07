import {
  Badge, Card, createStyles, Text
} from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React, { memo } from 'react'
import { DetailedInstitution } from '../../../lib/types/DetailedDatabaseTypes'
import { getLocalizedName, toLink } from '../../../lib/util'

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
  institution: DetailedInstitution
}

const InstitutionCard: React.FC<Props> = ({ institution }: Props) => {

  const { classes, cx, theme } = useStyles();
  const { lang } = useTranslation('common');

  // Get list of all countries this institute has locations in
  const countryList = institution.InstitutionLocation.map(location => location.City.State.Country);
  // Map to unique country ID
  const countryMap = new Map(countryList.map(country => [country.id, country]));
  // Count unique countries to array
  const countryCounts: [string, number][] = Object.entries(countryList.reduce((acc, o) => (acc[o.id] = (acc[o.id] || 0) + 1, acc), {}));
  // Get the country with the most locations
  const highestCountryCount = countryCounts.length > 0 ? countryCounts.reduce((a, b) => a > b ? a : b)[0] : null;
  // Get the object of the country with most locations
  const mainCountry = countryMap.get(highestCountryCount || "");

  const url = toLink("institution", mainCountry?.url, institution.url);

  const countryNames = Array.from(countryMap.values()).map(country => getLocalizedName({ lang: lang, dbTranslated: country }));

  return (
    <Link href={url} passHref>
      <Card component='a' withBorder radius="md" className={classes.card}>

        <Badge className={classes.rating} variant="outline">
          {countryNames.join(", ")}
        </Badge>

        <Text className={classes.title} weight={500}>
          {institution.name}
        </Text>

        <Text size="md" color="dimmed" lineClamp={4}>
          n courses
        </Text>

      </Card>
    </Link>
  )
}

export default memo(InstitutionCard)