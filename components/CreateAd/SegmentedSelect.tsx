import { Center, Group, SegmentedControl, Stack, Text, useMantineTheme } from '@mantine/core'
import { SegmentedControlItem } from '@mantine/core/lib/SegmentedControl'
import React from 'react'
import HelpPopover from '../Popover/HelpPopover'

type DataArray = {
    type: "string"
    arr: { value: string, label: string }[]
} | {
    type: "jsx"
    arr: { value: string, label: React.ReactNode }[]
}

type SegmentedSelectProps = {
    label: string
    value: string
    onChange: (value: string) => void
    data: DataArray
    helperText: string
    required?: boolean
}

const SegmentedSelect = ({ label, value, onChange, data, helperText, required = true }: SegmentedSelectProps) => {

    const theme = useMantineTheme();

    let renderedData: SegmentedControlItem[] = []

    if (data.type === "string") {
        renderedData = data.arr.map((item) => {
            return {
                label: <Center>{item.label}</Center>,
                value: item.value
            }
        })
    } else {
        renderedData = data.arr.map((item) => {
            return {
                label: item.label,
                value: item.value
            }
        })
    }

    return (
        <Stack spacing={'xs'}>
            <div>
                <Text size={"sm"} weight={500} >
                    {label}
                    {required && <Text component='span' color={'brandOrange'}>{' *'}</Text>}
                </Text>
                <SegmentedControl
                    radius={theme.radius.md}
                    value={value}
                    color="brandOrange"
                    fullWidth
                    onChange={onChange}
                    data={renderedData}
                />
            </div>
            <HelpPopover helpText={helperText} />
        </Stack>
    )
}

export default SegmentedSelect