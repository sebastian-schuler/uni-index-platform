import React from 'react'
import { MultiSelect, useMantineTheme } from '@mantine/core'

export type FilterDataItem = { label: string, value: string }

type Props = {
  value: string[]
  onChange: (value: string[]) => void
}

const SearchFilterSelect = ({ value, onChange }: Props) => {

  const theme = useMantineTheme();

  const data: FilterDataItem[] = [
    { label: 'Institutions', value: 'institution' },
    { label: 'Subjects', value: 'subject' },
    { label: 'Countries', value: 'country' },
    { label: 'States', value: 'state' },
    { label: 'Cities', value: 'city' },
  ]

  return (
    <MultiSelect
      value={value}
      onChange={onChange}
      size={'md'}
      data={data}
      label="Search filter"
      placeholder="Filter your search or leave blank for all"
      nothingFound="Nothing found"
      sx={{ flex: 1 }}
      clearable
    />
  )
}

export default SearchFilterSelect