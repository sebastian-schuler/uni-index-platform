import { Space, Title } from '@mantine/core'
import { GetStaticProps, NextPage } from 'next'
import WhitePaper from '../../components/elements/institution/WhitePaper'
import SocialMediaRankingTable from '../../components/elements/SocialMediaRankingTable'
import Breadcrumb from '../../components/layout/Breadcrumb'
import { FooterContent } from '../../components/layout/footer/Footer'
import LayoutContainer from '../../components/layout/LayoutContainer'
import { getDetailedCountries } from '../../lib/prisma/prismaDetailedQueries'
import { getAllSocialMedia } from '../../lib/prisma/prismaQueries'
import { SocialMediaDBEntry, SocialMediaRankingItem } from '../../lib/types/SocialMediaTypes'
import { Searchable } from '../../lib/types/UiHelperTypes'
import { generateSearchable } from '../../lib/util'

interface Props {
    stringifiedSocialMediaItems: string
    footerContent: FooterContent[]
}

const SocialMediaRanking: NextPage<Props> = ({ stringifiedSocialMediaItems, footerContent }: Props) => {

    const socialMediaList: SocialMediaRankingItem[] = JSON.parse(stringifiedSocialMediaItems);

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

const getMaxMin = (socialMediaList: SocialMediaDBEntry[]) => {

    let twitterMax = -1;
    let twitterMin = -1;
    let youtubeMax = -1;
    let youtubeMin = -1;

    socialMediaList.forEach(socialMedia => {

        if (socialMedia.twitter_points > twitterMax || twitterMax === -1) {
            twitterMax = socialMedia.twitter_points;
        } else if (socialMedia.twitter_points < twitterMin || twitterMin === -1) {
            twitterMin = socialMedia.twitter_points;
        }

        if (socialMedia.youtube_points > youtubeMax || youtubeMax === -1) {
            youtubeMax = socialMedia.youtube_points;
        } else if (socialMedia.youtube_points < youtubeMin || youtubeMin === -1) {
            youtubeMin = socialMedia.youtube_points;
        }

    })

    return {
        twitterMax,
        twitterMin,
        youtubeMax,
        youtubeMin
    }

}

export const getStaticProps: GetStaticProps = async (context) => {

    const detailedCountries = await getDetailedCountries();
    const searchableCountries: Searchable[] = generateSearchable({ lang: context.locale, array: { type: "Country", data: detailedCountries } });

    // SOCIAL MEDIA
    const socialMediaList = await getAllSocialMedia();

    const socialMediaMinMax = getMaxMin(socialMediaList);

    const socialMediaRankingItems: SocialMediaRankingItem[] = socialMediaList.map(socialMedia => {
        return {
            ...socialMedia,
            facebookScore: 0,
            twitterScore: (socialMedia.twitter_points / socialMediaMinMax.twitterMax) * 100,
            youtubeScore: (socialMedia.youtube_points / socialMediaMinMax.youtubeMax) * 100,
            instagramScore: 0,
        }
    }).sort((a, b) => Number(b.total_score) - Number(a.total_score));
    const stringifiedSocialMediaItems = JSON.stringify(socialMediaRankingItems);

    const footerContent: FooterContent[] = [
        { title: "Countries", data: searchableCountries, type: "Searchable" },
    ]

    return {
        props: {
            stringifiedSocialMediaItems,
            footerContent
        }
    }

}

export default SocialMediaRanking