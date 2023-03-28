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
import { SmRankingEntryMinified } from '../../../lib/types/SocialMediaTypes'
import { minifySmRankingItem } from '../../../lib/util/conversionUtil'

interface Props {
    countries: country[],
    socialMediaList: SmRankingEntryMinified[]
    filtedOutCount: number
    footerContent: FooterContent[]
}

const SocialMediaRanking: NextPage<Props> = ({ countries, socialMediaList, filtedOutCount, footerContent }: Props) => {

    const { t } = useTranslation('analysis');

    return (
        <ResponsiveWrapper footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('meta.seo-sm-ranking-title')}</title>
                <meta key={"description"} name="description" content={t('meta.seo-sm-ranking-description')} />
            </Head>

            <Breadcrumb />

            <Stack>
                <Title mb={"md"}>Social-Media Ranking</Title>

                <SmRankingTable
                    countries={countries}
                    socialMediaList={socialMediaList}
                />

                <Text mt={"lg"}>{filtedOutCount} institutions are not being displayed, due to having a score of 0.</Text>
            </Stack>

        </ResponsiveWrapper>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {

    const countries = await getCountries();

    // SOCIAL MEDIA
    const rawSocialMediaList = await getSocialMediaRanking();
    let socialMediaList: SmRankingEntryMinified[] = rawSocialMediaList.map((item) => minifySmRankingItem(item));
    socialMediaList = socialMediaList.filter((item) => item.combinedScore > 0);

    const filtedOutCount = rawSocialMediaList.length - socialMediaList.length;

    socialMediaList.sort((a, b) => {
        return b.combinedScore - a.combinedScore;
    });

    const footerContent: FooterContent[] = [
        { title: "Countries", data: countries, type: "Country" },
    ]

    return {
        props: {
            countries,
            socialMediaList,
            filtedOutCount,
            footerContent
        }
    }

}

export default SocialMediaRanking