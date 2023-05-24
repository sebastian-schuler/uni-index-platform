export type YoutubeMetaData = {
    id: string
    channelName: string
    title: string
    description: string
    publishedAt: string
    customUrl: string
    country: string
    mostCommonTags: string[]
    lastStatisticsUpdate: number
    metrics: {
        viewCount: number
        subscriberCount: number
        videoCount: number
        avgVideosPerMonth: number
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

export type YoutubeScoredVideo = {
    id: string
    description: string
    title: string
    tags: string[]
    publishedAt: string
    videoStatistics: {
        viewCount: number
        likeCount: number
        favoriteCount: number
        commentCount: number
    }
}

export type YoutubeChannel = {
    institutionId: string;
    meta: YoutubeMetaData;
    raw: YoutubeRawScore;
    score: number;
    bestVideos: YoutubeScoredVideo[];
}