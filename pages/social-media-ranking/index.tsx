import { Space, Title } from '@mantine/core'
import { GetStaticProps, NextPage } from 'next'
import WhitePaper from '../../components/WhitePaper'
import SocialMediaRankingTable from '../../components/elements/socialmedia/SmRankingTable'
import Breadcrumb from '../../components/layout/Breadcrumb'
import { FooterContent } from '../../components/layout/footer/Footer'
import LayoutContainer from '../../components/layout/LayoutContainer'
import { getDetailedCountries } from '../../lib/prisma/prismaDetailedQueries'
import { getCountries } from '../../lib/prisma/prismaQueries'
import { getSocialMediaRanking } from '../../lib/prisma/prismaSocialMedia'
import { SmRankingEntryMinified, TotalScore } from '../../lib/types/SocialMediaTypes'
import { Searchable } from '../../lib/types/UiHelperTypes'
import { generateSearchable } from '../../lib/util'

interface Props {
    stringifiedSocialMediaList: string
    footerContent: FooterContent[]
}

const SocialMediaRanking: NextPage<Props> = ({ stringifiedSocialMediaList, footerContent }: Props) => {

    const socialMediaList: SmRankingEntryMinified[] = JSON.parse(stringifiedSocialMediaList);

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

    const countries = await getCountries();

    // SOCIAL MEDIA
    const socialMediaList = await getSocialMediaRanking();

    const parsedSocialMedia:SmRankingEntryMinified[] = socialMediaList.map((item) => {
        const parsedScore = JSON.parse(item.total_score) as TotalScore;
        const total = parsedScore.data.total;
        return{
            Institution: {
                name: item.Institution.name,
                url: item.Institution.url,
                Country: item.Institution.City.State.Country,
            },
            total_score: total
        }
    });

    parsedSocialMedia.sort((a, b) => {
        return b.total_score - a.total_score;
    });

    const stringifiedSocialMediaList = JSON.stringify(parsedSocialMedia);

    const footerContent: FooterContent[] = [
        { title: "Countries", data: countries, type: "Country" },
    ]

    return {
        props: {
            stringifiedSocialMediaList,
            footerContent
        }
    }

}

export default SocialMediaRanking