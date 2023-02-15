import { Card, CardSection, createStyles, Table, Text, Title } from '@mantine/core';
import { Country } from '@prisma/client';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { SmRankingEntryMinified } from '../../../lib/types/SocialMediaTypes';
import { URL_INSTITUTION } from '../../../lib/url-helper/urlConstants';
import { toLink } from '../../../lib/util/util';
import MantineLink from '../MantineLink';

const useStyles = createStyles((theme) => ({

    scoreColumn: {
        textAlign: 'right',
    },

    section: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
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
        <Card withBorder radius="md" p="md" shadow="sm" sx={{ backgroundColor: theme.colors.light[0] }}>
            <CardSection className={classes.section} px={"md"} pt={"lg"}>
                <Title order={3} size={'h5'} mb={"xs"}>{t('social-media.top-institutions-title')}</Title>
                <Text sx={{ lineHeight: 1.1 }}>{t('social-media.top-institutions-desc')}</Text>
            </CardSection>
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
            <Text mt={"md"}>
                <Trans
                    i18nKey="index:social-media.reference-full-ranking"
                    components={[
                        <MantineLink key={"linkSmRanking"} type='internal' title='University social media ranking' url='social-media/ranking' />
                    ]}
                />
            </Text>
        </Card>
    );
}

export default SmIndexTopRanking