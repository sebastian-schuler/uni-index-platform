export type CountryTwitterSummary = {
    followers: number,
    following: number,
    tweets: number,
    listed: number,
    tweetReplies: number,
    tweetRetweets: number,
    tweetLikes: number,
}

export type CountryYoutubeSummary = {
    subscribers: number
    videos: number
    totalViews: number
    videoViews: number
    videoLikes: number
    videoComments: number
    videoFavorites: number
}

export type CountrySocialRating = {
    countryId: string,
    count: number,
    score: {
        total: number,
        twitter: number,
        youtube: number,
        instagram: number,
        facebook: number,
    },
    profile: {
        twitter: CountryTwitterSummary | null
        youtube: CountryYoutubeSummary | null
    }

}