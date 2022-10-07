import { createStyles, Select } from '@mantine/core';
import { IconArrowsSort } from '@tabler/icons';
import * as React from 'react';
import { Searchable } from '../../lib/types/UiHelperTypes';
import { getLocalizedName } from '../../lib/util/util';

const useStyles = createStyles((theme) => ({
    input: {
        backgroundColor: theme.colors.light[0],
    },
    dropdown: {
        backgroundColor: theme.colors.light[0],
    },
}));

export type OrderByState = "popularity" | "relevance" | "az" | "za";

// Function to sort the data list
export const sortSearchableArray = (searchable: Searchable[], orderBy: OrderByState, lang: string) => {
    return [...searchable].sort((a, b) => {
        if (orderBy === "az") {
            const aName = getLocalizedName({ lang: lang, searchable: a });
            const bName = getLocalizedName({ lang: lang, searchable: b });
            return aName.localeCompare(bName);
        } else if (orderBy === "za") {
            const aName = getLocalizedName({ lang: lang, searchable: a });
            const bName = getLocalizedName({ lang: lang, searchable: b });
            return bName.localeCompare(aName);
        } else if (orderBy === "relevance") {
            const aName = getLocalizedName({ lang: lang, searchable: a });
            const bName = getLocalizedName({ lang: lang, searchable: b });
            return aName.localeCompare(bName); // TODO add relevance sorting
        } else if (orderBy === "popularity") {
            return b.data.popularity_score - a.data.popularity_score;
        } else {
            return 0;
        }
    });
}

interface Props {
    orderBy: OrderByState
    handleChange: (selected: string | null) => void
}

const OrderBySelect: React.FC<Props> = ({ orderBy, handleChange }: Props) => {
    const { classes } = useStyles();
    return (
        <Select
            label="Order by"
            radius="md"
            data={
                [
                    { value: 'relevance', label: 'Relevance' },
                    { value: 'popularity', label: 'Popularity' },
                    { value: 'az', label: 'A-Z' },
                    { value: 'za', label: 'Z-A' },
                ]
            }
            value={orderBy}
            icon={<IconArrowsSort size={14} />}
            onChange={handleChange}
            classNames={classes}
            transition="pop-top-left"
            transitionDuration={100}
            transitionTimingFunction="ease"
        />
    )
}

export default OrderBySelect