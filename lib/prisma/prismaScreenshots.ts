import prisma from './prisma';


export const getInstitutionScreenshots = async (institutionId: string) => {

    return await prisma.institutionScreenshot.findMany({
        where: {
            institution_id: institutionId
        },
        orderBy: {
            timestamp: "desc"
        },
    })

}