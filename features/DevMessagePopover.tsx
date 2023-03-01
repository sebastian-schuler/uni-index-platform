import { Box, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({

    root: {
        position: 'fixed',
        bottom: theme.spacing.md,
        right: theme.spacing.lg,
        fontSize: 18,
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