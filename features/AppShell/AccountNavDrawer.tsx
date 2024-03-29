import { Button, createStyles, getStylesRef, Group, Navbar } from '@mantine/core';
import { IconArticle, IconDashboard, IconExternalLink, IconHelp, IconHistory, IconLogout, IconPencilPlus, IconSettings } from '@tabler/icons-react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useAuth } from '../../lib/context/SessionContext';
import AccountUserButton from '../Account/AccountUserButton';

const useStyles = createStyles((theme, _params) => {
    const icon = getStylesRef('icon');
    return {

        root: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.brandGray[5] : theme.white,
        },

        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: `calc(${theme.spacing.md} * 1.5)`,
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                }`,
        },

        homepageLink: {
            paddingTop: theme.spacing.md,
            marginTop: `calc(${theme.spacing.md} * 1.5)`,
            borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                }`,
        },

        footer: {
            paddingTop: theme.spacing.md,
            marginTop: theme.spacing.md,
            borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
        },

        link: {
            ...theme.fn.focusStyles(),
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            fontSize: theme.fontSizes.sm,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
            padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
            borderRadius: theme.radius.sm,
            fontWeight: 500,

            '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,

                [`& .${icon}`]: {
                    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
                },
            },
        },

        linkIcon: {
            ref: icon,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
            marginRight: theme.spacing.sm,
        },

        linkActive: {
            '&, &:hover': {
                backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
                    .background,
                color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
                [`& .${icon}`]: {
                    color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
                },
            },
        },
    };
});

interface Props {
    opened: boolean;
    setOpened: (opened: boolean) => void;
    active: string;
    setActive: (active: string) => void;
    displayedEmail: string;
}
const AccountNavDrawer: React.FC<Props> = ({ opened, setOpened, active, setActive, displayedEmail }: Props) => {

    const { deleteAuthToken } = useAuth();
    const { t } = useTranslation("account");

    const data = [
        { link: '/account', label: t("nav.dashboard"), icon: IconDashboard },
        { link: '/account/create-ad', label: t("nav.create-ad"), icon: IconPencilPlus },
        { link: '/account/manage-ads', label: t('nav.manage-ads'), icon: IconArticle },
        { link: '/account/history', label: t('nav.history'), icon: IconHistory },
        { link: '/account/support', label: t('nav.support'), icon: IconHelp },
        { link: '/account/settings', label: t('nav.settings'), icon: IconSettings },
    ];

    const router = useRouter()

    const { classes, cx } = useStyles();

    const links = data.map((item) => (
        <Button
            className={cx(classes.link, { [classes.linkActive]: item.link === active })}
            variant="subtle"
            fullWidth
            key={item.label}
            onClick={() => {
                setActive(item.link);
                router.push(item.link);
                setOpened(false);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </Button>
    ));

    return (
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }} className={classes.root}>
            <Navbar.Section grow>
                <Group className={classes.header} position="apart">
                    <AccountUserButton
                        email={displayedEmail}
                    />
                </Group>
                {links}
                <Group className={classes.homepageLink} position="apart">
                    <Button
                        component={Link}
                        href={"/"}
                        target='_blank'
                        className={classes.link}
                        variant="subtle"
                        fullWidth
                    >
                        <IconExternalLink className={classes.linkIcon} stroke={1.5} />
                        <span>{t('nav.main-page')}</span>
                    </Button>
                </Group>
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
                <Button
                    component='button'
                    variant='subtle'
                    fullWidth
                    className={classes.link}
                    onClick={(event) => {
                        event.preventDefault()
                        deleteAuthToken(); // Enough to delete the token, since its a state it'll logout in the useEffect, router.push only called once!
                    }}
                >
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>{t('nav.logout')}</span>
                </Button>
            </Navbar.Section>
        </Navbar>
    );
}

export default AccountNavDrawer