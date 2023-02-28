import { Container, createStyles, Sx } from '@mantine/core';
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
    skipContainer?: boolean
    sx?: Sx
    id?: string
}

const ResponsiveContainer: React.FC<Props> = ({ children, paddingY, skipContainer, sx, id }: Props) => {

    const { classes } = useStyles();

    if (skipContainer) return (<>{children}</>);

    return (
        <Container id={id} size={"lg"} py={paddingY ? "xl" : undefined} className={classes.container} sx={sx}>
            {children}
        </Container >
    )
}

export default ResponsiveContainer