import { country } from '@prisma/client';
import { getLocalizedName } from '../util/util';
import prisma from './prisma';
import { ArticleCardData, ArticleData } from '../types/ArticleTypes';
import { JSONContent } from '@tiptap/react';

export const getAdPostByUrl = async (postUrl: string, institutionUrl: string, lang: string): Promise<ArticleData | null> => {

    const userRes = await prisma.institution.findUnique({
        where: {
            url: institutionUrl,
        },
        select: {
            user: {
                select: {
                    id: true,
                }
            }
        }
    });

    if (!userRes || userRes.user.length === 0) return null; // TODO Should change database so that an institution can only have one user

    const userId = userRes.user[0].id;

    const res = await prisma.user_article.findUnique({
        where: {
            url_user_id: {
                url: postUrl,
                user_id: userId,
            }
        },
        include: {
            user: {
                select: {
                    institution: {
                        select: {
                            name: true,
                            url: true,
                            city: {
                                select: {
                                    state: {
                                        select: {
                                            country: {
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
            imageUrl: res.image_id,
            date: Number(res.date_posted),
            content: res.content as JSONContent,
            country: {
                url: res.user.institution.city.state.country.url,
                name: getLocalizedName({ lang, dbTranslated: res.user.institution.city.state.country as country }),
                countryCode: res.user.institution.city.state.country.country_code,
            },
            institution: {
                name: res.user.institution.name,
                url: res.user.institution.url,
            }
        });
    } else {
        return null;
    }
}

export const getAllAdPosts = async (lang: string, institutionIdFilter?: string): Promise<ArticleCardData[]> => { // 

    const res = await prisma.user_article.findMany({
        where: {
            user: {
                institution: {
                    id: institutionIdFilter,
                }
            }
        },
        select: {
            id: true,
            title: true,
            excerpt: true,
            image_id: true,
            url: true,
            date_posted: true,
            user: {
                select: {
                    institution: {
                        select: {
                            name: true,
                            url: true,
                            city: {
                                select: {
                                    state: {
                                        select: {
                                            country: {
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
            imageUrl: item.image_id,
            date: Number(item.date_posted),
            country: {
                url: item.user.institution.city.state.country.url,
                name: getLocalizedName({ lang, dbTranslated: item.user.institution.city.state.country as country }),
                countryCode: item.user.institution.city.state.country.country_code,
            },
            institution: {
                name: item.user.institution.name,
                url: item.user.institution.url,
            }
        })
    });
}