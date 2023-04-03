import { country, user_image } from '@prisma/client';
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
            user_image: {
                select: {
                    id: true,
                    filetype: true,
                }
            },
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

        const title = res.title as { [key: string]: string };

        const result: ArticleData = {
            id: res.id,
            excerpt: res.excerpt,
            url: res.url,
            title: title,
            date: Number(res.date_posted),
            content: res.content as JSONContent,
            image: {
                id: res.user_image.id,
                filetype: res.user_image.filetype,
            },
            country: {
                url: res.user.institution.city.state.country.url,
                name: getLocalizedName({ lang, dbTranslated: res.user.institution.city.state.country as country }),
                countryCode: res.user.institution.city.state.country.country_code,
            },
            institution: {
                name: res.user.institution.name,
                url: res.user.institution.url,
            }
        }
        return result;

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
            user_image: {
                select: {
                    id: true,
                    filetype: true,
                }
            },
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

        const title = item.title as { [key: string]: string };

        const result: ArticleCardData = {
            id: item.id,
            excerpt: item.excerpt,
            url: item.url,
            title: title,
            date: Number(item.date_posted),
            image: {
                id: item.user_image.id,
                filetype: item.user_image.filetype,
            },
            country: {
                url: item.user.institution.city.state.country.url,
                name: getLocalizedName({ lang, dbTranslated: item.user.institution.city.state.country as country }),
                countryCode: item.user.institution.city.state.country.country_code,
            },
            institution: {
                name: item.user.institution.name,
                url: item.user.institution.url,
            }
        }
        return result;
    });
}


type NewArticleProps = {
    title: { [key: string]: string }
    user_id: string
    content: JSONContent
    excerpt: string
    url: string
    filetype: string
}

export const addNewArticle = async (props: NewArticleProps) => {
    return await prisma.user_article.create({
        data: {
            title: props.title,
            content: props.content,
            date_posted: Date.now(),
            excerpt: props.excerpt,
            url: props.url,
            user: {
                connect: {
                    id: props.user_id,
                }
            },
            user_image: {
                create: {
                    filetype: props.filetype,
                    upload_date: Date.now(),
                }
            }
        },
        select: {
            id: true,
            user_image: {
                select: {
                    id: true,
                }
            }
        }
    });
}