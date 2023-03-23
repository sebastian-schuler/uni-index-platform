import { Card, createStyles, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconBuilding } from '@tabler/icons-react'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import { CityCardData } from '../../lib/types/UiHelperTypes'
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

type Props = {
    city: CityCardData
}

const CityCard: React.FC<Props> = ({ city }: Props) => {

    const { classes, theme } = useStyles();
    const { t } = useTranslation('common');

    return (
        <Card withBorder radius="md" shadow={"sm"} className={classes.card}>

            <Card.Section className={classes.section}>
                <Group position="apart" noWrap sx={{ alignItems: "start" }}>
                    <Stack spacing={theme.spacing.sm}>
                        <CardTitle
                            href={city.fullUrl}
                            text={city.name}
                        />
                        <Text color={theme.colors.brandGray[2]} sx={{ lineHeight: 1.2 }}>
                            {t('card-city.label-areacodes', { count: city.areaCodes.length, codes: city.areaCodes.join(", ") })}
                        </Text>
                    </Stack>
                </Group>
            </Card.Section>

            <Card.Section className={classes.section}>
                <Stack spacing={"sm"}>

                    <Group noWrap>
                        <ThemeIcon color={theme.colors.brandOrange[5]} size={24} radius="xl">
                            <IconBuilding size={18} />
                        </ThemeIcon>
                        <Text>{t('card-city.label-universities', { count: city.institutionCount })}</Text>
                    </Group>

                </Stack>
            </Card.Section>

        </Card>
    )
}

export default CityCard