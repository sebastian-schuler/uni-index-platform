import { Card, createStyles, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconSchool } from '@tabler/icons-react'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { CategoryCardData } from '../../lib/types/UiHelperTypes'

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
        height: "100%",
    },

    section: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        padding: theme.spacing.md,
    },

}));

interface Props {
    subjectType: CategoryCardData
}

const CategoryCard: React.FC<Props> = ({ subjectType }: Props) => {

    const { classes, theme } = useStyles();
    const { t } = useTranslation('common');

    return (
        <Card component={Link} href={subjectType.url} withBorder radius="md" shadow={"sm"} className={classes.card}>

            <Card.Section className={classes.section}>
                <Group position="apart" noWrap sx={{ alignItems: "start" }}>
                    <Stack spacing={theme.spacing.xs}>
                        <Text size="xl" color={theme.colors.brandGray[3]} weight={500} sx={{ lineHeight: 1 }}>{subjectType.name}</Text>
                    </Stack>
                </Group>
            </Card.Section>

            <Card.Section className={classes.section}>
                <Stack spacing={"sm"}>

                    <Group noWrap>
                        <ThemeIcon size={24} radius="xl">
                            <IconSchool size={18} />
                        </ThemeIcon>
                        <Text>{t('card-category.label-subjects', { count: subjectType.subjectCount })}</Text>
                    </Group>

                </Stack>
            </Card.Section>

        </Card>
    )
}

export default CategoryCard