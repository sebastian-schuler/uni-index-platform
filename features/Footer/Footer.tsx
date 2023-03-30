import { Box, Divider, Grid, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { city, country, state } from '@prisma/client';
import { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import MantineLink from '../../components/Link/MantineLink';
import { Searchable } from '../../lib/types/UiHelperTypes';
import { URL_ABOUT, URL_IMPRINT, URL_LOGIN, URL_PRIVACY, URL_REGISTER } from '../../lib/url-helper/urlConstants';
import { getLocalizedName, toLink } from '../../lib/util/util';
import ResponsiveContainer from '../../components/Container/ResponsiveContainer';

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
    data: country[] | state[] | city[] | Searchable[],
    type: "Country" | "State" | "City" | "Searchable",
}

type Props = {
    footerContent?: FooterContent[],
}

// Make generic
const Footer: NextPage<Props> = props => {

    const theme = useMantineTheme();

    const footerData: FooterContentList[] = [];
    const { t, lang } = useTranslation();

    const aboutLinks: FooterContentItem[] = [
        { url: toLink(URL_ABOUT, URL_IMPRINT), name: t('footer.about-imprint') },
        { url: toLink(URL_ABOUT, URL_PRIVACY), name: t('footer.about-privacy') }
    ]
    footerData.push({ title: t('footer.about-title'), content: aboutLinks });

    const accountLinks: FooterContentItem[] = [
        { url: toLink(URL_LOGIN), name: t('account.login') },
        { url: toLink(URL_REGISTER), name: t('account.register') },
    ]
    footerData.push({ title: t('account.view'), content: accountLinks });

    if (props.footerContent !== undefined) {
        // For each List of footer data
        props.footerContent.forEach(val => {

            let dataRow: FooterContentList = { title: val.title, content: [] };

            if (val.type === "Country") {
                const country = val.data as country[];
                country.forEach(val => {
                    let name = getLocalizedName({ lang: lang, dbTranslated: val });
                    dataRow.content.push({ name: name, url: toLink(val.url) })
                });

            } else if (val.type === "Searchable") {
                const searchable = val.data as Searchable[];
                searchable.forEach(val => {
                    const url = val.type === "City" ? val.data.fullUrl : toLink(val.data.url);
                    dataRow.content.push({ name: getLocalizedName({ lang: lang, searchable: val }), url: url })
                });
            }

            footerData.push(dataRow);
        });
    }

    return (
        <Box component={'footer'} sx={{ backgroundColor: theme.colors.brandGray[5], color: theme.white }}>
            <ResponsiveContainer props={{ pt: 'xl', pb: 'lg' }} >

                <Grid gutter={'sm'}>
                    {
                        footerData.map((footerList, i) => {
                            return (
                                <Grid.Col key={i} xs={6} md={3}>
                                    <Title order={4}>
                                        {footerList.title}
                                    </Title>
                                    <Stack spacing={0}>
                                        {

                                            footerList.content.map((item, j) => (
                                                <MantineLink key={item.name + j} url={item.url} type="internal">{item.name}</MantineLink>
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

export default Footer;