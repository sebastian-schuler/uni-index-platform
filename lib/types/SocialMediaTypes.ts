import { Institution, InstitutionSocialMedia } from "@prisma/client";

export type SocialMediaDBEntry = InstitutionSocialMedia & {
    Institution: Institution;
}

export type SocialMediaRankingItem = SocialMediaDBEntry & {
    twitterScore: number;
    youtubeScore: number;
    facebookScore: number;
    instagramScore: number;
}