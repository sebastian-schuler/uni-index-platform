import React from 'react'
import { createStyles, Text } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    root: {
        display: 'flex',
        padding: theme.spacing.lg,
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.colors.gray[3]}`,
        

        [theme.fn.smallerThan('sm')]: {
            flexDirection: 'column',
        },
    },

    title: {
        // color: theme.white,
        textTransform: 'uppercase',
        fontWeight: 700,
        fontSize: theme.fontSizes.sm,
    },

    count: {
        // color: theme.white,
        fontSize: 32,
        lineHeight: 1,
        fontWeight: 700,
        marginBottom: theme.spacing.sm,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },

    description: {
        // color: theme.colors[theme.primaryColor][0],
        fontSize: theme.fontSizes.sm,
        marginTop: 5,
    },

    stat: {
        flex: 1,

        '& + &': {
            paddingLeft: theme.spacing.xl,
            marginLeft: theme.spacing.xl,
            borderLeft: `1px solid ${theme.colors.gray[3]}`,

            [theme.fn.smallerThan('sm')]: {
                paddingLeft: 0,
                marginLeft: 0,
                borderLeft: 0,
                paddingTop: theme.spacing.md,
                marginTop: theme.spacing.md,
                borderTop: `1px solid ${theme.colors.gray[3]}`,
            },
        },
    },
}));

interface GroupedStatsProps {
    data: { title: string; stats: string; description: string }[];
}
const GroupedStats: React.FC<GroupedStatsProps> = ({ data }: GroupedStatsProps) => {
    const { classes } = useStyles();
    const stats = data.map((stat,i) => (
        <div key={stat.title+i} className={classes.stat}>
            <Text className={classes.count}>{stat.stats}</Text>
            <Text className={classes.title}>{stat.title}</Text>
            <Text className={classes.description}>{stat.description}</Text>
        </div>
    ));
    return <div className={classes.root}>{stats}</div>;
}

export default GroupedStats