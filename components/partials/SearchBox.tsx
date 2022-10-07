import { TextInput, createStyles } from '@mantine/core'
import { IconSearch } from '@tabler/icons'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import { memo, useEffect, useState } from 'react'
import { Searchable } from '../../lib/types/UiHelperTypes'
import { getLocalizedName } from '../../lib/util/util'

const useStyles = createStyles((theme) => ({
    input: {
        backgroundColor: theme.colors.light[0],
    },
}));

interface Props {
    label: string,
    placeholder: string,
    searchableList: Searchable[],
    setSearchableList: (list: Searchable[]) => void,
}

const SearchBox: NextPage<Props> = ({ label, placeholder, searchableList, setSearchableList }: Props) => {

    const { classes } = useStyles();
    const [searchTerm, setSearchTerm] = useState("");
    const { lang } = useTranslation();

    useEffect(() => {
        const newSearchableList = Array.from([...searchableList]);
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
        setSearchableList(newSearchableList);
    }, [searchTerm, lang, setSearchableList, searchableList]);

    return (
        <TextInput
            icon={<IconSearch size={18} stroke={1.5} />}
            radius="md"
            placeholder={placeholder}
            rightSectionWidth={42}
            value={searchTerm}
            label={label}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            classNames={classes}
        />
    )
}

export default memo(SearchBox);