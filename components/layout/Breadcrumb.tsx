import { Breadcrumbs, Text, useMantineTheme } from '@mantine/core';
import { City, Country, Institution, State, Subject, SubjectType } from '@prisma/client';
import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { memo } from 'react';
import { URL_INSTITUTION, URL_INSTITUTIONS, URL_LOCATION, URL_LOCATIONS, URL_SEARCH, URL_SOCIAL_MEDIA_RANKING, URL_SUBJECT, URL_SUBJECTS } from '../../lib/url-helper/urlConstants';
import { getLocalizedName, toLink } from '../../lib/util';
import MantineLink from '../elements/MantineLink';

type Props = {

    countryInfo?: Country,
    stateInfo?: State,
    cityInfo?: City,

    subjectTypeInfo?: SubjectType
    subjectInfo?: Subject

    institutionInfo?: Institution

}

// Generate a breadcrumb based on the routers path / query
// This allows us to just use the Breadcrumb Object and provide it with the necessary data to achieve a fully functional breadcrumb on every supported page
const Breadcrumb: NextPage<Props> = ({ countryInfo, stateInfo, cityInfo, subjectTypeInfo, subjectInfo, institutionInfo }: Props) => {

    const theme = useMantineTheme();

    /*
    ================================= TRANSLATION =================================
    */

    const { t, lang } = useTranslation('common');
    const langContent = {
        home: t('nav-home'),
        locations: t('nav-locations'),
        subjects: t('nav-subjects'),
        institutions: t('nav-institutions'),
        search: t('global-search'),
    }

    const checkTranslationNull = (queryString: string | string[] | undefined, translated: string) => {
        if (translated === "") return "" + queryString;
        else return translated;
    }

    const router = useRouter();
    const query = router.query;
    const route = router.route;

    /*
    ================================= GENERATE BREADCRUMB =================================
    */

    const links: { name: string, url: string }[] = [];
    links.push({ name: langContent.home, url: "/" });

    // Handle Breadcrumbs for /location path
    if (route.startsWith(toLink(URL_LOCATION))) {

        links.push({
            name: langContent.locations,
            url: toLink(URL_LOCATIONS)
        });

        if (route.startsWith(toLink(URL_LOCATION, "[Country]"))) {

            let country = query.Country as string;
            let countryTranslated = getLocalizedName({ lang: lang, dbTranslated: countryInfo });

            links.push({
                name: checkTranslationNull(country, countryTranslated),
                url: toLink(URL_LOCATION, country)
            });

            if (route.startsWith(toLink(URL_LOCATION, "[Country]", "[State]"))) {

                let state = query.State as string;
                let stateTranslated = getLocalizedName({ lang: lang, state: stateInfo });
                links.push({
                    name: checkTranslationNull(state, stateTranslated),
                    url: toLink(URL_LOCATION, country, state)
                });

                if (route.startsWith(toLink(URL_LOCATION, "[Country]", "[State]", "[City]"))) {

                    let city = query.City as string;
                    let stateTranslated = "" + cityInfo?.name;
                    links.push({
                        name: checkTranslationNull(state, stateTranslated),
                        url: toLink(URL_LOCATION, country, state, city)
                    });
                }
            }
        }

        // Handle Breadcrumbs for /subject path
    } else if (route.startsWith(toLink(URL_SUBJECT))) {
        links.push({
            name: langContent.subjects,
            url: toLink(URL_SUBJECTS)
        });

        if (route.startsWith(toLink(URL_SUBJECT, "[SubjectCategory]"))) {
            let subjectCategory = query.SubjectCategory as string;
            let subjectCategoryTranslated = getLocalizedName({ lang: lang, any: subjectTypeInfo });
            links.push({
                name: checkTranslationNull(subjectCategory, subjectCategoryTranslated),
                url: toLink(URL_SUBJECT, subjectCategory)
            });

            if (route.startsWith(toLink(URL_SUBJECT, "[SubjectCategory]", "[Subject]"))) {
                let subject = query.Subject as string;
                let subjectTranslated = getLocalizedName({ lang: lang, subject: subjectInfo });
                links.push({
                    name: checkTranslationNull(subject, subjectTranslated),
                    url: toLink(URL_SUBJECT, subjectCategory, subject)
                });
            }
        }

        // Handle Breadcrumbs for /institution path
    } else if (route.startsWith(toLink(URL_INSTITUTION))) {
        links.push({
            name: langContent.institutions,
            url: toLink(URL_INSTITUTIONS)
        });

        if (route.startsWith(toLink(URL_INSTITUTION, "[Country]"))) {
            let country = query.Country as string;
            let countryTranslated = getLocalizedName({ lang: lang, dbTranslated: countryInfo });
            links.push({
                name: checkTranslationNull(country, countryTranslated),
                url: toLink(URL_INSTITUTION, country)
            });

            if (route.startsWith(toLink(URL_INSTITUTION, "[Country]", "[Institution]"))) {
                let institution = query.Institution as string;
                let institutionTranslated = getLocalizedName({ lang: lang, institution: institutionInfo })
                links.push({
                    name: checkTranslationNull(institution, institutionTranslated),
                    url: toLink(URL_INSTITUTION, country, institution)
                });


                if (route.startsWith(toLink(URL_INSTITUTION, "[Country]", "[Institution]", "[Subject]"))) {
                    let subject = query.Subject as string;
                    let subjectTranslated = getLocalizedName({ lang: lang, subject: subjectInfo })
                    links.push({
                        name: checkTranslationNull(subject, subjectTranslated),
                        url: toLink(URL_INSTITUTION, country, institution, subject)
                    });
                }
            }
        }

        // Handle Breadcrumbs for /search path
    } else if (route.startsWith(toLink(URL_SEARCH))) {
        links.push({
            name: langContent.search + ": '" + query.q + "'",
            url: toLink(URL_SEARCH)
        });

    } else if (route.startsWith(toLink(URL_SOCIAL_MEDIA_RANKING))) {
        links.push({
            name: "Social Media Ranking",
            url: toLink(URL_SOCIAL_MEDIA_RANKING)
        });
    }

    // Render Breadcrumbs
    return (
        <Breadcrumbs color='light.0' separator=">">
            {
                links.map((link, i) => (
                    i !== links.length - 1 ? (
                        <MantineLink key={i} label={link.name} url={link.url} />
                    ) : <Text key={i}>{link.name}</Text>
                ))
            }
        </Breadcrumbs>
    )
}

export default memo(Breadcrumb)