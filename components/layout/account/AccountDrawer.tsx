import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo, useEffect, useState } from 'react';
import { useAuth } from '../../../context/SessionContext';
import { URL_INSTITUTION, URL_LOGIN } from '../../../lib/urlConstants';
import { getUserDataFromApi } from '../../../lib/accountHandling/AccountApiHandler';
import { UserDataProfile } from '../../../lib/types/AccountHandlingTypes';
import { toLink } from '../../../lib/util';
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enLocale from 'date-fns/locale/en-GB';
import LogoutConfirmation from './LogoutConfirmation';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

type SidebarLink = {
    url: string,
    text: string,
    icon: React.ReactElement,
}

type Props = {
    children: React.ReactNode;
}

const AccountDrawer: React.FC<Props> = props => {
    const { children } = props;
    const theme = useTheme();
    const router = useRouter();

    const [open, setOpen] = useState(false);

    const { token, deleteAuthToken } = useAuth();
    const [userData, setUserData] = useState<UserDataProfile>(null);

    // Logout confirmation dialog
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const handleClose = () => {
        setLogoutDialogOpen(false);
      };

    // -------------- Language --------------
    const { t } = useTranslation("account");
    const langContent = {
        mniHome: t("menu-item-home"),
        mniNewAd: t("menu-item-newad"),
        mniManageAds: t('menu-item-manageads'),
        mniHistory: t('menu-item-history'),
        mniSupport: t('menu-item-support'),
        mniSettings: t('menu-item-settings'),
        mniLogout: t('menu-item-logout'),
        mniOpenMain: t('menu-item-openmain'),
        mniOpenInstitution: t('menu-item-institution'),
    }

    const menuLinksTop: SidebarLink[] = [
        { url: '/account', text: langContent.mniHome, icon: <HomeIcon /> },
        { url: '/account/create-ad', text: langContent.mniNewAd, icon: <CreateIcon /> },
        { url: '/account/manage-ads', text: langContent.mniManageAds, icon: <ViewListIcon /> },
        { url: '/account/history', text: langContent.mniHistory, icon: <HistoryIcon /> },
        { url: '/account/support', text: langContent.mniSupport, icon: <HelpIcon /> },
        { url: '/account/settings', text: langContent.mniSettings, icon: <SettingsIcon /> },
        { url: 'logout', text: langContent.mniLogout, icon: <LogoutIcon /> },
    ];

    const institutionLink = userData?.institution !== undefined && userData?.institution?.InstitutionLocation.length > 0 ? userData?.institution?.InstitutionLocation[0].City.State.Country.url : "";
    const menuLinksBottom: SidebarLink[] = [
        { url: '/', text: langContent.mniOpenMain, icon: <LinkIcon /> },
        { url: toLink(URL_INSTITUTION, institutionLink, userData?.institution?.url), text: langContent.mniOpenInstitution, icon: <LinkIcon /> },
    ];

    const handleItemClick = (url: string) => {
        if (url === 'logout') {
            setLogoutDialogOpen(true);
        } else {
            router.push(url);
        }
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {

        // Get user data from API
        const getData = async () => {

            const userDataRes = await getUserDataFromApi({ profile: true });
            if (userDataRes === null || userDataRes.status !== "SUCCESS") {
                router.replace(toLink(URL_LOGIN));
                return;
            }

            setUserData(userDataRes.profile || null);
        }

        getData();

        return () => { }
    }, [token]);

    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={enLocale} // use 'bg' locale for date parser/formatter
        >
            <Box sx={{ display: 'flex' }}>
                <AppBar position="fixed" open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(open && { display: 'none' }),
                                color: "common.white",
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" color={"common.white"}>
                            Uni-Index: Account Area
                        </Typography>

                    </Toolbar>
                </AppBar>

                <Drawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {menuLinksTop.map((link, index) => (
                            <ListItem key={index} disablePadding sx={{ display: 'block' }} onClick={() => handleItemClick(link.url)}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {link.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={link.text} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {menuLinksBottom.map((link, index) => (
                            <Link key={index} href={link.url} passHref>
                                <ListItem component={'a'} target={"_blank"} disablePadding sx={{ display: 'block' }}>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 3 : 'auto',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {link.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={link.text} sx={{ opacity: open ? 1 : 0 }} />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                        ))}
                    </List>
                </Drawer>

                <Box sx={{ flexGrow: 1, p: 3 }}>
                    <DrawerHeader />
                    {children}
                </Box>
            </Box>
            <LogoutConfirmation
                id="ringtone-menu"
                keepMounted={false}
                open={logoutDialogOpen}
                onClose={handleClose}
            />
        </LocalizationProvider>
    );
}

export default memo(AccountDrawer);