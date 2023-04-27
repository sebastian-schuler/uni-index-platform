export type YoutubeMetaData = {
    id: string
    channelName: string
    title: string
    description: string
    publishedAt: string
    customUrl: string
    country: string
    lastStatisticsUpdate: number
    metrics: {
        viewCount: number
        subscriberCount: number
        videoCount: number
    },
}

export type YoutubeRawScore = {
    averages: {
        avgLikes: number;
        avgComments: number;
        avgFavorites: number;
        avgViews: number;
    },
    multiplier: {
        isWellTagged: boolean;
        percentWellTagged: number;
        isWellTaggedModifier: number;
    }
    interaction: number;
    profile: number;
    rating: number;
};

export type YoutubeChannel = {
    institutionId: string;
    meta: YoutubeMetaData;
    raw: YoutubeRawScore;
    score: number;
    bestVideos: string[];
}