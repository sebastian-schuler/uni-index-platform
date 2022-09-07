import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React from 'react';
import Link, { NextLinkComposed } from '../../mui/NextLinkMui';
import ResponsiveContainer from '../ResponsiveContainer';
import NavAccountMenu from './NavAccountMenu';
import SettingsDrawer from './SettingsDrawer';

const WebsiteNavbar = () => {

    // -------------- Language --------------
    const { t } = useTranslation("common");
    const langContent = {
        pageTitle: t("page-title"),
        pageSettings: t("page-settings"),
        pageSettingsLanguage: t('page-settings-language'),
        home: t('nav-home'),
        locations: t('nav-locations'),
        subjects: t('nav-subjects'),
        institutions: t('nav-institutions'),
    }

    // -------------- Routes --------------
    const navItems = [
        {
            name: langContent.home,
            href: '/',
            internal: ['/'],
            current: false
        },
        {
            name: langContent.locations,
            href: '/locations',
            internal: ['/location'],
            current: false
        },
        {
            name: langContent.subjects,
            href: '/subjects',
            internal: ['/subject'],
            current: false
        },
        {
            name: langContent.institutions,
            href: '/institutions',
            internal: ['/institution'],
            current: false
        },
    ]

    const switchActiveNav = (route: string) => {
        navItems.forEach(item => {
            if (item.href === "/") {
                item.current = route === "/";
            } else {
                if (item.internal.some(value => route.startsWith(value))) item.current = true;
                else item.current = false;
            }
        });
    }

    const router = useRouter();
    switchActiveNav(router.route);

    // -------------- Menu Drawer --------------
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleMenuDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const menuDrawer = (
        <Box onClick={handleMenuDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                {langContent.pageTitle}
            </Typography>
            <Divider />
            <List>
                {navItems.map((item, i) => (
                    <ListItem key={i} disablePadding>
                        <ListItemButton component={NextLinkComposed} to={{ pathname: item.href }} sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    // -------------- Settings Drawer --------------
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const handleSettingsDrawerToggle = () => {
        setSettingsOpen(!settingsOpen);
    };

    // -------------- Render --------------
    return (
        <Box sx={{ flexGrow: 1 }}>

            <AppBar position='fixed' component="nav">
                <ResponsiveContainer>
                    <Toolbar disableGutters>

                        {/* Title Left Desktop */}
                        <AdbIcon sx={{ display: { xs: 'none', sm: 'flex', color: 'white' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', sm: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'white',
                                textDecoration: 'none',
                            }}
                        >
                            {langContent.pageTitle}
                        </Typography>

                        {/* Menu Left Mobile */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }}>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleMenuDrawerToggle}
                                sx={{
                                    color: 'white'
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>

                        {/* Title Center Mobile */}
                        <AdbIcon sx={{ display: { xs: 'flex', sm: 'none', color: 'white' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', sm: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'white',
                                textDecoration: 'none',
                            }}
                        >
                            {langContent.pageTitle}
                        </Typography>

                        {/* Items Center Desktop */}
                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexGrow: 1 }}>
                            {navItems.map((item, i) => (
                                <Button
                                    key={i}
                                    component={NextLinkComposed}
                                    to={{ pathname: item.href }}
                                    variant={'text'}
                                    color={'secondary'}
                                    sx={{
                                        color: '#fff',
                                        my: 2,
                                        display: 'block',
                                        lineHeight: '1',
                                        minWidth: 'unset',
                                    }}>
                                    {item.name}
                                </Button>
                            ))}
                        </Box>

                        {/* Settings Right */}
                        <Stack sx={{ flexGrow: 0 }} direction={'row'} alignItems={'center'} spacing={1}>

                            <NavAccountMenu />

                            <IconButton
                                size='medium'
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleSettingsDrawerToggle}
                                sx={{
                                    color: 'white',
                                }}
                            >
                                <SettingsIcon fontSize="medium" />
                            </IconButton>

                        </Stack>

                    </Toolbar>
                </ResponsiveContainer>
            </AppBar>

            {/* Menu Drawer */}
            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleMenuDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: { xs: 310, sm: 360 } },
                    }}
                >
                    {menuDrawer}
                </Drawer>
            </Box>

            {/* Settings Drawer */}
            <Box component="div">
                <Drawer
                    variant="temporary"
                    anchor='right'
                    open={settingsOpen}
                    onClose={handleSettingsDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: { xs: 310, sm: 360 } },
                    }}
                >
                    <SettingsDrawer handleSettingsDrawerToggle={handleSettingsDrawerToggle} />
                </Drawer>
            </Box>


        </Box>
    );
}

// export default memo(WebsiteNavbar);

export default WebsiteNavbar;