import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head'
import React from 'react'
import ResponsiveWrapper from '../components/Container/ResponsiveWrapper'
import { SimpleGrid } from '@mantine/core'
import ArticleCard from '../components/Card/ArticleCard';
import { UserAdPost } from '@prisma/client';
import { ArticleCardData } from '../lib/types/UiHelperTypes';

const NewsPage = () => {

    const { t } = useTranslation('news');

    const item: ArticleCardData = {
        id: "11",
        title: "Test",
        excerpt: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        imageUrl: "https://picsum.photos/500/300",
        date: 1414213562373,
        url: "https://www.google.com",
    };

    const data: ArticleCardData[] = [
        item,
    ];

    return (
        <>
            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('meta.news-title')}</title>
                <meta key={"description"} name="description" content={t('meta.news-desc')} />
            </Head>

            <ResponsiveWrapper>

                <SimpleGrid
                    spacing="lg"
                    breakpoints={[
                        { minWidth: 'md', cols: 3, spacing: 'md' },
                        { minWidth: 'sm', cols: 2, spacing: 'sm' },
                    ]}
                >
                    {
                        data.map((item, index) => {

                            return (
                                <ArticleCard
                                    key={item.id}
                                    data={item}
                                />
                            )
                        })
                    }
                </SimpleGrid>

            </ResponsiveWrapper>
        </>
    )
}

export default NewsPage