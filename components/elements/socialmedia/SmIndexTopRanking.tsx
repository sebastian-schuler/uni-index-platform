import { Card, CardSection, createStyles, Space, Table, Text, Title } from '@mantine/core';
import { Country } from '@prisma/client';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { SmRankingEntryMinified } from '../../../lib/types/SocialMediaTypes';
import { URL_INSTITUTION } from '../../../lib/url-helper/urlConstants';
import { toLink } from '../../../lib/util/util';
import WhiteCard from '../../../layout/WhiteCard';
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
    const { lang } = useTranslation();

    const rows = socialMediaList.map((row, i) => {

        const country = countries.find(c => c.id === row.Institution.countryId);
        const url = toLink(URL_INSTITUTION, country?.url || "", row.Institution.url, "social-media");

        return (
            <tr key={row.Institution.name + i}>
                <td>
                    <MantineLink label={row.Institution.name} url={url} type="internal" />
                </td>
                <td>{country?.name}</td>
                <td className={classes.scoreColumn}>{Math.round(row.combinedScore).toLocaleString(lang) + '%'}</td>
            </tr>
        );
    });

    return (
        <Card withBorder radius="md" p="md" shadow="sm" sx={{ backgroundColor: theme.colors.light[0] }}>
            <CardSection className={classes.section} px={"md"} pt={"lg"}>
                <Title order={3} size={'h5'} mb={"xs"}>Top Institutions</Title>
                <Text sx={{ lineHeight: 1.1 }}>The top ten institutions that have the best social media presence.</Text>
            </CardSection>
            <Table sx={{ minWidth: 100 }} verticalSpacing="xs">
                <thead>
                    <tr>
                        <th>University</th>
                        <th>Country</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
            <Text mt={"md"}>You can find our entire social media ranking <MantineLink label='here' type='internal' url='social-media-ranking' />.</Text>
        </Card>
    );
}

export default SmIndexTopRanking