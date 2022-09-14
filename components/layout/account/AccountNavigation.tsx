import {
    AppShell, Burger, createStyles, Header, MediaQuery, Title, Transition, useMantineTheme
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/SessionContext';
import { getUserDataFromApi } from '../../../lib/accountHandling/AccountApiHandler';
import { UserDataProfile } from '../../../lib/types/AccountHandlingTypes';
import { URL_LOGIN } from '../../../lib/url-helper/urlConstants';
import { toLink } from '../../../lib/util';
import AccountNavDrawer from './AccountNavDrawer';


const useStyles = createStyles((theme, _params, getRef) => {
    return {
        header: {
            color: theme.colors.light[0],
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.brandOrange[5],
        },
    };
});

interface Props {
    children: React.ReactNode
}
const AccountNavigation: React.FC<Props> = ({ children }: Props) => {

    const { classes } = useStyles();
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);

    const router = useRouter();
    const { token, deleteAuthToken } = useAuth();
    const [userData, setUserData] = useState<UserDataProfile>(null);

    const username = userData?.user.display_name !== null && userData?.user.display_name !== undefined && userData.user.display_name !== "" ? userData.user.display_name :
        (userData?.institution?.name || "");

    // Check SM breakpoint to animate drawer
    const isSmallBreakpoint = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`, false, { getInitialValueInEffect: false })

    useEffect(() => {
        // Get user data from API
        const getData = async () => {
            const userDataRes = await getUserDataFromApi({ profile: true });
            if (userDataRes === null || userDataRes.status !== "SUCCESS") {
                deleteAuthToken();
                router.replace(toLink(URL_LOGIN));
                return;
            }
            setUserData(userDataRes.profile || null);
        }
        getData();
        return () => { }
    }, [token]);

    return (
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={
                isSmallBreakpoint ?
                    <Transition mounted={opened} transition="fade" duration={400} timingFunction="ease">
                        {(styles) => <div style={styles}><AccountNavDrawer displayedUsername={username} displayedEmail={userData?.user.email || ""} opened={opened} /> </div>}
                    </Transition> :
                    <AccountNavDrawer displayedUsername={username} displayedEmail={userData?.user.email || ""} opened={opened} />
            }
            header={
                <Header height={70} p="md" className={classes.header}>
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.light[0]}
                                mr="xl"
                            />
                        </MediaQuery>

                        <Title>Uni-Index App</Title>
                    </div>
                </Header>
            }
        >
            {children}
        </AppShell>
    );
}

export default AccountNavigation