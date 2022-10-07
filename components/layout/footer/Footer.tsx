import { Box, Grid, Stack, Title, useMantineTheme, Divider, Text } from '@mantine/core';
import { City, Country, State } from '@prisma/client';
import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { memo } from 'react';
import { Searchable } from '../../../lib/types/UiHelperTypes';
import { URL_LOGIN, URL_REGISTER } from '../../../lib/url-helper/urlConstants';
import { getLocalizedName, toLink } from '../../../lib/util/util';
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
                    dataRow.content.push({ name: getLocalizedName({ lang: lang, searchable: val }), url: '/location/' + val.data.url })
                });
            }

            footerData.push(dataRow);
        });
    }

    return (

        <Box component={'footer'} sx={{ backgroundColor: theme.colors.brandGray[5], color: theme.white }}>
            <ResponsiveContainer sx={{ paddingTop: 64, paddingBottom: 32 }}>

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
                                                <MantineLink key={item.name + j} label={item.name} url={item.url} />
                                            ))

                                        }
                                    </Stack>
                                </Grid.Col>
                            )
                        })
                    }
                </Grid>

                <Divider mt={16} mb={16} sx={{ opacity: 0.5 }} />

                <Text align='center' size={"sm"} color={"dimmed"}>Copyright @ Uni-Index</Text>

            </ResponsiveContainer>
        </Box>
    )
}

export default memo(Footer)