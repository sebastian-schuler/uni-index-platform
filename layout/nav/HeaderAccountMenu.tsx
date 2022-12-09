import { ActionIcon, createStyles, Menu } from '@mantine/core'
import { IconCategory2, IconLogin, IconLogout, IconUser } from '@tabler/icons'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'
import { useAuth } from '../../lib/context/SessionContext';

const useStyles = createStyles((theme) => ({
    item: {
        fontSize: theme.fontSizes.md,
        '&[data-hovered]': {
            backgroundColor: theme.colors[theme.primaryColor][theme.fn.primaryShade()],
            color: theme.white,
        },
    },

    settingsButton: {
        color: theme.white,

        '&:hover': {
            backgroundColor: theme.fn.lighten(
                theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background || "",
                0.1
            ),
        },
    }
}));

const HeaderAccountMenu = () => {

    const router = useRouter();
    const { deleteAuthToken, token } = useAuth();
    const { classes } = useStyles();

    return (
        <>
            {
                token ? (
                    <Menu classNames={classes} shadow="md" radius={'md'} width={200}>
                        <Menu.Target>
                            <ActionIcon component='a' size={'lg'} radius={'md'} variant='subtle' className={classes.settingsButton}>
                                <IconUser size={20} />
                            </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>Account</Menu.Label>
                            <Menu.Item icon={<IconCategory2 size={16} />} onClick={() => router.push("account")}>Overview</Menu.Item>
                            <Menu.Item icon={<IconLogout size={16} />} onClick={() => deleteAuthToken()}>Logout</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                ) : (
                    <Link href="/login" passHref>
                        <ActionIcon component='a' size={'lg'} radius={'md'} variant='subtle' className={classes.settingsButton}>
                            <IconLogin size={20} />
                        </ActionIcon>
                    </Link>
                )
            }

        </>
    )
}

export default HeaderAccountMenu