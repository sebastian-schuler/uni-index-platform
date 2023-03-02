import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head'
import React from 'react'
import ResponsiveWrapper from '../components/Container/ResponsiveWrapper'

const NewsPage = () => {

    const { t } = useTranslation('news');

    return (
        <>
        <Head>
            <title key={"title"}>{t('common:page-title') + " | " + t('meta.news-title')}</title>
            <meta key={"description"} name="description" content={t('meta.news-desc')} />
        </Head>

        <ResponsiveWrapper>

            WIP: News Page

        </ResponsiveWrapper>
    </>
    )
}

export default NewsPage