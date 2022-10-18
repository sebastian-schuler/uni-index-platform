import { City, Country, Institution, InstitutionSocialMedia, State } from "@prisma/client";

export interface SocialMediaDBEntry extends InstitutionSocialMedia {
    Institution: Institution & {
        City: City & {
            State: State & {
                Country: Country;
            }
        }
    };
}

export interface SmRankingEntry {
    Institution: {
        City: {
            State: {
                Country: Country
            };
        };
        name: string;
        url: string;
    };
    institution_id: string;
    total_score: string;
    last_update: bigint;
}

export interface SmRankingEntryMinified {
    Institution: {
        name: string
        url: string
        countryId: string
    }
    total_score: number,
    yt_total_score: number,
    tw_total_score: number,
}

// -------------- YOUTUBE --------------

export interface YoutubeChannelData extends YoutubeChannelStatistics {
    videos: YoutubeVideo[]
}

export interface YoutubeChannelStatistics {
    id: string
    institutionId: string
    channelName: string
    metadata: {
        title: string
        description: string
        publishedAt: string
        customUrl: string
        country: string
        lastStatisticsUpdate: number
    };
    channelMetrics: {
        viewCount: number
        subscriberCount: number
        hiddenSubscriberCount: boolean
        videoCount: number
    },
}

export interface YoutubeVideo {
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

// -------------- FACEBOOK & INSTA --------------

export interface FacebookResult {
    totalScore: number;
}

export interface InstagramResult {
    totalScore: number;
}

// -------------- RATINGS --------------

export interface YoutubeResults {
    total: number
    subs: number
    views: number
    videos: number
    averageLikes: number
    averageViews: number
    averageComments: number
    descriptionGood: number
    videosHaveTags: number
}

export interface TwitterResults {
    total: number
    followers: number
    following: number
    tweets: number
    listed: number
    averageLikes: number
    averageRetweets: number
    averageInteraction: number
    verifiedMultiplier: number
    websitelinkMultiplier: number
}

export interface TotalScore {
    all: TotalScoreSet
    percentData: TotalScoreSet
    youtubeOnly: TotalScoreSet
    twitterOnly: TotalScoreSet
}

export interface TotalScoreSet {
    total: number
    totalContentOutput: number
    profilesCompleted: number
    averageInteraction: number
    averageImpressions: number
    totalReach: number
}