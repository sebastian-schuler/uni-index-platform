import { Card, createStyles, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconSchool } from '@tabler/icons-react'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { CategoryCardData } from '../../lib/types/UiHelperTypes'
import CardTitle from '../Text/CardTitle'

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
        height: "100%",
    },

    section: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        lineHeight: 1.8,
    },

}));

interface Props {
    subjectType: CategoryCardData
}

const CategoryCard: React.FC<Props> = ({ subjectType }: Props) => {

    const { classes, theme } = useStyles();
    const { t } = useTranslation('common');

    return (
        <Card withBorder radius="md" shadow={"sm"} className={classes.card}>

            <Card.Section className={classes.section}>
                <CardTitle href={subjectType.url} text={subjectType.name} />
            </Card.Section>

            <Group noWrap>
                <ThemeIcon size={24} radius="xl">
                    <IconSchool size={18} />
                </ThemeIcon>
                <Text>{t('card-category.label-subjects', { count: subjectType.subjectCount })}</Text>
            </Group>

        </Card>
    )
}

export default CategoryCard