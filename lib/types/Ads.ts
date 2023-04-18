import { category, subject, subject_category, user_ad } from "@prisma/client";

// AD
export type DetailedUserAd = user_ad & {
    user_image: {
        id: string;
        filetype: string;
    } | null,
    subject: (subject & {
        subject_category: (subject_category & {
            category: category;
        })[];
    }) | null;
    user: {
        institution: {
            url: string;
            name: string;
            city: {
                state: {
                    country: {
                        url: string;
                    }
                }
            };
            institution_city: {
                city: {
                    name: string;
                }
            }[];
        }
    }
};

// AD in account management page
export type ManagedAd = {
    id: string
    user_id: string
    booked_until: number
    booked_from: number
    subject: {
        name: string
    } | null
    type: string
    size: number
    description: string | null
    image_id: string | null
    date_booked: number
    placement: AdPlacement
    title: AdTitle | null
}

export type AdTitle = { [key: string]: string };
export type AdPlacement = {
    generic: string[]
}