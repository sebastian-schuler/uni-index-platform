import { Card, CardSection, createStyles, Table, Text } from '@mantine/core';
import { Country } from '@prisma/client';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import MantineLink from '../../components/Link/MantineLink';
import CardTitle from '../../components/Text/CardTitle';
import { SmRankingEntryMinified } from '../../lib/types/SocialMediaTypes';
import { URL_INSTITUTION, URL_SOCIAL_MEDIA, URL_SOCIAL_MEDIA_RANKING } from '../../lib/url-helper/urlConstants';
import { toLink } from '../../lib/util/util';

const useStyles = createStyles((theme) => ({

    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
        height: "100%",
    },

    scoreColumn: {
        textAlign: 'right',
    },

    topSection: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },

    bottomSection: {
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        padding: theme.spacing.md,
        marginTop: theme.spacing.md,
    },

}));

interface Props {
    socialMediaList: SmRankingEntryMinified[]
    countries: Country[]
}

const SmIndexTopRanking: React.FC<Props> = ({ socialMediaList, countries }: Props) => {

    const { classes, theme } = useStyles();
    const { t, lang } = useTranslation("index");

    const rows = socialMediaList.map((row, i) => {

        const country = countries.find(c => c.id === row.Institution.countryId);
        const url = toLink(URL_INSTITUTION, country?.url || "", row.Institution.url, "social-media");

        return (
            <tr key={row.Institution.name + i}>
                <td>
                    <MantineLink url={url} type="internal">{row.Institution.name}</MantineLink>
                </td>
                <td>{country?.name}</td>
                <td className={classes.scoreColumn}>{Math.round(row.combinedScore).toLocaleString(lang) + '%'}</td>
            </tr>
        );
    });

    return (
        <Card radius="md" shadow={"sm"} className={classes.card}>
            
            <CardSection className={classes.topSection}>
                <CardTitle href={toLink(URL_SOCIAL_MEDIA, URL_SOCIAL_MEDIA_RANKING)} text={t('social-media.top-institutions-title')} />
                <Text sx={{ lineHeight: 1.1 }}>{t('social-media.top-institutions-desc')}</Text>
            </CardSection>

            <CardSection px={"md"}>
                <Table sx={{ minWidth: 100 }} verticalSpacing="xs">
                    <thead>
                        <tr>
                            <th>{t('social-media.top-table-col-institution')}</th>
                            <th>{t('social-media.top-table-col-country')}</th>
                            <th>{t('social-media.top-table-col-score')}</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </CardSection>

            <CardSection className={classes.bottomSection}>
                <Text>
                    <Trans
                        i18nKey="index:social-media.reference-full-ranking"
                        components={[
                            <MantineLink key={"linkSmRanking"} type='internal' title='University social media ranking' url='social-media/ranking' />
                        ]}
                    />
                </Text>
            </CardSection>

        </Card>
    );
}

export default SmIndexTopRanking