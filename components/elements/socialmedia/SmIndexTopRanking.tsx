import { createStyles, ScrollArea, Table, Text, Title } from '@mantine/core';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { SmRankingEntryMinified } from '../../../lib/types/SocialMediaTypes';
import { URL_INSTITUTION } from '../../../lib/url-helper/urlConstants';
import { toLink } from '../../../lib/util/util';
import WhiteCard from '../../layout/WhiteCard';
import WhitePaper from '../../WhitePaper';
import MantineLink from '../MantineLink';

const useStyles = createStyles((theme) => ({

}));

interface Props {
    socialMediaList: SmRankingEntryMinified[]
}

const SmIndexTopRanking: React.FC<Props> = ({ socialMediaList }: Props) => {

    const { classes, theme } = useStyles();
    const { lang } = useTranslation();

    const rows = socialMediaList.map((row, i) => {

        const url = toLink(URL_INSTITUTION, row.Institution.Country.url, row.Institution.url, "social-media");

        return (
            <tr key={row.Institution.name + i}>
                <td>
                    <MantineLink label={row.Institution.name} url={url} type="internal" />
                </td>
                <td>{row.Institution.Country.name}</td>
                <td>{Math.round(row.total_score).toLocaleString(lang)}</td>
            </tr>
        );
    });

    return (
        <WhiteCard sx={{ height: "100%" }}>
            <Title order={4} size={theme.fontSizes.lg} mb={"md"}>Top Institutions</Title>
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
        </WhiteCard>
    );
}

export default SmIndexTopRanking