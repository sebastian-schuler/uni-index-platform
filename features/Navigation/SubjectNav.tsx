import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React, { memo } from 'react'
import { URL_INSTITUTION } from '../../lib/url-helper/urlConstants';
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
    const langContent = {
        profile: t('subject-profile'),
        jobs: t('subject-jobs'),
    }

    const query = useRouter().query;
    const urlBasePath = `/${URL_INSTITUTION}/${query.Country}/${query.Institution}/${query.Subject}`;

    const pageLinks = [
        {
            name: langContent.profile,
            url: urlBasePath
        },
        {
            name: langContent.jobs,
            url: urlBasePath + "/jobs"
        },
    ]

    return (
        <SubNav pageLinkData={pageLinks} title={title} backButton={backButton} />
    )
}

export default memo(SubjectNav)