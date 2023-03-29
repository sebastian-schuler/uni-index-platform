import { ActionIcon, Anchor, createStyles, Group, Stack, TextInput, Divider, Text, Loader, Center, Badge, Select, SimpleGrid } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconSearch } from '@tabler/icons-react';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import ResponsiveWrapper from '../components/Container/ResponsiveWrapper';
import Breadcrumb from '../features/Breadcrumb/Breadcrumb';
import SITE_URL from '../lib/globalUrl';
import { SearchResult } from '../lib/types/SearchTypes';
import { URL_INSTITUTION, URL_INSTITUTION_SUBJECTS, URL_LOCATION, URL_SEARCH, URL_SEARCH_GLOBAL } from '../lib/url-helper/urlConstants';
import { toLink } from '../lib/util/util';
import React from 'react';
import GenericPageHeader from '../components/Block/GenericPageHeader';
import { useRouter } from 'next/router';
import { prismaGlobalSearch } from '../lib/prisma/prismaGlobalSearch';
import useTranslation from 'next-translate/useTranslation';

const useStyles = createStyles((theme) => ({


}));

interface Props {
    q?: string
    searchResultPreloaded?: SearchResult[]
}

const Search: NextPage<Props> = ({ q, searchResultPreloaded }: Props) => {

    const { theme } = useStyles();
    const router = useRouter();
    const { t } = useTranslation('search');

    const [searchTerm, setSearchTerm] = useState(q || "");
    const [isLoading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState<SearchResult[] | undefined>(searchResultPreloaded);

    const runSearch = async (q: string) => {
        if (q.length <= 3) return;
        setLoading(true);

        // Update the URL
        router.replace(`/${URL_SEARCH}?q=${q}`, undefined, { shallow: true });

        // Fetch the data
        const res = await fetch(`${SITE_URL}/api/${URL_SEARCH}/${URL_SEARCH_GLOBAL}?q=${q}`);
        const data = await res.json();

        setLoading(false);
        setSearchResult(data.searchResult);
    }

    const results = searchResult?.map((result, i) => {

        let url = "";
        let text = "";
        let tag = <></>;

        if (result.type === "country") {
            url = toLink(URL_LOCATION, result.url);
            tag = <Text size={'sm'} color={'gray.6'}>{t('categories.country')}</Text>

        } else if (result.type === "state") {
            url = toLink(URL_LOCATION, result.countryUrl, result.url);
            text = result.countryName;
            tag = <Text size={'sm'} color={'gray.6'}>{t('categories.state')}</Text>

        } else if (result.type === "city") {
            url = toLink(URL_LOCATION, result.countryUrl, result.stateUrl, result.url);
            text = result.countryName + " - " + result.stateName;
            tag = <Text size={'sm'} color={'gray.6'}>{t('categories.city')}</Text>

        } else if (result.type === "institution") {
            url = toLink(URL_INSTITUTION, result.url);
            tag = <Text size={'sm'} color={'gray.6'}>{t('categories.institution')}</Text>

        } else if (result.type === "subject") {
            url = toLink(URL_INSTITUTION, result.countryUrl, result.institutionUrl, URL_INSTITUTION_SUBJECTS, result.url);
            text = result.countryName + ' | ' + result.institutionName;
            tag = <Text size={'sm'} color={'gray.6'}>{t('categories.subject')}</Text>

        }

        return (
            <React.Fragment key={i}>
                <Stack spacing={0}>
                    <div>{tag}</div>
                    <Anchor component={Link} href={url} size={'lg'}>{result.name}</Anchor>
                    <Text>{text}</Text>
                </Stack>
                <Divider />
            </React.Fragment>
        );
    });

    return (
        <ResponsiveWrapper>

            <Breadcrumb />

            <GenericPageHeader title={t('title')} description='' />

            <SimpleGrid
                mt={'lg'}
                breakpoints={[
                    { minWidth: 'xs', cols: 1 },
                    { minWidth: 'sm', cols: 2 },
                ]}
            >
                <TextInput
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.currentTarget.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            runSearch(searchTerm);
                        }
                    }}
                    icon={<IconSearch size="1.1rem" stroke={1.5} />}
                    radius="xl"
                    size="md"
                    rightSection={
                        <ActionIcon
                            size={32} radius="xl" color={theme.primaryColor} variant="filled"
                            onClick={() => runSearch(searchTerm)} title={t('search-button-alt')}
                        >
                            {theme.dir === 'ltr' ? (
                                <IconArrowRight size="1.1rem" stroke={1.5} />
                            ) : (
                                <IconArrowLeft size="1.1rem" stroke={1.5} />
                            )}
                        </ActionIcon>
                    }
                    placeholder={t('search-placeholder')}
                    rightSectionWidth={42}
                />

            </SimpleGrid>
            {
                isLoading ? (
                    <Center mt={'xl'}>
                        <Loader variant="bars" />
                    </Center>
                ) : (
                    <Stack py={'lg'}>
                        {results}
                    </Stack>
                )
            }

        </ResponsiveWrapper>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    if (typeof context.query.q !== "string") return { props: {} };

    const searchResult = await prismaGlobalSearch(context.query.q, context.locale || "en");

    return {
        props: {
            q: context.query.q,
            searchResultPreloaded: searchResult
        }
    }
}

export default Search
