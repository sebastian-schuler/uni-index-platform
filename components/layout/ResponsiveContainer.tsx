import { Box, Container, createStyles, Sx } from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme) => ({
    container: {
        paddingLeft: 0,
        paddingRight: 0,

        '@media (max-width: 1200px)': {
            paddingLeft: 64,
            paddingRight: 64,
        },

        '@media (max-width: 800px)': {
            paddingLeft: 54,
            paddingRight: 54,
        },

        '@media (max-width: 600px)': {
            paddingLeft: 32,
            paddingRight: 32,
        },

        '@media (max-width: 450px)': {
            paddingLeft: 16,
            paddingRight: 16,
        },
    },
}));

interface Props {
    children: React.ReactNode
    paddingY?: boolean
    sx?: Sx
}

const ResponsiveContainer: React.FC<Props> = ({ children, paddingY, sx }: Props) => {

    const { classes } = useStyles();

    return (
        <Container size={"lg"} py={paddingY ? 64 : 0} className={classes.container}>
            {children}
        </Container >
    )
}

export default ResponsiveContainer