import prisma from './prisma';


export const getInstitutionScreenshots = async (institutionId: string) => {

    return await prisma.institution_screenshot.findMany({
        where: {
            institution_id: institutionId
        },
        orderBy: {
            timestamp: "desc"
        },
    })

}