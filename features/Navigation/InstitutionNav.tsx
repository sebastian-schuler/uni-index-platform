import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React, { memo } from 'react'
import { URL_INSTITUTION, URL_INSTITUTION_ARTICLES, URL_INSTITUTION_OM, URL_INSTITUTION_REVIEWS, URL_INSTITUTION_SCREENSHOTS, URL_INSTITUTION_SOCIALMEDIA, URL_INSTITUTION_SUBJECTS } from '../../lib/url-helper/urlConstants';
import SubNav from '../../components/Nav/SubNav';

type Props = {
    title: string
}

const InstitutionNav = ({ title }: Props) => {

    const { t } = useTranslation('institution');
    const query = useRouter().query;
    const urlBasePath = `/${URL_INSTITUTION}/${query.Country}/${query.Institution}`;

    const pageLinks = [
        {
            name: t('institution.tab-profile'),
            url: urlBasePath
        },
        {
            name: t('institution.tab-social-media'),
            url: urlBasePath + "/" + URL_INSTITUTION_SOCIALMEDIA
        },
        {
            name: t('institution.tab-online-marketing'),
            url: urlBasePath + "/" + URL_INSTITUTION_OM
        },
        {
            name: t('institution.tab-courses'),
            url: urlBasePath + "/" + URL_INSTITUTION_SUBJECTS
        },
        {
            name: t('institution.tab-screenshots'),
            url: urlBasePath + "/" + URL_INSTITUTION_SCREENSHOTS
        },
        {
            name: t('institution.tab-reviews'),
            url: urlBasePath + "/" + URL_INSTITUTION_REVIEWS
        },
        {
            name: "Articles",
            url: urlBasePath + "/" + URL_INSTITUTION_ARTICLES
        },
    ]

    return (
        <SubNav pageLinkData={pageLinks} title={title} />
    )
}

export default memo(InstitutionNav)