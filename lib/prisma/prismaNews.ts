import { Country } from '@prisma/client';
import { ArticleCardData, ArticleData } from '../types/UiHelperTypes';
import { getLocalizedName } from '../util/util';
import prisma from './prisma';

export const getAdPostByUrl = async (postUrl: string, institutionUrl: string, lang: string): Promise<ArticleData | null> => {

    const userRes = await prisma.institution.findUnique({
        where: {
            url: institutionUrl,
        },
        select: {
            User: {
                select: {
                    id: true,
                }
            }
        }
    });

    if (!userRes || userRes.User.length === 0) return null; // TODO Should change database so that an institution can only have one user

    const userId = userRes.User[0].id;

    const res = await prisma.userAdPost.findUnique({
        where: {
            url_user_id: {
                url: postUrl,
                user_id: userId,
            }
        },
        include: {
            User: {
                select: {
                    Institution: {
                        select: {
                            name: true,
                            url: true,
                            City: {
                                select: {
                                    State: {
                                        select: {
                                            Country: {
                                                select: {
                                                    name: true,
                                                    url: true,
                                                    translations: true,
                                                    country_code: true,
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (res) {
        return ({
            id: res.id,
            excerpt: res.excerpt,
            url: res.url,
            title: res.title,
            imageUrl: res.image,
            date: Number(res.date_posted),
            content: res.content,
            Country: {
                url: res.User.Institution.City.State.Country.url,
                name: getLocalizedName({ lang, dbTranslated: res.User.Institution.City.State.Country as Country }),
                countryCode: res.User.Institution.City.State.Country.country_code,
            },
            Institution: {
                name: res.User.Institution.name,
                url: res.User.Institution.url,
            }
        });
    } else {
        return null;
    }
}

export const getAllAdPosts = async (lang: string, institutionIdFilter?: string): Promise<ArticleCardData[]> => { // 

    const res = await prisma.userAdPost.findMany({
        where: {
            User: {
                Institution: {
                    id: institutionIdFilter,
                }
            }
        },
        select: {
            id: true,
            title: true,
            excerpt: true,
            image: true,
            url: true,
            date_posted: true,
            User: {
                select: {
                    Institution: {
                        select: {
                            name: true,
                            url: true,
                            City: {
                                select: {
                                    State: {
                                        select: {
                                            Country: {
                                                select: {
                                                    name: true,
                                                    url: true,
                                                    translations: true,
                                                    country_code: true,
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    return res.map((item) => {
        return ({
            id: item.id,
            excerpt: item.excerpt,
            url: item.url,
            title: item.title,
            imageUrl: item.image,
            date: Number(item.date_posted),
            Country: {
                url: item.User.Institution.City.State.Country.url,
                name: getLocalizedName({ lang, dbTranslated: item.User.Institution.City.State.Country as Country }),
                countryCode: item.User.Institution.City.State.Country.country_code,
            },
            Institution: {
                name: item.User.Institution.name,
                url: item.User.Institution.url,
            }
        })
    });
}