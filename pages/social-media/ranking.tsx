import { Space, Text, Title } from '@mantine/core'
import { Country } from '@prisma/client'
import { GetStaticProps, NextPage } from 'next'
import Breadcrumb from '../../layout/Breadcrumb'
import { FooterContent } from '../../layout/footer/Footer'
import LayoutContainer from '../../layout/LayoutContainer'
import SmRankingTable from '../../layout/socialmedia/SmRankingTable'
import WhitePaper from '../../components/WhitePaper'
import { getCountries } from '../../lib/prisma/prismaQueries'
import { getSocialMediaRanking } from '../../lib/prisma/prismaSocialMedia'
import { SmRankingEntryMinified } from '../../lib/types/SocialMediaTypes'
import { minifySmRankingItem } from '../../lib/util/conversionUtil'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'

interface Props {
    countries: Country[],
    socialMediaList: SmRankingEntryMinified[]
    filtedOutCount: number
    footerContent: FooterContent[]
}

const SocialMediaRanking: NextPage<Props> = ({ countries, socialMediaList, filtedOutCount, footerContent }: Props) => {

    const { t } = useTranslation('rankings');

    return (
        <LayoutContainer footerContent={footerContent}>

            <Head>
                <title key={"title"}>{t('common:page-title') + " | " + t('seo-sm-ranking-title')}</title>
                <meta key={"description"} name="description" content={t('seo-sm-ranking-description')} />
            </Head>

            <Breadcrumb />

            <Title mb={"md"}>Social-Media Ranking</Title>

            <WhitePaper py={"lg"}>

                <Space h="lg" />
                <SmRankingTable
                    countries={countries}
                    socialMediaList={socialMediaList}
                />

                <Text mt={"lg"}>{filtedOutCount} institutions are not being displayed, due to having a score of 0.</Text>

            </WhitePaper>

        </LayoutContainer>
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