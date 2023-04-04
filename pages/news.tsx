import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import ResponsiveWrapper from '../components/Container/ResponsiveWrapper'
import { Image, SimpleGrid, Stack } from '@mantine/core'
import ArticleCard from '../components/Card/ArticleCard';
import { GetServerSideProps } from 'next';
import { getAllAdPosts } from '../lib/prisma/prismaArticles';
import GenericPageHeader from '../components/Block/GenericPageHeader';
import Breadcrumb from '../features/Breadcrumb/Breadcrumb';
import { ArticleCardData } from '../lib/types/ArticleTypes';

type Props = {
    articles: ArticleCardData[]
}

const NewsPage = ({ articles }: Props) => {

    const { t } = useTranslation('news');

    return (
        <>
            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('meta.news-title')}</title>
                <meta key={"description"} name="description" content={t('meta.news-desc')} />
            </Head>

            <ResponsiveWrapper>
                <Breadcrumb />
                <Stack>

                    <GenericPageHeader title={t('news.title')} description={t('news.subtitle')} />

                    <SimpleGrid
                        spacing="lg"
                        breakpoints={[
                            { minWidth: 'md', cols: 3, spacing: 'md' },
                            { minWidth: 'sm', cols: 2, spacing: 'sm' },
                        ]}
                    >
                        {
                            articles.map((item) => {

                                return (
                                    <ArticleCard
                                        key={item.id}
                                        data={item}
                                    />
                                )
                            })
                        }
                    </SimpleGrid>

                </Stack>
            </ResponsiveWrapper>
        </>
    )
}



export const getServerSideProps: GetServerSideProps = async (context) => {

    const lang = context.locale || "en";

    const articles = await getAllAdPosts(lang);

    const props: Props = {
        articles
    }
    return { props };
}

export default NewsPage