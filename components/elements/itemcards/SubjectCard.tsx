import { Card, createStyles, Group, List, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconAward, IconCalendar, IconCategory } from '@tabler/icons'
import Flags from 'country-flag-icons/react/3x2'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { DetailedSubject } from '../../../lib/types/DetailedDatabaseTypes'
import { URL_INSTITUTION } from '../../../lib/url-helper/urlConstants'
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
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
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
  subject: DetailedSubject
}

const SubjectCard: React.FC<Props> = ({ subject }: Props) => {

  const { classes, theme } = useStyles();
  const { lang } = useTranslation('common');

  const url = toLink(URL_INSTITUTION, subject.City.State.Country.url, subject.Institution.url, subject.url);
  // const country = getLocalizedName({ lang: lang, dbTranslated: subject.City.State.Country });

  const Flag = Flags[subject.City.State.Country.country_code || ""] || Flags["EU"];

  // Append subject type names to string
  const subjectTypeNames = subject.SubjectHasSubjectTypes.map((type) => getLocalizedName({ lang: lang, any: type.SubjectType }));
  let subjectType = "";
  for (let i = 0; i < 2 && i < subjectTypeNames.length; i++) {
    subjectType += subjectTypeNames[i] + " / ";
  }
  subjectType = subjectType.slice(0, -3);

  return (
    <Link href={url} passHref>
      <Card component='a' withBorder radius="md" p="md" shadow={"sm"} className={classes.card}>

        <Card.Section className={classes.section}>
          <Group position="apart" noWrap sx={{ alignItems: "start" }}>
            <Stack spacing={theme.spacing.xs}>
              <Text size="xl" color={theme.colors.brandGray[3]} weight={500} sx={{ lineHeight: 1 }}>
                {subject.name}
              </Text>
              <Text sx={{ lineHeight: 1.2 }}>{subject.Institution.name} | Campus {subject.City.name}</Text>
            </Stack>
            <Flag className={classes.flag} />
          </Group>

        </Card.Section>

        <Card.Section className={classes.section}>
          <Stack spacing={"sm"}>

            <Group noWrap>
              <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
                <IconCategory size={18} />
              </ThemeIcon>
              <Text>{subjectType}</Text>
            </Group>

            <Group noWrap>
              <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
                <IconAward size={18} />
              </ThemeIcon>
              <Text>{subject.degree}</Text>
            </Group>

            <Group noWrap>
              <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
                <IconCalendar size={18} />
              </ThemeIcon>
              <Text>{subject.duration} {subject.duration_type}</Text>
            </Group>

          </Stack>
        </Card.Section>


      </Card>
    </Link>
  );
}

export default SubjectCard