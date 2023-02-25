import { createStyles, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import { memo, useState } from 'react'

const useStyles = createStyles((theme) => ({
    input: {
        backgroundColor: theme.colors.light[0],
    },
}));

interface Props {
    label: string,
    placeholder: string,
    searchTerm: string,
    setSearchTerm: (newTerm: string) => void,
}

const SearchBox: NextPage<Props> = ({ label, placeholder, searchTerm, setSearchTerm }: Props) => {

    const { classes } = useStyles();
    const { lang } = useTranslation();
    const [value, setValue] = useState('');

    return (
        <TextInput
            icon={<IconSearch size={18} stroke={1.5} />}
            radius="md"
            placeholder={placeholder}
            rightSectionWidth={42}
            value={value}
            label={label}
            onChange={(e) => { setSearchTerm(e.currentTarget.value); setValue(e.currentTarget.value); }}
            classNames={classes}
        />
    )
}

export default SearchBox;