import {
    Center, createStyles, Group, ScrollArea, Table, Text, TextInput, UnstyledButton
} from '@mantine/core';
import { keys } from '@mantine/utils';
import { Country } from '@prisma/client';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from '@tabler/icons-react';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { SmRankingEntryMinified } from '../../lib/types/SocialMediaTypes';
import { URL_INSTITUTION } from '../../lib/url-helper/urlConstants';
import { formatNumber } from '../../lib/util/formattingUtil';
import { getLocalizedName, toLink } from '../../lib/util/util';
import MantineLink from '../../components/Link/MantineLink';

const useStyles = createStyles((theme) => ({
    th: {
        padding: '0 !important',
    },
    control: {
        width: '100%',
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },
    icon: {
        width: 21,
        height: 21,
        borderRadius: 21,
    },

    rankRow: {
        minWidth: 100,
    },
    countryRow: {
        minWidth: 150,
    },
    numberRow: {
        textAlign: 'right',
        minWidth: 150,
    },
}));

interface RowData {
    rank: number;
    name: string;
    country: string;
    totalscore: number;
    youtubeScore: number;
    twitterScore: number;
    url: string;
}

interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort(): void;
}


function filterData(data: RowData[], search: string) {
    const query = search.toLowerCase().trim();
    const filtered = data.filter((item) =>
        keys(data[0]).some((key) => {
            if (key === "rank" || key === "youtubeScore" || key === "twitterScore" || key === "totalscore")
                return item[key].toString().toLowerCase().includes(query);
            else
                return item[key].toLowerCase().includes(query);
        })
    );
    return filtered;
}

function sortData(
    data: RowData[],
    payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
    const { sortBy, search, reversed } = payload;

    if (!sortBy) {
        return filterData(data, search);
    }

    return filterData(
        [...data].sort((a, b) => {

            if (sortBy === "rank" || sortBy === "youtubeScore" || sortBy === "twitterScore" || sortBy === "totalscore") {
                if (reversed)
                    return a[sortBy] - b[sortBy];
                else
                    return b[sortBy] - a[sortBy];
            } else {
                if (reversed)
                    return b[sortBy].localeCompare(a[sortBy]);
                else
                    return a[sortBy].localeCompare(b[sortBy]);
            }
        }),
        search
    );
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
    const { classes } = useStyles();
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <th className={classes.th}>
            <UnstyledButton onClick={onSort} className={classes.control}>
                <Group position="apart">
                    <Text weight={500} size="sm">
                        {children}
                    </Text>
                    <Center className={classes.icon}>
                        <Icon size={14} stroke={1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </th>
    );
}

interface Props {
    socialMediaList: SmRankingEntryMinified[]
    countries: Country[]
}

const SmRankingTable: React.FC<Props> = ({ socialMediaList, countries }: Props) => {

    const { t, lang } = useTranslation('common');
    const { classes } = useStyles();

    const data: RowData[] = socialMediaList.map((item, i) => {
        const country = countries.find(c => c.id === item.Institution.countryId);
        return {
            rank: (i + 1),
            name: item.Institution.name,
            country: getLocalizedName({ lang: lang, dbTranslated: country }),
            totalscore: item.combinedScore,
            youtubeScore: item.youtubeScore,
            twitterScore: item.twitterScore,
            url: toLink(URL_INSTITUTION, country?.url || "", item.Institution.url, "social-media"),
        }
    })

    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(data);
    const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    const setSorting = (field: keyof RowData) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(data, { sortBy: field, reversed, search }));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
    };

    const rows = sortedData.map((row) => (
        <tr key={row.name}>
            <td className={classes.rankRow}>{row.rank}</td>
            <td>
                <MantineLink url={row.url} type="internal">{row.name}</MantineLink>
            </td>
            <td className={classes.countryRow}>{row.country}</td>
            <td className={classes.numberRow}>{formatNumber(row.totalscore, lang, 2)}%</td>
            <td className={classes.numberRow}>{formatNumber(row.twitterScore, lang, 2)}%</td>
            <td className={classes.numberRow}>{formatNumber(row.youtubeScore, lang, 2)}%</td>
        </tr>
    ));

    return (
        <ScrollArea>
            <TextInput
                placeholder="Search by any field"
                mb="md"
                icon={<IconSearch size={14} stroke={1.5} />}
                value={search}
                onChange={handleSearchChange}
                radius="md"
            />
            <Table
                horizontalSpacing="md"
                verticalSpacing="xs"
                sx={{ tableLayout: 'auto', minWidth: 700 }}
                highlightOnHover
                striped
            >
                <thead>
                    <tr>
                        <Th
                            sorted={sortBy === 'rank'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('rank')}
                        >
                            Rank
                        </Th>
                        <Th
                            sorted={sortBy === 'name'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('name')}
                        >
                            Name
                        </Th>
                        <Th
                            sorted={sortBy === 'country'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('country')}
                        >
                            Country
                        </Th>
                        <Th
                            sorted={sortBy === 'totalscore'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('totalscore')}
                        >
                            Total Score
                        </Th>
                        <Th
                            sorted={sortBy === 'twitterScore'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('twitterScore')}
                        >
                            Twitter Score
                        </Th>
                        <Th
                            sorted={sortBy === 'youtubeScore'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('youtubeScore')}
                        >
                            Youtube Score
                        </Th>
                    </tr>
                </thead>
                <tbody>
                    {rows.length > 0 ? (
                        rows
                    ) : (
                        <tr>
                            <td colSpan={data.length > 0 ? Object.keys(data[0]).length : rows.length}>
                                <Text weight={500} align="center">
                                    Nothing found
                                </Text>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </ScrollArea>
    );
}

export default SmRankingTable;