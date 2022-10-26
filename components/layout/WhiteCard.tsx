import { Card, createStyles, Sx } from '@mantine/core'
import React from 'react'

const useStyles = createStyles((theme) => ({

    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
    },

}));

interface Props {
    children: React.ReactNode
    sx?: Sx
}

const WhiteCard: React.FC<Props> = ({ children, sx }: Props) => {

    const { classes } = useStyles();

    return (
        <Card withBorder radius="md" p="lg" shadow={"sm"} className={classes.card} sx={sx}>
            {children}
        </Card>
    )
}

export default WhiteCard