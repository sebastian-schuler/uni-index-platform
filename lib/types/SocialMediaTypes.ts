import { City, Country, Institution, InstitutionSocialMedia, State } from "@prisma/client";

export type SocialMediaDBEntry = InstitutionSocialMedia & {
    Institution: Institution & {
        City: City & {
            State: State & {
                Country: Country;
            }
        }
    };
}

export type SocialMediaRankingEntry = {
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
    total_score: number;
    last_update: bigint;
}

export type SocialMediaRankingItem = SocialMediaDBEntry & {
    twitterData: TwitterResult;
    facebookData: FacebookResult;
    instagramData: InstagramResult;
    youtubeData: YoutubeChannelData;
}

export interface TwitterResult {
    totalScore: number;
}

export interface TwitterScore {
    total: number
    follower: number
    following: number
    tweets: number
    listed: number
    likes: number
    verifiedMultiplier: number
    websitelinkMultiplier: number
}

// -------------- YOUTUBE --------------

export interface YoutubeScore {
    total: number
    subs: number
    views: number
    videos: number
}

export type YoutubeChannelData = YoutubeChannelStatistics & {
    videos: YoutubeVideo[]
}

export type YoutubeChannelStatistics = {
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

export type YoutubeVideo = {
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