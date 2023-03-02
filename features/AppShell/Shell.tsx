import React from 'react'
import { useRouter } from 'next/router';
import { toLink } from '../../lib/util/util';
import { URL_ACCOUNT, URL_NEWS } from '../../lib/url-helper/urlConstants';
import AccountNavigation from '../Account/AccountNavigation';
import Navbar from './Navbar';
import { useDisclosure } from '@mantine/hooks';
import useTranslation from 'next-translate/useTranslation';
import { URL_CATEGORIES, URL_CATEGORY, URL_INSTITUTION, URL_INSTITUTIONS, URL_LOCATION, URL_LOCATIONS } from '../../lib/url-helper/urlConstants';
import MobileNav from './MobileNav';

export const HEADER_HEIGHT = 64;

export type MenuLink =
    { type: 'link', label: string, link: string, rootUrl: string[] } |
    { type: 'divider' } |
    { type: 'label', label: string } |
    { type: 'group', label: string, children: MenuLink[], rootUrl: string[] }

type Props = {
    children: React.ReactNode
}

const Shell: React.FC<Props> = ({ children }: Props) => {

    const { t } = useTranslation("common");
    const { asPath } = useRouter();
    const [opened, { toggle }] = useDisclosure(false);

    const links: MenuLink[] = [
        { type: 'link', label: t('nav.home'), link: "/", rootUrl: [""] },
        { type: 'link', label: t('nav.news'), link: toLink(URL_NEWS), rootUrl: [URL_NEWS] },
        { type: 'link', label: t('nav.locations'), link: toLink(URL_LOCATIONS), rootUrl: [URL_LOCATION] },
        { type: 'link', label: t('nav.categories'), link: toLink(URL_CATEGORIES), rootUrl: [URL_CATEGORY, URL_CATEGORIES] },
        { type: 'link', label: t('nav.institutions'), link: toLink(URL_INSTITUTIONS), rootUrl: [URL_INSTITUTION] },
        {
            type: 'group', label: t('nav.analysis.title'), rootUrl: ["social-media"], children: [
                { type: 'label', label: t('nav.analysis.social-media-label') },
                { type: 'link', label: t('nav.analysis.social-media-ranking'), link: "/social-media/ranking", rootUrl: [] },
                { type: 'link', label: t('nav.analysis.social-media-statistics'), link: "/social-media/statistics", rootUrl: [] },
                { type: 'label', label: t('nav.analysis.online-marketing-label') },
                { type: 'link', label: t('nav.analysis.online-marketing-ranking'), link: "#ranking", rootUrl: [] },
                { type: 'link', label: t('nav.analysis.online-marketing-statistics'), link: "#statistics", rootUrl: [] },
            ]
        },
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
                        <Navbar
                            opened={opened}
                            toggle={toggle}
                            data={links}
                        />
                        <MobileNav
                            opened={opened}
                            toggle={toggle}
                            data={links}
                        />
                        {children}
                    </>
                )
            }
        </>
    )
}

export default Shell