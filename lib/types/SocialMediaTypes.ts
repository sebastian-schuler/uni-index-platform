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
    twitterScore: number;
    youtubeScore: number;
    facebookScore: number;
    instagramScore: number;
}