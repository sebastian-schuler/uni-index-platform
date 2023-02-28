import { Card, createStyles, Group, Text } from '@mantine/core';
import {
    IconArrowDownRight, IconArrowLeft, IconArrowUpRight
} from '@tabler/icons-react';
import useTranslation from 'next-translate/useTranslation';
import { memo } from 'react';
import { formatNumber } from '../../lib/util/formattingUtil';
import { addTablerIconProps } from '../../lib/util/uiUtil';

const useStyles = createStyles((theme) => ({
    root: {
        backgroundColor: theme.colors.light[0],
        border: `1px solid ${theme.colors.gray[2]}`,
    },

    value: {
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 1,
    },

    diff: {
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
    },

    icon: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
    },

    title: {
        fontSize: theme.fontSizes.sm,
        fontWeight: 700,
        textTransform: 'uppercase',
    },
}));

interface Props {
    title: string
    value: number
    diff: number
    icon: JSX.Element
}

const SmStatCard = ({ title, value, diff, icon }: Props) => {

    const { lang } = useTranslation();
    const { classes } = useStyles();
    const DiffIcon = diff > 0 ? IconArrowUpRight : (diff < 0 ? IconArrowDownRight : IconArrowLeft);

    const iconWithProps = addTablerIconProps(icon, { size: 22, stroke: 1.5, className: classes.icon });

    return (
        <Card p="md" radius="sm" shadow="xs" key={title} className={classes.root}>
            <Group position="apart">
                <Text size="xs" color="dimmed" className={classes.title}>
                    {title}
                </Text>
                {iconWithProps}
            </Group>

            <Group align="flex-end" spacing="xs" mt={25}>
                <Text className={classes.value}>{formatNumber(value, lang, value > 0 ? 2 : 0)}%</Text>
                <Text
                    color={diff > 0 ? 'teal' : (diff < 0 ? 'red' : 'gray')}
                    size="sm"
                    weight={500}
                    className={classes.diff}
                >
                    <span>{formatNumber(diff, lang, 2)}%</span>
                    <DiffIcon size={16} stroke={1.5} />
                </Text>
            </Group>

            <Text size="xs" color="dimmed" mt={7}>
                Compared to average
            </Text>
        </Card>
    )
}

export default memo(SmStatCard)