import { Box, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({

    root: {
        position: 'fixed',
        bottom: theme.spacing.xs,
        left: theme.spacing.xs,
        fontSize: 11,
        userSelect: 'none',
        zIndex: 99999
    },

}));

const DevMessagePopover = () => {

    const { classes } = useStyles();

    return (
        <Box className={classes.root}>Work in progress</Box>
    )
}

export default DevMessagePopover