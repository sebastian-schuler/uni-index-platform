import { useDisclosure } from '@mantine/hooks';
import setLanguage from 'next-translate/setLanguage';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import i18nConfig from '../../i18n';
import { URL_ACCOUNT, URL_ANALYSIS, URL_CATEGORIES, URL_CATEGORY, URL_INSTITUTION, URL_INSTITUTIONS, URL_LOCATION, URL_LOCATIONS, URL_NEWS } from '../../lib/url-helper/urlConstants';
import { toLink } from '../../lib/util/util';
import { getLanguageById, LocaleItem } from '../../locales/localeUtil';
import AccountNavigation from './AccountNavigation';
import BrandNavbar from './BrandNavbar';
import MobileNav from './MobileNav';

export type MenuLink = { label: string, link: string, rootUrl: string[] }

type Props = {
    children: React.ReactNode
}

const Shell: React.FC<Props> = ({ children }: Props) => {

    const { t, lang } = useTranslation("common");
    const { asPath } = useRouter();

    // Mobile nav
    const [opened, { toggle }] = useDisclosure(false);

    // Language changing
    const locales = i18nConfig.locales.map(locale => getLanguageById(locale)).filter(locale => locale !== undefined) as LocaleItem[];
    const [selectedIndex, setSelectedIndex] = useState(locales.findIndex(x => x.id === lang));
    const handleSelectLang = (index: number) => {
        setSelectedIndex(index);
        if (lang != locales[index].id) setLanguage(locales[index].id);
    }

    // Data
    const links: MenuLink[] = [
        { label: t('nav.home'), link: "/", rootUrl: [""] },
        { label: t('nav.locations'), link: toLink(URL_LOCATIONS), rootUrl: [URL_LOCATION] },
        { label: t('nav.categories'), link: toLink(URL_CATEGORIES), rootUrl: [URL_CATEGORY, URL_CATEGORIES] },
        { label: t('nav.institutions'), link: toLink(URL_INSTITUTIONS), rootUrl: [URL_INSTITUTION] },
        { label: t('nav.analysis'), link: toLink(URL_ANALYSIS), rootUrl: [URL_ANALYSIS] },
        { label: t('nav.news'), link: toLink(URL_NEWS), rootUrl: [URL_NEWS] },
    ];

    return (
        <>
            {
                asPath.startsWith(toLink(URL_ACCOUNT)) ? (
                    <AccountNavigation>
                        {children}
                    </AccountNavigation>
                ) : (
                    <>
                        <BrandNavbar
                            data={links}
                            locales={locales}
                            handleSelectLang={handleSelectLang}
                            selectedLanguageIndex={selectedIndex}
                            toggleDrawer={toggle}
                            drawerOpened={opened}
                        />
                        <MobileNav
                            opened={opened}
                            toggle={toggle}
                            data={links}
                            locales={locales}
                            handleSelectLang={handleSelectLang}
                            selectedLanguageIndex={selectedIndex}
                        />
                        {children}
                    </>
                )
            }
        </>
    )
}

export default Shell