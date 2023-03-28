import { Anchor, Card, createStyles, Grid, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { country } from '@prisma/client'
import { IconAward, IconCalendar, IconCategory } from '@tabler/icons-react'
import Flags from 'country-flag-icons/react/3x2'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { SubjectCardData } from '../../lib/types/UiHelperTypes'
import { URL_CATEGORY, URL_INSTITUTION, URL_INSTITUTION_SUBJECTS } from '../../lib/url-helper/urlConstants'
import { toLink } from '../../lib/util/util'
import CardTitle from '../Text/CardTitle'

const useStyles = createStyles((theme) => ({

  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
    height: "100%",
  },

  section: {
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
    padding: theme.spacing.md,
  },

  flag: {
    width: "30px",
    opacity: 0.75,
  }

}));

type Props = {
  data: SubjectCardData
  country: country
}

const SubjectCard: React.FC<Props> = ({ data, country }: Props) => {

  const { classes, theme } = useStyles();
  const { t } = useTranslation('common');

  const subjectUrl = toLink(URL_INSTITUTION, country.url, data.institution.url, URL_INSTITUTION_SUBJECTS, data.url);
  const institutionUrl = toLink(URL_INSTITUTION, country.url, data.institution.url);

  const code = country?.country_code || "EU";
  let Flag: any = undefined;
  if (Object.keys(Flags).includes(code)) {
    // @ts-ignore
    Flag = Flags[code] || Flags["EU"];
  }

  return (
    <Card withBorder radius="md" p="md" shadow={"sm"} className={classes.card}>

      {/* Top section */}
      <Card.Section className={classes.section}>
        <Grid>

          {/* Header: Subjectname, Institution, City */}
          <Grid.Col span={10}>
            <Stack spacing={theme.spacing.xs}>
              <CardTitle href={subjectUrl} text={data.name} lang={country?.country_code}/>
              <Text lh={1.2}>
                <Anchor lh={1.1} component={Link} href={institutionUrl}>{data.institution.name}</Anchor>
                {' | '}
                <Anchor lh={1.1} component={Link} href={data.city.fullUrl}>{data.city.name}</Anchor>
              </Text>
            </Stack>
          </Grid.Col>

          {/* Header: Country Flag */}
          <Grid.Col span={2}>
            <div className={classes.flag}>
              <Flag />
            </div>
          </Grid.Col>

        </Grid>
      </Card.Section>

      {/* Bottom section */}
      <Card.Section className={classes.section}>
        <Stack spacing={"sm"}>

          <Group noWrap>
            <ThemeIcon size={24} radius="xl">
              <IconCategory size={18} />
            </ThemeIcon>
            <Text sx={{ lineHeight: 1.2 }}>
              {
                data.categories.map((category, i) => (
                  <React.Fragment key={i}>
                    <Anchor component={Link} href={toLink(URL_CATEGORY, category.url)} >{category.name}</Anchor>
                    {i < data.categories.length - 1 && ', '}
                  </React.Fragment>
                ))
              }
            </Text>
          </Group>

          <Group noWrap>
            <ThemeIcon size={24} radius="xl">
              <IconAward size={18} />
            </ThemeIcon>
            <Text sx={{ lineHeight: 1.2 }}>{data.degree}</Text>
          </Group>

          <Group noWrap>
            <ThemeIcon size={24} radius="xl">
              <IconCalendar size={18} />
            </ThemeIcon>
            <Text sx={{ lineHeight: 1.2 }}>{data.duration} {data.durationType}</Text>
          </Group>

        </Stack>
      </Card.Section>

    </Card>
  );
}

export default SubjectCard;