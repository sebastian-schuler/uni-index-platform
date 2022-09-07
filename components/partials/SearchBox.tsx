import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import { memo, useEffect, useState } from 'react'
import { Searchable } from '../../lib/types/UiHelperTypes'
import { getLocalizedName } from '../../lib/util'

type Props = {
    label: string,
    placeholder: string,
    searchableList: Searchable[],
    setSearchableList: (list: Searchable[]) => void,
}

const SearchBox: NextPage<Props> = props => {

    const [searchTerm, setSearchTerm] = useState("");
    const { lang } = useTranslation();

    useEffect(() => {

        const newSearchableList = Array.from([...props.searchableList]);

        if (searchTerm === "") {
            newSearchableList.forEach((searchable) => searchable.visible = true);
        } else {

            newSearchableList.forEach((searchable) => {
                if (searchTerm !== "" && getLocalizedName({ lang: lang, searchable: searchable }).toLowerCase().startsWith(searchTerm.toLowerCase())) {
                    searchable.visible = true;
                } else {
                    searchable.visible = false;
                }
            });
        }
        props.setSearchableList(newSearchableList);

    }, [searchTerm])

    return (
        <Box>

            <TextField
                id="search-field"
                label={props.label}
                type="search"
                variant="standard"
                sx={{
                    width: '100%',
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

        </Box>
    )
}

export default memo(SearchBox)