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

export type SocialMediaRankingItem = SocialMediaDBEntry & {
    twitterResult: TwitterResult;
    facebookResult: FacebookResult;
    instagramResult: InstagramResult;
    youtubeResult: YoutubeResult;
}

export interface TwitterResult {
    totalScore: number;
}

export interface YoutubeResult {
    totalScore: number;
}

export interface FacebookResult {
    totalScore: number;
}

export interface InstagramResult {
    totalScore: number;
}