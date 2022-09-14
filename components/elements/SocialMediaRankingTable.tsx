import { useState } from 'react';
import {
    createStyles,
    Table,
    ScrollArea,
    UnstyledButton,
    Group,
    Text,
    Center,
    TextInput,
} from '@mantine/core';
import { keys } from '@mantine/utils';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons';
import { SocialMediaDBEntry, SocialMediaRankingItem } from '../../lib/types/SocialMediaTypes';
import { getLocalizedName, toLink } from '../../lib/util';
import useTranslation from 'next-translate/useTranslation';
import MantineLink from './MantineLink';
import { URL_INSTITUTION } from '../../lib/url-helper/urlConstants';

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
}));

interface RowData {
    rank: string;
    name: string;
    country: string;
    totalscore: string;
    url: string;
}

interface TableSortProps {
    data: RowData[];
}

interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort(): void;
}


function filterData(data: RowData[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
        keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
    );
}

function sortData(
    data: RowData[],
    payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
    const { sortBy } = payload;

    if (!sortBy) {
        return filterData(data, payload.search);
    }

    return filterData(
        [...data].sort((a, b) => {
            if (payload.reversed) {
                return b[sortBy].localeCompare(a[sortBy]);
            }

            return a[sortBy].localeCompare(b[sortBy]);
        }),
        payload.search
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
    socialMediaList: SocialMediaDBEntry[]
}

const SocialMediaRankingTable = ({ socialMediaList }: Props) => {

    const { t, lang } = useTranslation('common');

    const data: RowData[] = socialMediaList.map((item, i) => {
        return {
            rank: (i + 1) + "",
            name: item.Institution.name,
            country: getLocalizedName({ lang: lang, dbTranslated: item.Institution.City.State.Country }),
            totalscore: item.total_score + "",
            url: toLink(URL_INSTITUTION, item.Institution.City.State.Country.url, item.Institution.url),
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
            <td>{row.rank}</td>
            <td>
                <MantineLink label={row.name} url={row.url} />
            </td>
            <td>{row.country}</td>
            <td>{row.totalscore}</td>
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
                sx={{ tableLayout: 'fixed', minWidth: 700 }}
                highlightOnHover
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

export default SocialMediaRankingTable