import {
    Anchor, Box, Button,
    Center, createStyles, Group, Paper, Text, TextInput, Title, useMantineTheme
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useState } from 'react';

const useStyles = createStyles((theme) => ({
    title: {
        fontSize: 26,
        fontWeight: 900,
    },

    controls: {
        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column-reverse',
        },
    },

    control: {
        [theme.fn.smallerThan('xs')]: {
            width: '100%',
            textAlign: 'center',
        },
    }
}));

interface Props {
    setShowForgotPassword: (showForgotPassword: boolean) => void;
}
const ForgotPassword = ({ setShowForgotPassword }: Props) => {
    const theme = useMantineTheme();
    const { classes } = useStyles();

    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

    return (
        <>
            <Title className={classes.title} align="center">
                Forgot your password?
            </Title>
            <Text color="dimmed" size="sm" align="center">
                Enter your email to get a reset link
            </Text>

            <Paper withBorder shadow="md" p={30} radius="md" mt="xl" sx={{ maxWidth: 400, backgroundColor: theme.colors.light[0] }}>
                <TextInput
                    label="Your email"
                    placeholder="name@uni.de"
                    required value={forgotPasswordEmail}
                    onChange={(event) => setForgotPasswordEmail(event.currentTarget.value)}
                />
                <Group position="apart" mt="lg" className={classes.controls}>
                    <Anchor component='a' color="dimmed" size="sm" className={classes.control} onClick={(e) => {
                        e.preventDefault();
                        setShowForgotPassword(false);
                    }}>
                        <Center inline>
                            <IconArrowLeft size={12} stroke={1.5} />
                            <Box ml={5}>Back to login page</Box>
                        </Center>
                    </Anchor>
                    <Button radius={"md"} className={classes.control}>Reset password</Button>
                </Group>
            </Paper>
        </>
    )
}

export default ForgotPassword