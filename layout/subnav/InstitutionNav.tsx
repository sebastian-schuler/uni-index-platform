import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React, { memo } from 'react'
import { URL_INSTITUTION } from '../../lib/url-helper/urlConstants';
import SubNav from './SubNav';

type Props = {
    title: string
}

const InstitutionNav = ({ title }: Props) => {

    const { t } = useTranslation('institution');
    const langContent = {
        profile: t('institution-profile'),
        courses: t('institution-courses'),
        screenshots: t('institution-screenshots'),
        reviews: t('institution-reviews'),
        socialMedia: t('institution-social-media'),
        onlineMarketing: t('institution-online-marketing'),
    }

    const query = useRouter().query;
    const urlBasePath = `/${URL_INSTITUTION}/${query.Country}/${query.Institution}`;

    const pageLinks = [
        {
            name: langContent.profile,
            url: urlBasePath
        },
        {
            name: langContent.socialMedia,
            url: urlBasePath + "/social-media"
        },
        {
            name: langContent.onlineMarketing,
            url: urlBasePath + "/online-marketing"
        },
        {
            name: langContent.courses,
            url: urlBasePath + "/subjects"
        },
        {
            name: langContent.screenshots,
            url: urlBasePath + "/screenshots"
        },
        {
            name: langContent.reviews,
            url: urlBasePath + "/reviews"
        },
    ]

    return (
        <SubNav pageLinkData={pageLinks} title={title} />
    )
}

export default memo(InstitutionNav)