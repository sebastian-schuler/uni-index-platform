import { Card, createStyles, Text } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { DetailedSubjectType } from '../../../lib/types/DetailedDatabaseTypes'
import { URL_SUBJECT } from '../../../lib/urlConstants'
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

interface Props {
    subjectType: DetailedSubjectType
}

const SubjectTypeCard: React.FC<Props> = ({ subjectType }: Props) => {

    const { classes } = useStyles();
    const { lang } = useTranslation('common');

    const url = toLink(URL_SUBJECT, subjectType.url);

    return (
        <Link href={url} passHref>
            <Card component='a' withBorder radius="md" className={classes.card}>

                {/* <Card.Section>
                <Image src={toLink(PATH_COUNTRY_IMAGES, country.url + ".jpg")} fit="cover" height={130} />
            </Card.Section> */}

                <Text className={classes.title} weight={500}>
                    {getLocalizedName({ lang: lang, any: subjectType })}
                </Text>

                <Text size="md" color="dimmed" lineClamp={4}>
                    Total Subjects: {subjectType.subjectCount}
                </Text>

                <Text size="md" color="dimmed" lineClamp={4}>
                    Most popular:
                </Text>

            </Card>
        </Link>
    )
}

export default SubjectTypeCard