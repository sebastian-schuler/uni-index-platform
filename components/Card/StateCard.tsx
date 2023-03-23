import { Card, createStyles, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconBuildingSkyscraper, IconSchool } from '@tabler/icons-react'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { StateCardData } from '../../lib/types/UiHelperTypes'
import CardTitle from '../Text/CardTitle'

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
    state: StateCardData
}

const StateCard: React.FC<Props> = ({ state }: Props) => {

    const { classes, theme } = useStyles();
    const { t } = useTranslation('common');

    return (
        <Card withBorder radius="md" p="md" shadow={"sm"} className={classes.card}>

            <Card.Section className={classes.section}>
                <CardTitle
                    href={state.url}
                    text={state.name}
                />
            </Card.Section>

            <Card.Section className={classes.section}>
                <Stack spacing={"sm"}>

                    <Group noWrap>
                        <ThemeIcon size={24} radius="xl">
                            <IconBuildingSkyscraper size={18} />
                        </ThemeIcon>
                        <Text>{t('card-state.label-cities', { count: state.cityCount })}</Text>
                    </Group>

                    <Group noWrap>
                        <ThemeIcon size={24} radius="xl">
                            <IconSchool size={18} />
                        </ThemeIcon>
                        <Text>{t('card-state.label-subjects', { count: state.subjectCount })}</Text>
                    </Group>

                </Stack>
            </Card.Section>

        </Card>
    )
}

export default StateCard