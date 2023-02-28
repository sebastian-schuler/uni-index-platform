import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React, { memo } from 'react'
import { URL_INSTITUTION } from '../../lib/url-helper/urlConstants';
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
            name: t('tab-profile'),
            url: urlBasePath
        },
        {
            name: t('tab-social-media'),
            url: urlBasePath + "/social-media"
        },
        {
            name: t('tab-online-marketing'),
            url: urlBasePath + "/online-marketing"
        },
        {
            name: t('tab-courses'),
            url: urlBasePath + "/subjects"
        },
        {
            name: t('tab-screenshots'),
            url: urlBasePath + "/screenshots"
        },
        {
            name: t('tab-reviews'),
            url: urlBasePath + "/reviews"
        },
    ]

    return (
        <SubNav pageLinkData={pageLinks} title={title} />
    )
}

export default memo(InstitutionNav)