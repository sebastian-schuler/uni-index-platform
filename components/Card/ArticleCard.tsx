import { Card, createStyles, Group, Image, Text } from '@mantine/core'
import dayjs from 'dayjs'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { ArticleCardData } from '../../lib/types/UiHelperTypes'
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
    data: ArticleCardData
}

const ArticleCard: React.FC<Props> = ({ data }: Props) => {

    const { classes, theme } = useStyles();
    const { t } = useTranslation('common');

    return (
        <Card withBorder radius="md" shadow={"sm"} className={classes.card}>

            <Card.Section>
                <Image src={data.imageUrl} fit="cover" height={200} alt={""} />
            </Card.Section>

            <Card.Section className={classes.section}>
                <CardTitle href={data.url} text={data.title} />
                <Group>
                    <Text>{dayjs(data.date).format('DD/MM/YYYY')}</Text>
                </Group>
            </Card.Section>

            <Group noWrap>
                <Text>{data.excerpt}</Text>
            </Group>

        </Card>
    )
}

export default ArticleCard