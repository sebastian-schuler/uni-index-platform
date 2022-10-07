import { Card, createStyles, Group, List, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconSchool } from '@tabler/icons'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { DetailedSubjectType } from '../../../lib/types/DetailedDatabaseTypes'
import { URL_SUBJECT } from '../../../lib/url-helper/urlConstants'
import { getLocalizedName, toLink } from '../../../lib/util/util'

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
        transition: "all .2s ease-in-out",
        height: "100%",

        '&:hover': {
            transform: "scale(1.05)",
        }
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },

    section: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        padding: theme.spacing.md,
    },

}));

interface Props {
    subjectType: DetailedSubjectType
}

const SubjectTypeCard: React.FC<Props> = ({ subjectType }: Props) => {

    const { classes, theme } = useStyles();
    const { lang } = useTranslation('common');

    const url = toLink(URL_SUBJECT, subjectType.url);

    return (
        <Link href={url} passHref>
            <Card component='a' withBorder radius="md" shadow={"sm"} className={classes.card}>

                <Card.Section className={classes.section}>
                    <Group position="apart" noWrap sx={{ alignItems: "start" }}>
                        <Stack spacing={theme.spacing.xs}>
                            <Text size="xl" color={theme.colors.brandGray[3]} weight={500} sx={{ lineHeight: 1 }}>
                                {getLocalizedName({ lang: lang, any: subjectType })}
                            </Text>
                        </Stack>
                    </Group>
                </Card.Section>

                <Card.Section className={classes.section}>
                    <Stack spacing={"sm"}>

                        <Group noWrap>
                            <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
                                <IconSchool size={18} />
                            </ThemeIcon>
                            <Text>{subjectType.subjectCount} Subject</Text>
                        </Group>

                    </Stack>
                </Card.Section>

            </Card>
        </Link>
    )
}

export default SubjectTypeCard