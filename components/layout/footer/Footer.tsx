import { Box, Grid, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { City, Country, State } from '@prisma/client';
import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { memo } from 'react';
import { URL_LOGIN, URL_REGISTER } from '../../../data/urlConstants';
import { Searchable } from '../../../lib/types/UiHelperTypes';
import { getLocalizedName, toLink } from '../../../lib/util';
import MantineLink from '../../elements/MantineLink';
import ResponsiveContainer from '../ResponsiveContainer';

export type FooterContentList = {
    title: string,
    content: FooterContentItem[],
}

export type FooterContentItem = {
    name: string;
    url: string;
}

export type FooterContent = {
    title: string,
    data: Country[] | State[] | City[] | Searchable[],
    type: "Country" | "State" | "City" | "Searchable",
}

type Props = {
    footerContent?: FooterContent[],
}

// Make generic
const Footer: NextPage<Props> = props => {

    const theme = useMantineTheme();

    const footerData: FooterContentList[] = [];
    const { lang } = useTranslation();

    const accountLinks: FooterContentItem[] = [
        { url: toLink(URL_LOGIN), name: "Login" },
        { url: toLink(URL_REGISTER), name: "Register" }
    ]
    footerData.push({ title: "Account", content: accountLinks });

    if (props.footerContent !== undefined) {
        // For each List of footer data
        props.footerContent.forEach(val => {

            let dataRow: FooterContentList = { title: val.title, content: [] };

            if (val.type === "Country") {
                const country = val.data as Country[];
                country.forEach(val => {
                    let name = getLocalizedName({ lang: lang, dbTranslated: val });
                    dataRow.content.push({ name: name, url: '/location/' + val.url })
                });

            } else if (val.type === "Searchable") {
                const searchable = val.data as Searchable[];
                searchable.forEach(val => {
                    dataRow.content.push({ name: val.data.name, url: '/location/' + val.data.url })
                });
            }

            footerData.push(dataRow);
        });
    }

    return (

        <Box component={'footer'} sx={{ backgroundColor: theme.colors.brandGray[5], color: theme.white, py: 6 }}>
            <ResponsiveContainer paddingY>

                <Grid gutter={1}>
                    {
                        footerData.map((footerList, i) => {
                            return (
                                <Grid.Col key={i} xs={6} md={i === 0 ? 2 : 1}>
                                    <Title order={4}>
                                        {footerList.title}
                                    </Title>
                                    <Stack spacing={0}>
                                        {

                                            footerList.content.map((item, j) => (
                                                <MantineLink key={item.name+j} label={item.name} url={item.url} />
                                            ))

                                        }
                                    </Stack>
                                </Grid.Col>
                            )
                        })
                    }
                </Grid>

            </ResponsiveContainer>
        </Box>
    )
}

export default memo(Footer)