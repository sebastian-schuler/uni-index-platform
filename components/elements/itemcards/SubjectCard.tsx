import { Anchor, Card, createStyles, Grid, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { Country } from '@prisma/client'
import { IconAward, IconCalendar, IconCategory } from '@tabler/icons'
import Flags from 'country-flag-icons/react/3x2'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { SubjectCardData } from '../../../lib/types/UiHelperTypes'

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

  titleContainer: {
    display: 'flex',

  },

  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },

  flag: {
    width: "30px",
    opacity: 0.75,
  }

}));

type Props = {
  data: SubjectCardData
  country: Country | undefined
}

const SubjectCard: React.FC<Props> = ({ data, country }: Props) => {

  const { classes, theme } = useStyles();
  const { t } = useTranslation('common');

  const Flag = Flags[country?.country_code || ""] || Flags["EU"];
  
  return (
    <Card withBorder radius="md" p="md" shadow={"sm"} className={classes.card}>

      {/* Top section */}
      <Card.Section className={classes.section}>
        <Grid>

          {/* Header: Subjectname, Institution, City */}
          <Grid.Col span={10}>
            <Link href={data.fullUrl} passHref>
              <Anchor>
                <Text size="lg" color={theme.colors.brandGray[3]} weight={500} sx={{ lineHeight: 1, wordBreak: "break-word" }}>
                  {data.name}
                </Text>
              </Anchor>
            </Link>
            <Text sx={{ lineHeight: 1.2, wordBreak: "break-all", lineBreak: "anywhere" }}>
              {t('card-subject.subtitle', { institution: data.Institution.name, city: data.City.name })}
            </Text>
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
                    <Link href={category.url} passHref>
                      <Anchor>{category.name}</Anchor>
                    </Link>
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