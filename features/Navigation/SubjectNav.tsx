import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React, { memo } from 'react'
import { URL_INSTITUTION, URL_INSTITUTION_SUBJECTS } from '../../lib/url-helper/urlConstants';
import SubNav from '../../components/Nav/SubNav';

type Props = {
    title: string,
    backButton?: {
        url: string,
        text: string,
    },
}

const SubjectNav = ({ title, backButton }: Props) => {

    const { t, lang } = useTranslation('institution');

    const query = useRouter().query;
    const urlBasePath = `/${URL_INSTITUTION}/${query.Country}/${query.Institution}/${URL_INSTITUTION_SUBJECTS}/${query.Subject}`;

    const pageLinks = [
        {
            name: t('subject.tab-profile'),
            url: urlBasePath
        },
        {
            name: t('subject.tab-jobs'),
            url: urlBasePath + "/jobs"
        },
    ]

    return (
        <SubNav pageLinkData={pageLinks} title={title} backButton={backButton} />
    )
}

export default memo(SubjectNav)