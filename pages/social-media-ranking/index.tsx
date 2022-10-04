import { Space, Title } from '@mantine/core'
import { GetStaticProps, NextPage } from 'next'
import WhitePaper from '../../components/elements/socialmedia/WhitePaper'
import SocialMediaRankingTable from '../../components/elements/SocialMediaRankingTable'
import Breadcrumb from '../../components/layout/Breadcrumb'
import { FooterContent } from '../../components/layout/footer/Footer'
import LayoutContainer from '../../components/layout/LayoutContainer'
import { getDetailedCountries } from '../../lib/prisma/prismaDetailedQueries'
import { getSocialMediaRanking } from '../../lib/prisma/prismaQueries'
import { SocialMediaRankingEntry, TotalScore } from '../../lib/types/SocialMediaTypes'
import { Searchable } from '../../lib/types/UiHelperTypes'
import { generateSearchable } from '../../lib/util'

interface Props {
    stringifiedSocialMediaList: string
    footerContent: FooterContent[]
}

const SocialMediaRanking: NextPage<Props> = ({ stringifiedSocialMediaList, footerContent }: Props) => {

    const socialMediaList: SocialMediaRankingEntry[] = JSON.parse(stringifiedSocialMediaList);

    return (
        <LayoutContainer footerContent={footerContent}>

            <Breadcrumb />

            <Title mb={"md"}>Social-Media Ranking</Title>

            <WhitePaper py={"lg"}>

                <Space h="lg" />

                <SocialMediaRankingTable socialMediaList={socialMediaList} />

            </WhitePaper>

        </LayoutContainer>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {

    const detailedCountries = await getDetailedCountries();
    const searchableCountries: Searchable[] = generateSearchable({ lang: context.locale, array: { type: "Country", data: detailedCountries } });

    // SOCIAL MEDIA
    const socialMediaList = await getSocialMediaRanking();
    socialMediaList.sort((a, b) => {
        const parsedScoreA = JSON.parse(a.total_score) as TotalScore;
        const parsedScoreB = JSON.parse(b.total_score) as TotalScore;
        return parsedScoreB.data.total - parsedScoreA.data.total;
    });

    const stringifiedSocialMediaList = JSON.stringify(socialMediaList);

    const footerContent: FooterContent[] = [
        { title: "Countries", data: searchableCountries, type: "Searchable" },
    ]

    return {
        props: {
            stringifiedSocialMediaList,
            footerContent
        }
    }

}

export default SocialMediaRanking