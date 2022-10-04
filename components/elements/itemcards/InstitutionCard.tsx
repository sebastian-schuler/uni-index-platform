import { Card, createStyles, Group, List, Stack, Text, ThemeIcon } from '@mantine/core'
import { Subject, SubjectHasSubjectTypes, SubjectType } from '@prisma/client'
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

  // TODO count subject types
  const biggestSubjectTypes = getUniqueSubjectTypeCounts({ list: institution.Subject, lang: lang, itemCount: 3 });
  // const biggestSubjectTypes: string[] = [];

  const Flag = Flags[mainCountry?.country_code || ""] || Flags["EU"];

  return (
    <Link href={url} passHref>

      <Card component='a' withBorder radius="md" p="md" shadow={"sm"} className={classes.card}>

        <Card.Section className={classes.section}>
          <Group position="apart" noWrap sx={{ alignItems: "start" }}>
            <Stack spacing={theme.spacing.xs}>
              <Text size="xl" color={theme.colors.brandGray[3]} weight={500} sx={{ lineHeight: 1 }}>
                {institution.name}
              </Text>
              <Text sx={{ lineHeight: 1.2 }}>{institution.City.name}</Text>
            </Stack>
            <Stack>
              <Flag className={classes.flag} />
              <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
                <IconBuilding size={18} />
              </ThemeIcon>
            </Stack>
          </Group>
        </Card.Section>

        <Card.Section className={classes.section}>
          <Stack spacing={"sm"}>

            <Group noWrap>
              <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
                <IconBuilding size={18} />
              </ThemeIcon>
              <Text>{cities.length} campus location{cities.length > 1 ? "s" : ""}</Text>
            </Group>

            <Group noWrap>
              <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
                <IconSchool size={18} />
              </ThemeIcon>
              <Text>{institution.Subject.length} subjects</Text>
            </Group>

            <Group noWrap>
              <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
                <IconCategory size={18} />
              </ThemeIcon>
              <Text>{biggestSubjectTypes.join(", ")}</Text>
            </Group>

          </Stack>
        </Card.Section>

      </Card>
    </Link>
  )
}

// const getUniqueCountryCounts = (countries: Country[]): [string, number][] => {
//   return Object.entries(countries.reduce((acc, o) => (acc[o.id] = (acc[o.id] || 0) + 1, acc), {}));
// }

interface LargestSubjectTypeProps {

  list: (
    (Subject & {
      SubjectHasSubjectTypes: (SubjectHasSubjectTypes & {
        SubjectType: SubjectType;
      })[];
    })[]
  );
  lang: string;
  itemCount: number;

}

const getUniqueSubjectTypeCounts = ({ list, lang, itemCount }: LargestSubjectTypeProps): string[] => {

  // Find all types of subjects
  const typeList: SubjectType[] = [];
  for (const item of list) {
    for (const type of item.SubjectHasSubjectTypes) {
      typeList.push(type.SubjectType);
    }
  }

  // Count types
  const counts: Map<number, number> = new Map();
  for (const item of typeList) {
    if (counts.has(item.id)) {
      counts.set(item.id, (counts.get(item.id) || 1) + 1);
    } else {
      counts.set(item.id, 1);
    }
  }

  // Sort by count
  const sorted = [...counts].map(([id, count]) => ({ id, count })).sort((a, b) => b.count - a.count);

  // Get the top 3
  const result: string[] = [];
  for (let i = 0; i < itemCount && i < sorted.length; i++) {
    result.push(getLocalizedName({ lang: lang, any: typeList.find(type => type.id === sorted[i].id) }));
  }

  return [...result];
}

// const getMainCountry = (countryCounts: [string, number][], countries: Map<string, Country>): Country | undefined => {
//   const countryName = countryCounts.length > 0 ? countryCounts.reduce((a, b) => a > b ? a : b)[0] : null;
//   return countries.get(countryName || "");
// }

export default memo(InstitutionCard)