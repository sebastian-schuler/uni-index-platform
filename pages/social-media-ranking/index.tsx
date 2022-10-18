import { Space, Title } from '@mantine/core'
import { Country } from '@prisma/client'
import { GetStaticProps, NextPage } from 'next'
import Breadcrumb from '../../components/layout/Breadcrumb'
import { FooterContent } from '../../components/layout/footer/Footer'
import LayoutContainer from '../../components/layout/LayoutContainer'
import SmRankingTable from '../../components/layout/socialmedia/SmRankingTable'
import WhitePaper from '../../components/WhitePaper'
import { getCountries } from '../../lib/prisma/prismaQueries'
import { getSocialMediaRanking } from '../../lib/prisma/prismaSocialMedia'
import { SmRankingEntryMinified } from '../../lib/types/SocialMediaTypes'
import { minifySmRankingItem } from '../../lib/util/conversionUtil'

interface Props {
    countries: Country[],
    socialMediaList: SmRankingEntryMinified[]
    footerContent: FooterContent[]
}

const SocialMediaRanking: NextPage<Props> = ({ countries, socialMediaList, footerContent }: Props) => {

    return (
        <LayoutContainer footerContent={footerContent}>

            <Breadcrumb />

            <Title mb={"md"}>Social-Media Ranking</Title>

            <WhitePaper py={"lg"}>

                <Space h="lg" />
                <SmRankingTable
                    countries={countries}
                    socialMediaList={socialMediaList}
                />

            </WhitePaper>

        </LayoutContainer>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {

    const countries = await getCountries();

    // SOCIAL MEDIA
    const rawSocialMediaList = await getSocialMediaRanking();
    let socialMediaList: SmRankingEntryMinified[] = rawSocialMediaList.map((item) => minifySmRankingItem(item));
    socialMediaList = socialMediaList.filter((item) => item.total_score > 0);
    socialMediaList.sort((a, b) => {
        return b.total_score - a.total_score;
    });

    const footerContent: FooterContent[] = [
        { title: "Countries", data: countries, type: "Country" },
    ]

    return {
        props: {
            countries,
            socialMediaList,
            footerContent
        }
    }

}

export default SocialMediaRanking