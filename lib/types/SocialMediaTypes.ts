import { City, Country, Institution, InstitutionSocialMedia, State } from "@prisma/client";

export type SocialMediaPages = "youtube" | "twitter"

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
    combinedScore: number,
    youtubeScore: number,
    twitterScore: number,
}

export type SmBestCardMinified = {
    type: "youtube"
    Institution: {
        name: string
        url: string
        countryName: string
    }
    youtubeScore: number,
    totalSubscribers: number,
    totalVideos: number,
    avgViews: number,
    avgComments: number,
} | {
    type: "twitter"
    Institution: {
        name: string
        url: string
        countryName: string
    }
    twitterScore: number
    totalFollowers: number
    totalTweets: number
    avgLikes: number
    avgRetweets: number
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

export interface YoutubeProfile {
    subscribers: number
    views: number
    videos: number
    averageLikes: number
    averageViews: number
    averageComments: number
    averageFavorites: number
    descriptionGood: boolean
    videosHaveTags: boolean
}

export interface TwitterProfile {
    followers: number
    following: number
    tweets: number
    listed: number
    avgLikes: number
    avgRetweets: number
    avgReplies: number
    isVerified: boolean
    isWebsiteLinked: boolean
}

export interface TotalScore {
    percent: {
        all: TotalScoreSet
        twitter: TotalScoreSet
        youtube: TotalScoreSet
    }
    raw: {
        all: TotalScoreSet
        twitter: TotalScoreSet
        youtube: TotalScoreSet
    }
}

export interface TotalScoreSet {
    total: number
    totalContentOutput: number
    profilesCompleted: number
    averageInteraction: number
    averageImpressions: number
    totalReach: number
}