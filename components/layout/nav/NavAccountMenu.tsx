import { Logout } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import ViewListIcon from '@mui/icons-material/ViewList';
import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { memo } from 'react';
import { useAuth } from '../../../context/SessionContext';
import { URL_ACCOUNT, URL_LOGIN } from '../../../data/urlConstants';
import { toLink } from '../../../lib/util';

type MenuItem = {
    url: string
    text: string
    icon: React.ReactElement
}

const NavAccountMenu = () => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const { token, deleteAuthToken } = useAuth();
    const router = useRouter();

    const menuItems: MenuItem[] = [
        { url: toLink(URL_ACCOUNT), text: 'Account', icon: <HomeIcon fontSize="small" /> },
        { url: toLink(URL_ACCOUNT, "manage-ads"), text: 'Manage Ads', icon: <ViewListIcon fontSize="small" /> },
    ]

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        deleteAuthToken();
        router.replace(toLink(URL_LOGIN));
    }

    const handleItemSelected = (url: string) => {
        router.push(url);
    }

    return (
        <>
            {
                token === "" ? (
                    <IconButton
                        size='medium'
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={() => router.push(toLink(URL_LOGIN))}
                        sx={{
                            color: 'white',
                        }}
                    >
                        <LoginIcon fontSize="medium" />
                    </IconButton>
                ) : (

                    <Box>

                        <Tooltip title="Account settings">
                            <IconButton
                                onClick={handleClick}
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <Avatar sx={{ width: 32, height: 32 }}>{/* Can fill in letter or image */}</Avatar>
                            </IconButton>
                        </Tooltip>

                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            {
                                menuItems.map((item, index) => (
                                    <Link key={index} href={item.url} passHref>
                                        <MenuItem key={index} component={"a"} target={"_blank"}>
                                            <ListItemIcon>
                                                {item.icon}
                                            </ListItemIcon>
                                            {item.text}
                                        </MenuItem>
                                    </Link>
                                ))
                            }
                            <Divider />
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>

                    </Box>

                )
            }
        </>
    )
}

export default memo(NavAccountMenu)