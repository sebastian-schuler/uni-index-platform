import {
  Badge, Card, createStyles, Text
} from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { URL_INSTITUTION } from '../../../data/urlConstants'
import { DetailedSubject } from '../../../lib/types/DetailedDatabaseTypes'
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
  subject: DetailedSubject
}

const SubjectCard: React.FC<Props> = ({ subject }: Props) => {

  const { classes, cx, theme } = useStyles();
  const { lang } = useTranslation('common');

  const url = toLink(URL_INSTITUTION, subject.City.State.Country.url, subject.Institution.url, subject.url);
  const country = getLocalizedName({ lang: lang, dbTranslated: subject.City.State.Country });

  return (
    <Link href={url} passHref>
      <Card component='a' withBorder radius="md" className={classes.card}>

        <Badge className={classes.rating} variant="outline">
          {country}
        </Badge>

        <Text className={classes.title} weight={500}>
          <Text>{subject.name}</Text>{subject.Institution.name}
        </Text>

        <Text size="md" color="dimmed" lineClamp={4}>
          {subject.degree},{"\n"}{subject.semester_count} Semester
        </Text>

      </Card>
    </Link>
  );
}

export default SubjectCard