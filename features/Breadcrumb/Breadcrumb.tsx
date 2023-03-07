import { Breadcrumbs, createStyles, Text } from '@mantine/core';
import { City, Country, Institution, State, Subject, SubjectType } from '@prisma/client';
import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { memo } from 'react';
import MantineLink from '../../components/Link/MantineLink';
import { URL_INSTITUTION, URL_INSTITUTIONS, URL_INSTITUTION_OM, URL_INSTITUTION_OM_ACCESSIBILITY, URL_INSTITUTION_OM_BESTPRACTICES, URL_INSTITUTION_OM_PERFORMANCE, URL_INSTITUTION_OM_PWA, URL_INSTITUTION_OM_SEO, URL_INSTITUTION_SOCIALMEDIA, URL_INSTITUTION_SOCIALMEDIA_TW, URL_INSTITUTION_SOCIALMEDIA_YT, URL_LOCATION, URL_LOCATIONS, URL_SEARCH, URL_SOCIAL_MEDIA, URL_SOCIAL_MEDIA_RANKING, URL_SOCIAL_MEDIA_STATISTICS, URL_CATEGORY, URL_CATEGORIES, URL_ANALYSIS } from '../../lib/url-helper/urlConstants';
import { getLocalizedName, toLink } from '../../lib/util/util';

