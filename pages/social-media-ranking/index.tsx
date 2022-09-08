import { GetStaticProps, NextPage } from 'next'
import Breadcrumb from '../../components/layout/Breadcrumb'
import { FooterContent } from '../../components/layout/footer/Footer'
import LayoutContainer from '../../components/layout/LayoutContainer'
import { getDetailedCountries } from '../../lib/prismaDetailedQueries'
import { getAllSocialMedia } from '../../lib/prismaQueries'
import { SocialMediaDBEntry, SocialMediaRankingItem } from '../../lib/types/SocialMediaTypes'
import { Searchable } from '../../lib/types/UiHelperTypes'
import { generateSearchable } from '../../lib/util'

// const columns: GridColDef[] = [
//     {
//         field: 'id',
//         headerName: 'Rank',
//         type: 'number',
//         width: 70
//     },
//     {
//         field: 'name',
//         headerName: 'Name',
//         flex: 1,
//     },
//     {
//         field: 'country',
//         headerName: 'Country',
//         flex: 0.5,
//     },
//     {
//         field: 'totalScore',
//         headerName: 'Total Score',
//         type: 'number',
//         flex: 0.3,
//         valueFormatter: (params: GridValueFormatterParams<number>) => {
//             if (params.value == null) return '';
//             const rounded = Math.round((params.value + Number.EPSILON) * 100) / 100;
//             return `${rounded} %`;
//         },
//     },
//     {
//         field: 'twitterScore',
//         headerName: 'Twitter Score',
//         type: 'number',
//         flex: 0.3,
//         valueFormatter: (params: GridValueFormatterParams<number>) => {
//             if (params.value == null) return '';
//             const rounded = Math.round((params.value + Number.EPSILON) * 100) / 100;
//             return `${rounded} %`;
//         },
//     },
//     {
//         field: 'youtubeScore',
//         headerName: 'YouTube Score',
//         type: 'number',
//         flex: 0.3,
//         valueFormatter: (params: GridValueFormatterParams<number>) => {
//             if (params.value == null) return '';
//             const rounded = Math.round((params.value + Number.EPSILON) * 100) / 100;
//             return `${rounded} %`;
//         },
//     },
    // {
    //     field: 'fullName',
    //     headerName: 'Full name',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     width: 160,
    //     valueGetter: (params: GridValueGetterParams) =>
    //         `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    // },
// ];

interface Props {
    stringifiedSocialMediaItems: string
    footerContent: FooterContent[]
}

const SocialMediaRanking: NextPage<Props> = ({stringifiedSocialMediaItems,footerContent}:Props) => {

    // Calculate % values for each social media

    const socialMediaList: SocialMediaRankingItem[] = JSON.parse(stringifiedSocialMediaItems);

    // socialMediaList[9].

    type SocialMediaTableItem = {
        id: number
        name: string
        country: string
        totalScore: number
        twitterScore: number
        youtubeScore: number
    }

    const socialMediaTableItems: SocialMediaTableItem[] = socialMediaList.map((socialMediaItem, i) => {
        return {
            id: i + 1,
            name: socialMediaItem.Institution.name,
            country: "Germany",
            totalScore: Number(socialMediaItem.total_score),
            twitterScore: Number(socialMediaItem.twitterScore),
            youtubeScore: Number(socialMediaItem.youtubeScore),
        }
    });

    console.log(socialMediaTableItems);

    return (
        <LayoutContainer footerContent={footerContent}>

            <Breadcrumb />

            {/* <div style={{ height: 400, width: '100%' }}> */}


            {/* <DataGrid
                rows={socialMediaTableItems}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                autoHeight
            /> */}


            {/* </div> */}

            {/* {
                socialMediaList.map((item,i) => (
                    <Box key={i}>
                        <Typography>{item.Institution.name}</Typography>
                        Youtube { 
                            item.youtubeScore
                        }%
                        Twitter {
                            item.twitterScore
                        }%
                    </Box>
                ))
            } */}

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
    }).sort((a, b) => Number(b.total_score) - Number(a.total_score) );
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