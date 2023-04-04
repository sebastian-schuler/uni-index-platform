import { Prisma, user_ad } from '@prisma/client';
import prisma from './prisma';

type NewAdProps = {
    title: { [key: string]: string } | undefined
    booked_from: number
    booked_until: number
    type: string
    size: number
    placement: { generic: string[] }
    user_id: string
    subject_id: string | null
    description: string | null
    withImage: boolean
    filetype: string | null
}

export const addNewAd = async ({ title, booked_from, booked_until, type, size, placement, description, subject_id, user_id, withImage, filetype }: NewAdProps) => {

    return await prisma.user_ad.create({
        data: {
            title: title,
            booked_from: booked_from,
            booked_until: booked_until,
            type: type,
            size: size,
            placement: placement,
            description: description,
            date_booked: Date.now(),

            // Only connect if the subject_id is not null
            subject: subject_id ? {
                connect: {
                    id: subject_id,
                }
            } : undefined,

            user: {
                connect: {
                    id: user_id,
                }
            },

            // Only create if the user wants to upload an image
            user_image: withImage && filetype ? {
                create: {
                    filetype: filetype,
                    upload_date: Date.now(),
                }
            } : undefined
        },
        select: {
            id: true,
            user_image: {
                select: {
                    id: true,
                }
            }
        }
    })
}