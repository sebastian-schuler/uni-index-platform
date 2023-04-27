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

