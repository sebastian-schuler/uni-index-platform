export type TwitterMetaData = {
    id: string;
    username: string;
    name: string;
    description: string;
    createdAt: string;
    verified: boolean;
    url: string;
    location: string;
    pinnedTweetId: string;
    lastProfileUpdate: number;
    lastTweetUpdate: number;
    metrics: {
        followerCount: number;
        followingCount: number;
        tweetCount: number;
        listedCount: number;
        avgTweetsPerMonth: number;
    }
}

export type TwitterRawScore = {
    averages: {
        avgLikes: number;
        avgRetweets: number;
        avgReplies: number;
        avgQuotes: number;
        avgImpressions: number;
    },
    multiplier: {
        isLinked: boolean;
        isVerified: boolean;
        isLinkedModifier: number;
        isVerifiedModifier: number;
    }
    interaction: number;
    profile: number;
    rating: number;
};

export type TwitterProfile = {
    institutionId: string;
    meta: TwitterMetaData;
    raw: TwitterRawScore;
    score: number;
    bestTweets: string[];
}