const useStyles = createStyles((theme) => {

    return {
        root: {
            alignItems: 'baseline',
            flexWrap: 'wrap',
        },
        separator: {
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
        breadcrumb: {
            whiteSpace: 'pre-wrap'
        }
    };
});

interface Props {

    countryInfo?: Country | null,
    stateInfo?: State | null,
    cityInfo?: City | null,

    subjectTypeInfo?: SubjectType | null
    subjectInfo?: Subject | null

    institutionInfo?: Institution | null

}

// Generate a breadcrumb based on the routers path / query
// This allows us to just use the Breadcrumb Object and provide it with the necessary data to achieve a fully functional breadcrumb on every supported page
const Breadcrumb: NextPage<Props> = ({ countryInfo, stateInfo, cityInfo, subjectTypeInfo, subjectInfo, institutionInfo }: Props) => {

    const { classes } = useStyles();

    /*
    ================================= TRANSLATION =================================
    */

    const { t, lang } = useTranslation('common');
    const langContent = {
        home: t('nav.home'),
        locations: t('nav.locations'),
        categories: t('nav.categories'),
        institutions: t('nav.institutions'),
        search: t('global-search'),
        analysis: t('nav.analysis'),
        socialMediaStatistic: t('breadcrumbs.social-media-statistics'),
        socialMediaRanking: t('breadcrumbs.social-media-ranking'),
    }

    const checkTranslationNull = (queryString: string | string[] | undefined, translated: string) => {
        if (translated === "") return "" + queryString;
        else return translated;
    }
    const { query, route } = useRouter();

    /*
    ================================= GENERATE BREADCRUMB =================================
    */

    const links: { name: string, url: string }[] = [];
    links.push({ name: langContent.home, url: "/" });

    if (route.startsWith(toLink(URL_LOCATION))) {
        // LOCATIONS PATH
        links.push({
            name: langContent.locations,
            url: toLink(URL_LOCATIONS)
        });

        if (route.startsWith(toLink(URL_LOCATION, "[Country]"))) {
            // LOCATIONS > COUNTRY
            let country = query.Country as string;
            let countryTranslated = getLocalizedName({ lang: lang, dbTranslated: countryInfo });
            links.push({
                name: checkTranslationNull(country, countryTranslated),
                url: toLink(URL_LOCATION, country)
            });

            if (route.startsWith(toLink(URL_LOCATION, "[Country]", "[State]"))) {
                // LOCATIONS > COUNTRY > STATE
                let state = query.State as string;
                let stateTranslated = getLocalizedName({ lang: lang, state: stateInfo });
                links.push({
                    name: checkTranslationNull(state, stateTranslated),
                    url: toLink(URL_LOCATION, country, state)
                });

                if (route.startsWith(toLink(URL_LOCATION, "[Country]", "[State]", "[City]"))) {
                    // LOCATIONS > COUNTRY > STATE > CITY
                    let city = query.City as string;
                    let stateTranslated = "" + cityInfo?.name;
                    links.push({
                        name: checkTranslationNull(state, stateTranslated),
                        url: toLink(URL_LOCATION, country, state, city)
                    });
                }
            }
        }

    } else if (route.startsWith(toLink(URL_CATEGORY)) || route.startsWith(toLink(URL_CATEGORIES))) {
        // CATEGORIES PATH
        links.push({
            name: langContent.categories,
            url: toLink(URL_CATEGORIES)
        });

        if (route.startsWith(toLink(URL_CATEGORY, "[Category]"))) {
            // CATEGORIES > CATEGORY
            let category = query.SubjectCategory as string;
            let categoryTranslated = getLocalizedName({ lang: lang, any: subjectTypeInfo });
            links.push({
                name: checkTranslationNull(category, categoryTranslated),
                url: toLink(URL_CATEGORY, category)
            });

            if (route.startsWith(toLink(URL_CATEGORY, "[Category]", "[Subject]"))) {
                // CATEGORIES > CATEGORY > SUBJECT
                let subject = query.Subject as string;
                let subjectTranslated = getLocalizedName({ lang: lang, subject: subjectInfo });
                links.push({
                    name: checkTranslationNull(subject, subjectTranslated),
                    url: toLink(URL_CATEGORY, category, subject)
                });
            }
        }

    } else if (route.startsWith(toLink(URL_INSTITUTION))) {
        // INSTITUTIONS PATH
        links.push({
            name: langContent.institutions,
            url: toLink(URL_INSTITUTIONS)
        });

        if (route.startsWith(toLink(URL_INSTITUTION, "[Country]"))) {
            // INSTITUTIONS > COUNTRY
            let country = query.Country as string;
            let countryTranslated = getLocalizedName({ lang: lang, dbTranslated: countryInfo });
            links.push({
                name: checkTranslationNull(country, countryTranslated),
                url: toLink(URL_INSTITUTION, country)
            });

            if (route.startsWith(toLink(URL_INSTITUTION, "[Country]", "[Institution]"))) {
                // INSTITUTIONS > COUNTRY > INSTITUTION
                let institution = query.Institution as string;
                let institutionTranslated = getLocalizedName({ lang: lang, institution: institutionInfo })
                links.push({
                    name: checkTranslationNull(institution, institutionTranslated),
                    url: toLink(URL_INSTITUTION, country, institution)
                });

                if (route.startsWith(toLink(URL_INSTITUTION, "[Country]", "[Institution]", URL_INSTITUTION_SOCIALMEDIA))) {
                    // INSTITUTIONS > COUNTRY > INSTITUTION > SOCIAL MEDIA
                    links.push({
                        name: "Social Media",
                        url: toLink(URL_INSTITUTION, country, institution, URL_INSTITUTION_SOCIALMEDIA)
                    });

                    if (route.startsWith(toLink(URL_INSTITUTION, "[Country]", "[Institution]", URL_INSTITUTION_SOCIALMEDIA, URL_INSTITUTION_SOCIALMEDIA_TW))) {
                        // INSTITUTIONS > COUNTRY > INSTITUTION > SOCIAL MEDIA > TWITTER
                        links.push({
                            name: "Twitter",
                            url: toLink(URL_INSTITUTION, country, institution, URL_INSTITUTION_SOCIALMEDIA, URL_INSTITUTION_SOCIALMEDIA_TW)
                        });

                    } else if (route.startsWith(toLink(URL_INSTITUTION, "[Country]", "[Institution]", URL_INSTITUTION_SOCIALMEDIA, URL_INSTITUTION_SOCIALMEDIA_YT))) {
                        // INSTITUTIONS > COUNTRY > INSTITUTION > SOCIAL MEDIA > YOUTUBE
                        links.push({
                            name: "Youtube",
                            url: toLink(URL_INSTITUTION, country, institution, URL_INSTITUTION_SOCIALMEDIA, URL_INSTITUTION_SOCIALMEDIA_YT)
                        });
                    }
                } else if (route.startsWith(toLink(URL_INSTITUTION, "[Country]", "[Institution]", URL_INSTITUTION_OM))) {
                    // INSTITUTIONS > COUNTRY > INSTITUTION > ONLINE MARKETING
                    links.push({
                        name: "Online Marketing",
                        url: toLink(URL_INSTITUTION, country, institution, URL_INSTITUTION_OM)
                    });

                    if (route.startsWith(toLink(URL_INSTITUTION, "[Country]", "[Institution]", URL_INSTITUTION_OM, URL_INSTITUTION_OM_PERFORMANCE))) {
                        // INSTITUTIONS > COUNTRY > INSTITUTION > ONLINE MARKETING > PERFORMANCE
                        links.push({
                            name: "Performance",
                            url: toLink(URL_INSTITUTION, country, institution, URL_INSTITUTION_OM, URL_INSTITUTION_OM_PERFORMANCE)
                        });

                    } else if (route.startsWith(toLink(URL_INSTITUTION, "[Country]", "[Institution]", URL_INSTITUTION_OM, URL_INSTITUTION_OM_SEO))) {
                        // INSTITUTIONS > COUNTRY > INSTITUTION > ONLINE MARKETING > SEO
                        links.push({
                            name: "SEO",
                            url: toLink(URL_INSTITUTION, country, institution, URL_INSTITUTION_OM, URL_INSTITUTION_OM_SEO)
                        });
                    } else if (route.startsWith(toLink(URL_INSTITUTION, "[Country]", "[Institution]", URL_INSTITUTION_OM, URL_INSTITUTION_OM_BESTPRACTICES))) {
                        // INSTITUTIONS > COUNTRY > INSTITUTION > ONLINE MARKETING > BEST PRACTICES
                        links.push({
                            name: "Best Practices",
                            url: toLink(URL_INSTITUTION, country, institution, URL_INSTITUTION_OM, URL_INSTITUTION_OM_BESTPRACTICES)
                        });
                    } else if (route.startsWith(toLink(URL_INSTITUTION, "[Country]", "[Institution]", URL_INSTITUTION_OM, URL_INSTITUTION_OM_ACCESSIBILITY))) {
                        // INSTITUTIONS > COUNTRY > INSTITUTION > ONLINE MARKETING > ACCESSIBILITY
                        links.push({
                            name: "Accessibility",
                            url: toLink(URL_INSTITUTION, country, institution, URL_INSTITUTION_OM, URL_INSTITUTION_OM_ACCESSIBILITY)
                        });
                    } else if (route.startsWith(toLink(URL_INSTITUTION, "[Country]", "[Institution]", URL_INSTITUTION_OM, URL_INSTITUTION_OM_PWA))) {
                        // INSTITUTIONS > COUNTRY > INSTITUTION > ONLINE MARKETING > PWA
                        links.push({
                            name: "PWA",
                            url: toLink(URL_INSTITUTION, country, institution, URL_INSTITUTION_OM, URL_INSTITUTION_OM_PWA)
                        });
                    }

                } else if (route.startsWith(toLink(URL_INSTITUTION, "[Country]", "[Institution]", "[Subject]"))) {
                    // INSTITUTIONS > COUNTRY > INSTITUTION > SUBJECT
                    let subject = query.Subject as string;
                    let subjectTranslated = getLocalizedName({ lang: lang, subject: subjectInfo })
                    links.push({
                        name: checkTranslationNull(subject, subjectTranslated),
                        url: toLink(URL_INSTITUTION, country, institution, subject)
                    });
                }
            }
        }
    } else if (route.startsWith(toLink(URL_SEARCH))) {
        // SEARCH PATH
        links.push({
            name: langContent.search + ": '" + query.q + "'",
            url: toLink(URL_SEARCH)
        });

    } else if (route.startsWith(toLink(URL_ANALYSIS))) {
        links.push({
            name: langContent.analysis,
            url: toLink(URL_ANALYSIS)
        });

        if (route.startsWith(toLink(URL_ANALYSIS, URL_SOCIAL_MEDIA, URL_SOCIAL_MEDIA_RANKING))) {
            // SOCIAL MEDIA RANKING PATH
            links.push({
                name: langContent.socialMediaRanking,
                url: toLink(URL_ANALYSIS, URL_SOCIAL_MEDIA, URL_SOCIAL_MEDIA_RANKING)
            });
        } else if (route.startsWith(toLink(URL_ANALYSIS, URL_SOCIAL_MEDIA, URL_SOCIAL_MEDIA_STATISTICS))) {
            // SOCIAL MEDIA TWITTER PATH
            links.push({
                name: langContent.socialMediaStatistic,
                url: toLink(URL_ANALYSIS, URL_SOCIAL_MEDIA, URL_SOCIAL_MEDIA_STATISTICS)
            });
        }

    }

    // Render Breadcrumbs
    return (
        <Breadcrumbs
            separator=">"
            classNames={{ root: classes.root, separator: classes.separator, breadcrumb: classes.breadcrumb }}
        >
            {
                links.map((link, i) => (
                    i !== links.length - 1 ? (
                        <MantineLink key={i} url={link.url} type="internal">{link.name}</MantineLink>
                    ) : <Text key={i}>{link.name}</Text>
                ))
            }
        </Breadcrumbs>
    )
}

export default memo(Breadcrumb);