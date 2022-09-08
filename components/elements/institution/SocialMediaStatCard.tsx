import { createStyles, Group, Paper, Text, useMantineTheme } from '@mantine/core';
import {
    IconArrowDownRight, IconArrowUpRight, TablerIcon, IconArrowLeft
} from '@tabler/icons';


const useStyles = createStyles((theme) => ({
    root: {
        backgroundColor: theme.colors.light[0],
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
    icon: TablerIcon
}

const SocialMediaStatCard = ({ title, value, diff, icon }: Props) => {

    const theme = useMantineTheme();
    const Icon = icon;
    const { classes } = useStyles();
    const DiffIcon = diff > 0 ? IconArrowUpRight : (diff < 0 ? IconArrowDownRight : IconArrowLeft);

    return (
        <Paper withBorder p="md" radius="md" key={title} className={classes.root}>
            <Group position="apart">
                <Text size="xs" color="dimmed" className={classes.title}>
                    {title}
                </Text>
                <Icon className={classes.icon} size={22} stroke={1.5} />
            </Group>

            <Group align="flex-end" spacing="xs" mt={25}>
                <Text className={classes.value}>{value}</Text>
                <Text
                    color={diff > 0 ? 'teal' : (diff < 0 ? 'red' : 'gray')}
                    size="sm"
                    weight={500}
                    className={classes.diff}
                >
                    <span>{diff}%</span>
                    <DiffIcon size={16} stroke={1.5} />
                </Text>
            </Group>

            <Text size="xs" color="dimmed" mt={7}>
                Compared to average
            </Text>
        </Paper>
    )
}

export default SocialMediaStatCard