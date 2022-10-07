import { Card, createStyles } from '@mantine/core'
import React from 'react'

const useStyles = createStyles((theme) => ({

    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
    },

}));

interface Props {
    children: React.ReactNode
}

const WhiteCard: React.FC<Props> = ({ children }: Props) => {

    const { classes } = useStyles();

    return (
        <Card withBorder radius="md" p="md" shadow={"sm"} className={classes.card}>
            {children}
        </Card>
    )
}

export default WhiteCard