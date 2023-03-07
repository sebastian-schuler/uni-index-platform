import { Burger, createStyles, Divider, Flex, Group, Header, Text, Title, UnstyledButton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import ResponsiveContainer from '../../components/Container/ResponsiveContainer';
import { URL_LOGIN, URL_REGISTER, URL_SEARCH } from '../../lib/url-helper/urlConstants';
import { LocaleItem } from '../../locales/localeUtil';
import { MenuLink } from './Shell';

const useStyles = createStyles((theme) => ({

    root: {
        border: 'none',
        backgroundColor: 'white',
        position: 'relative',
    },

    languageList: {
        marginTop: theme.spacing.md,

        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },
    },

    languageLink: {
        textUnderlineOffset: '0.3em',

        '&:hover': {
            textDecoration: 'underline'
        },
    },

    languageLinkActive: {
        fontWeight: 600,
    },

    linkList: {
        borderTop: `1px solid ${theme.colors.gray[6]}`,

        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },
    },

    link: {
        padding: `${theme.spacing.md} 0`,
        textTransform: 'uppercase',
        fontSize: theme.fontSizes.lg,
        fontWeight: 600,
        color: theme.colors.brandGray[0],
        lineHeight: '1.2',
        borderTop: `4px solid transparent`,
        flexGrow: 1,
        textAlign: 'center',
        transition: 'all 0.2s ease',

        '&:hover': {
            borderTopColor: theme.fn.darken(theme.colors.brandGray[0], 0.3),
            color: theme.fn.darken(theme.colors.brandGray[0], 0.3),
        },
    },

    linkActive: {
        borderTopColor: theme.colors.brandOrange[5],
        color: theme.colors.brandOrange[5],

        '&:hover': {
            borderTopColor: theme.fn.lighten(theme.colors.brandOrange[5], 0.2),
            color: theme.fn.lighten(theme.colors.brandOrange[5], 0.2),
        },
    },

    buttonList: {
        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },
    },

    button: {
        fontSize: theme.fontSizes.lg,
        textUnderlineOffset: '0.3em',
        fontWeight: 500,

        '&:hover': {
            textDecoration: 'underline'
        },
    },

    burger: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
            display: 'none',
        },
    },

}));

type Props = {
    data: MenuLink[]
    locales: LocaleItem[]
    handleSelectLang: (index: number) => void
    selectedLanguageIndex: number
    toggleDrawer: () => void
    drawerOpened: boolean
}

const BrandNavbar: React.FC<Props> = ({ data, locales, handleSelectLang, selectedLanguageIndex, toggleDrawer, drawerOpened, }: Props) => {

    const { classes, cx, theme } = useStyles();
    const router = useRouter();

    const { t } = useTranslation('common');

    const largeScreen = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
    const height = largeScreen ? 200 : 100;

    const langLinks = locales.map((locale, i) => {
        return <UnstyledButton
            key={locale.id} onClick={() => handleSelectLang(i)}
            className={cx(classes.languageLink, { [classes.languageLinkActive]: i === selectedLanguageIndex })}
        >
            {locale.text}
        </UnstyledButton>
    });

    const links = data.map((link, i) => {
        // Check if the route is the current route
        let isCurrent = link.rootUrl.some((url) => {
            if (url === "" && router.route === "/") return true;
            if (url != "" && router.route.startsWith("/" + url)) return true;
            return false;
        });

        return (
            <UnstyledButton
                key={i} component={Link} href={link.link}
                className={cx(classes.link, { [classes.linkActive]: isCurrent })}
            >
                {link.label}
            </UnstyledButton>
        );
    });

    return (
        <Header height={height} className={classes.root}>
            <ResponsiveContainer props={{ h: '100%' }}>
                <Flex direction={'column'} h={'100%'}>

                    <Group position='right' className={classes.languageList}>
                        {langLinks}
                    </Group>

                    <Group position='apart' sx={{ flex: 1, flexGrow: 1 }}>
                        <Title>{t('page-title')}</Title>
                        <Group className={classes.buttonList}>
                            <UnstyledButton component={Link} href={URL_SEARCH} className={classes.button}>
                                <Group spacing={'sm'}>
                                    <IconSearch size={18} />
                                    <Text>{t('nav.search')}</Text>
                                </Group>
                            </UnstyledButton>
                            <Divider size="sm" orientation="vertical" />
                            <UnstyledButton component={Link} href={URL_LOGIN} className={classes.button}>
                                <Text>{t('account.login')}</Text>
                            </UnstyledButton>
                            <Divider size="sm" orientation="vertical" />
                            <UnstyledButton component={Link} href={URL_REGISTER} className={classes.button}>
                                <Text>{t('account.register')}</Text>
                            </UnstyledButton>
                        </Group>

                        <Burger
                            opened={drawerOpened}
                            onClick={toggleDrawer}
                            className={classes.burger}
                            title={t('nav.mobile-title')}
                        />
                    </Group>

                    <Flex className={classes.linkList}>
                        {links}
                    </Flex>

                </Flex>
            </ResponsiveContainer>
        </Header>
    )
}

export default BrandNavbar