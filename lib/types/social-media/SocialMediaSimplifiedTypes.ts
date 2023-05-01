import { TwitterProfile } from "./TwitterTypes";
import { YoutubeChannel } from "./YoutubeTypes";

/**
 * All necessary data to display a social media ranking item
 */
export type SocialMediaGenericRankingItem = {
    institution_id: string;
    last_update: string;
    institution: {
        url: string;
        name: string;
    };
    country: {
        id: string;
    };
    total_score: number;
    twitter_score: number;
    youtube_score: number;
    instagram_score: number;
    facebook_score: number;
}

/**
 * All necessary data to display a social media best card
 */
export type BestSocialMediaItem = ({
    institution_id: string;
    last_update: string;
    institution: {
        href: string;
        name: string;
    };
    country: {
        name: string;
        href: string;
    }
    href: string | null;
}
    & (
        TwitterProfile & {
            type: "twitter"
        } |
        YoutubeChannel & {
            type: "youtube"
        }
    )
);

export type SocialMediaLargeItem = {
    institution_id: string;
    last_update: string;

    twitter_url: string | null;
    twitter_data: TwitterProfile | null;
    twitter_score: number;

    youtube_url: string | null;
    youtube_data: YoutubeChannel | null;
    youtube_score: number;

    instagram_url: string | null;
    instagram_score: number;

    facebook_url: string | null;
    facebook_score: number;

    total_score: number;
}