export type CountryTwitterSummary = {
    avgFollowers: number,
    avgFollowing: number,
    avgTweets: number,
    avgListed: number,
}

export type CountryYoutubeSummary = {
    avgSubscribers: number
    avgVideos: number
    avgViews: number
}

export type CountrySocialRating = {
    countryId: string,
    count: number,
    score: {
        avgTotal: number,
        avgTwitter: number,
        avgYoutube: number,
        avgInstagram: number,
        avgFacebook: number,
    },
    profile: {
        twitter: CountryTwitterSummary | null,
        youtube: CountryYoutubeSummary | null,
    }
}