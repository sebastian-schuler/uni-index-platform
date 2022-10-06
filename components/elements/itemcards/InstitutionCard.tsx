import { Anchor, Card, createStyles, Group, List, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core'
import { Subject, SubjectHasSubjectTypes, SubjectType } from '@prisma/client'
import { IconBuilding, IconCategory, IconSchool } from '@tabler/icons'
import Flags from 'country-flag-icons/react/3x2'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React, { memo } from 'react'
import { DetailedInstitution } from '../../../lib/types/DetailedDatabaseTypes'
import { getLocalizedName, toLink } from '../../../lib/util'
import SocialMediaIconLink from '../socialmedia/SmIconLink'

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
    paddingTop: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingLeft: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
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

  const youtubeLink = institution.InstitutionSocialMedia?.youtube_url;
  const facebookLink = institution.InstitutionSocialMedia?.facebook_url;
  const twitterLink = institution.InstitutionSocialMedia?.twitter_url;
  const instagramLink = institution.InstitutionSocialMedia?.instagram_url;

  const mainCountry = institution.City.State.Country;

  const url = toLink("institution", mainCountry?.url || "", institution.url);
  const cities = institution.InstitutionLocation.map(lc => lc.City);

  const { name, nameBrackets } = getBracketedName(getLocalizedName({ lang: lang, institution: institution }));

  // TODO count subject types
  const biggestSubjectTypes = getUniqueSubjectTypeCounts({ list: institution.Subject || [], lang: lang, itemCount: 3 });

  const Flag = Flags[mainCountry?.country_code || ""] || Flags["EU"];

  return (


    <Card withBorder radius="md" p="md" shadow={"sm"} className={classes.card}>

      <Card.Section className={classes.section}>
        <Group position="apart" noWrap sx={{ alignItems: "start" }} spacing="sm">

          <Stack spacing={theme.spacing.xs}>

            <Link href={url} passHref>
              <Anchor color={"brandOrange.5"}>
                <Text size="xl" color={theme.colors.brandGray[3]} weight={500} sx={{ lineHeight: 1 }}>
                  {name} <Text size={"xs"}>{nameBrackets}</Text>
                </Text>
              </Anchor>
            </Link>

            <Text sx={{ lineHeight: 1.2 }}>{institution.City.name}</Text>

            <Group spacing={"xs"}>
              {
                youtubeLink &&
                <SocialMediaIconLink type='youtube' url={youtubeLink} title={`Youtube channel of ${institution.name}`} gray />
              }
              {
                twitterLink &&
                <SocialMediaIconLink type='twitter' url={twitterLink} title={`Twitter profile of ${institution.name}`} gray />
              }
              {
                facebookLink &&
                <SocialMediaIconLink type='facebook' url={facebookLink} title={`Facebook profile of ${institution.name}`} gray />
              }
              {
                instagramLink &&
                <SocialMediaIconLink type='instagram' url={instagramLink} title={`Instagram profile of ${institution.name}`} gray />
              }
            </Group>
          </Stack>

          <Stack align={"center"} spacing={"sm"}>
            <Flag className={classes.flag} />
          </Stack>

        </Group>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Stack spacing={"sm"}>

          <Group noWrap>
            <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
              <IconBuilding size={18} />
            </ThemeIcon>
            <Text sx={{ lineHeight: 1.2 }}>{cities.length} campus location{cities.length > 1 ? "s" : ""}</Text>
          </Group>

          <Group noWrap>
            <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
              <IconSchool size={18} />
            </ThemeIcon>
            <Text sx={{ lineHeight: 1.2 }}>{institution._count.Subject} subjects</Text>
          </Group>

          <Group noWrap>
            <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
              <IconCategory size={18} />
            </ThemeIcon>
            <Text sx={{ lineHeight: 1.2 }}>{biggestSubjectTypes.join(", ")}</Text>
          </Group>

        </Stack>
      </Card.Section>

    </Card>
  )
}

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

const getBracketedName = (name: string) => {
  let newName = name;
  const nameBrackets = name.match(/\(.*\)/gi)?.[0] || "";
  if (nameBrackets !== "") newName = name.replace(nameBrackets, "").trim();
  return { name: newName, nameBrackets: nameBrackets };
}

export default memo(InstitutionCard);