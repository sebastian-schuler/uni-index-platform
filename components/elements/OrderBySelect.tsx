import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Searchable } from '../../lib/types/UiHelperTypes';

export type OrderByState = "popularity" | "relevance" | "az" | "za";

// Function to sort the data list
export const sortSearchableArray = (data: Searchable[], orderBy: OrderByState) => {
    return [...data].sort((a, b) => {
        if (orderBy === "az") {
            return a.data.name.localeCompare(b.data.name);
        } else if (orderBy === "za") {
            return b.data.name.localeCompare(a.data.name);
        } else if (orderBy === "relevance") {
            return a.data.name.localeCompare(b.data.name); // TODO add relevance sorting
        } else if (orderBy === "popularity") {
            return b.data.popularity_score - a.data.popularity_score;
        } else {
            return 0;
        }
    });
}

type Props = {
    orderBy: OrderByState,
    handleChange: (event: SelectChangeEvent) => void,
}

const OrderBySelect: React.FC<Props> = props => {

    const { orderBy, handleChange } = props;

    return (
        <>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Order By</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={orderBy}
                    onChange={handleChange}
                    label="Age"
                >
                    <MenuItem value={"relevance"}>Relevance</MenuItem>
                    <MenuItem value={"popularity"}>Popularity</MenuItem>
                    <MenuItem value={"az"}>A-Z</MenuItem>
                    <MenuItem value={"za"}>Z-A</MenuItem>
                </Select>
            </FormControl>
        </>
    )
}

export default OrderBySelect