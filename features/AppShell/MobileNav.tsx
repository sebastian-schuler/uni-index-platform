import { ActionIcon, createStyles, Divider, Drawer, Group, NavLink, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconSearch, IconX } from '@tabler/icons-react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import ResponsiveContainer from '../../components/Container/ResponsiveContainer';
import { URL_LOGIN, URL_REGISTER, URL_SEARCH } from '../../lib/url-helper/urlConstants';
import { toLink } from '../../lib/util/util';
import { LocaleItem } from '../../locales/localeUtil';
import { MenuLink } from './Shell';

const useStyles = createStyles((theme) => ({

    link: {
        ...theme.fn.focusStyles(),
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        borderRadius: theme.radius.sm,
        lineHeight: 1,
        fontSize: theme.fontSizes.lg,

        [`& .mantine-NavLink-label`]: {
            fontSize: theme.fontSizes.lg,
            lineHeight: 1,
        },

        [`&:hover`]: {
            backgroundColor: 'inherit',
        },
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor: 'inherit',
        },
    },

    label: {
        color: theme.colors.brandGray[0],
        marginTop: theme.spacing.sm,
    },

    searchLink: {

    }
}));

type Props = {
    opened: boolean
    toggle: () => void
    data: MenuLink[]
    locales: LocaleItem[]
    handleSelectLang: (index: number) => void
    selectedLanguageIndex: number
}

const MobileNav: React.FC<Props> = ({ opened, toggle, data, locales, handleSelectLang, selectedLanguageIndex }: Props) => {

    const { classes, cx, theme } = useStyles();
    const router = useRouter();
    const { t } = useTranslation('common');

    const largeScreen = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
    const height = largeScreen ? 200 : 100;

    // Check if the route is the current route
    const isCurrentRoute = (rootUrl: string[]) => {
        return rootUrl.some((url) => {
            if (url === "" && router.route === "/") return true;
            if (url != "" && router.route.startsWith("/" + url)) return true;
            return false;
        });
    }

    const links = data.map((item, i) => {
        const isActive = isCurrentRoute(item.rootUrl);
        return (
            <NavLink
                key={i} label={item.label} active={isActive}
                component={Link} href={item.link}
                className={cx(classes.link, { [classes.linkActive]: isActive })}
                onClick={() => toggle()}
            />
        );
    });

    const langLinks = locales.map((locale, i) => {
        const isActive = i === selectedLanguageIndex;
        return <NavLink
            key={locale.id} onClick={() => handleSelectLang(i)}
            label={locale.text} active={isActive}
            className={cx(classes.link, { [classes.linkActive]: isActive })}
        />
    });

    return (
        <Drawer
            opened={opened}
            onClose={() => toggle()}
            padding={0}
            size="sm"
            position='right'
            withCloseButton={false}
            zIndex={1000000}
        >
            <ResponsiveContainer>
                <Group position='apart' h={height}>
                    <Text size='xl' weight={700}>{t('page-title')}</Text>
                    <ActionIcon size={'lg'} onClick={() => toggle()}>
                        <IconX size={28} color={theme.black} />
                    </ActionIcon>
                </Group>

                <NavLink
                    label={t('nav.search')} component={Link}
                    href={toLink(URL_SEARCH)} onClick={() => toggle()}
                    icon={<IconSearch size={18} color={theme.black} />}
                    className={cx(classes.link)}
                />

                <Divider my={'md'} />

                <Stack spacing={'sm'}>
                    {links.map((item) => item)}
                </Stack>

                <Divider my={'md'} />

                <Stack spacing={'sm'}>

                    <Text size={'lg'} weight={'bold'}>{t('nav.account')}</Text>
                    <NavLink
                        label={t('account.login')}
                        component={Link} href={toLink(URL_LOGIN)}
                        className={classes.link}
                        onClick={() => toggle()}
                    />
                    <NavLink
                        label={t('account.register')}
                        component={Link} href={toLink(URL_REGISTER)}
                        className={classes.link}
                        onClick={() => toggle()}
                    />
                </Stack>

                <Divider my={'md'} />

                <Stack spacing={'sm'}>
                    <Text size={'lg'} weight={'bold'}>{t('nav.language')}</Text>
                    {langLinks}
                </Stack>

            </ResponsiveContainer>
        </Drawer>
    )
}

export default MobileNav