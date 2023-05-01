import { Stack, Text, Title } from '@mantine/core'
import { country } from '@prisma/client'
import { GetStaticProps, NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import ResponsiveWrapper from '../../../components/Container/ResponsiveWrapper'
import Breadcrumb from '../../../features/Breadcrumb/Breadcrumb'
import { FooterContent } from '../../../features/Footer/Footer'
import SmRankingTable from '../../../features/SocialMedia/SmRankingTable'
import { getCountries } from '../../../lib/prisma/prismaQueries'
import { getSocialMediaRanking } from '../../../lib/prisma/prismaSocialMedia'
import { SocialMediaGenericRankingItem } from '../../../lib/types/social-media/SocialMediaSimplifiedTypes'

interface Props {
    countries: country[],
    socialMediaList: SocialMediaGenericRankingItem[]
    filteredCount: number
    footerContent: FooterContent[]
}

const SocialMediaRanking: NextPage<Props> = ({ countries, socialMediaList, filteredCount, footerContent }: Props) => {

    const { t } = useTranslation('analysis');

    return (
        <ResponsiveWrapper footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('meta.seo-sm-ranking-title')}</title>
                <meta key={"description"} name="description" content={t('meta.seo-sm-ranking-description')} />
            </Head>

            <Breadcrumb />

            <Stack>
                <Title mb={"md"}>{t('social-media.ranking.title')}</Title>

                <SmRankingTable
                    countries={countries}
                    socialMediaList={socialMediaList}
                />

                <Text mt={"lg"}>{t('social-media.ranking.bottom-notice', { count: filteredCount })}</Text>
            </Stack>

        </ResponsiveWrapper>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {

    const countries = await getCountries();

    // SOCIAL MEDIA
    const rawSocialMediaList = await getSocialMediaRanking({});
    const filteredList = rawSocialMediaList.filter((item) => item.total_score > 0);
    const filteredCount = rawSocialMediaList.length - filteredList.length;

    const footerContent: FooterContent[] = [
        { title: "Countries", data: countries, type: "Country" },
    ]


    const props:Props = {
        countries,
        socialMediaList: filteredList,
        filteredCount,
        footerContent
    }

    return {props};
}

export default SocialMediaRanking