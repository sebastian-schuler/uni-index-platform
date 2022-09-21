import {
    Avatar, createStyles, Group, MediaQuery, Text, UnstyledButton, UnstyledButtonProps
} from '@mantine/core';

const useStyles = createStyles((theme) => ({
    user: {
        display: 'block',
        width: '100%',
        padding: theme.spacing.md,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.brandOrange[5],
        borderRadius: theme.radius.md,

        '&:hover': {
            backgroundColor: theme.fn.rgba(theme.colorScheme === 'dark' ? theme.colors.brandOrange[8] : theme.colors.light[0], 0.5),
        },
    },
}));

interface UserButtonProps extends UnstyledButtonProps {
    image?: string;
    email: string;
}
const UserButton = ({ image, email }: UserButtonProps) => {
    const { classes } = useStyles();

    return (
        <UnstyledButton className={classes.user} >
            <Group>
                <MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
                    <Avatar src={image} radius="xl" />
                </MediaQuery>
                <div style={{ flex: 1 }}>
                    {/* <Text size="sm" weight={500}>
                        {name}
                    </Text> */}
                    <Text color="dimmed" size="xs">
                        {email}
                    </Text>
                </div>
            </Group>
        </UnstyledButton>
    )
}

export default UserButton