import { Card, createStyles, Group, List, Stack, Text, ThemeIcon } from '@mantine/core'
import { SubjectType } from '@prisma/client'
import { IconBuilding, IconCategory, IconSchool } from '@tabler/icons'
import Flags from 'country-flag-icons/react/3x2'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React, { memo } from 'react'
import { DetailedInstitution } from '../../../lib/types/DetailedDatabaseTypes'
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

  like: {
    color: theme.colors.red[6],
  },

  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },

  flag: {
    width: "2rem",
    opacity: 0.75,
  }

}));

type Props = {
  institution: DetailedInstitution
}

const InstitutionCard: React.FC<Props> = ({ institution }: Props) => {

  const { classes, theme } = useStyles();
  const { lang } = useTranslation('common');

  // Get list of all countries this institute has locations in
  // const countryList = institution.InstitutionLocation.map(location => location.City.State.Country);
  // const countryMap = new Map(countryList.map(country => [country.id, country]));
  // Count countries
  // const countryCounts = getUniqueCountryCounts(countryList);
  // Get the country with the most locations
  
  const mainCountry = institution.City.State.Country;

  const url = toLink("institution", mainCountry?.url || "", institution.url);
  const cities = institution.InstitutionLocation.map(lc => lc.City);

  const biggestSubjectTypes = getUniqueSubjectTypeCounts(institution.Subject.map(s => s.SubjectType), lang, 3)

  const Flag = Flags[mainCountry?.country_code || ""] || Flags["EU"];

  return (
    <Link href={url} passHref>

      <Card component='a' withBorder radius="md" p="md" className={classes.card}>

        <Card.Section className={classes.section}>
          <Group position="apart" noWrap sx={{ alignItems: "start" }}>
            <Stack spacing={theme.spacing.xs}>
              <Text size="xl" color={theme.colors.brandGray[3]} weight={500} sx={{lineHeight: 1}}>
                {institution.name}
              </Text>
              <Text sx={{lineHeight: 1.2}}>{institution.City.name}</Text>
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
            >{cities.length} campus location{cities.length > 1 ? "s" : ""}</List.Item>
            <List.Item
              icon={
                <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
                  <IconSchool size={18} />
                </ThemeIcon>
              }
            >{institution.Subject.length} subjects</List.Item>
            <List.Item
              icon={
                <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
                  <IconCategory size={18} />
                </ThemeIcon>
              }
            >{biggestSubjectTypes.join(", ")}</List.Item>
          </List>
        </Card.Section>


      </Card>
    </Link>
  )
}

// const getUniqueCountryCounts = (countries: Country[]): [string, number][] => {
//   return Object.entries(countries.reduce((acc, o) => (acc[o.id] = (acc[o.id] || 0) + 1, acc), {}));
// }

const getUniqueSubjectTypeCounts = (subjectTypes: SubjectType[], lang: string, itemCount: number): string[] => {

  const map = subjectTypes.reduce((acc, o) => {
    const localized = getLocalizedName({ lang: lang, any: o });
    return (acc[localized] = (acc[localized] || 0) + 1, acc)
  }, {});

  const arr: [string, number][] = Object.entries(map);
  arr.sort((a, b) => b[1] - a[1])

  return arr.map(val => val[0]).slice(0, itemCount);
}

// const getMainCountry = (countryCounts: [string, number][], countries: Map<string, Country>): Country | undefined => {
//   const countryName = countryCounts.length > 0 ? countryCounts.reduce((a, b) => a > b ? a : b)[0] : null;
//   return countries.get(countryName || "");
// }

export default memo(InstitutionCard)