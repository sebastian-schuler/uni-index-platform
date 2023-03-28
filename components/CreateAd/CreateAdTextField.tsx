import { Stack, TextInput } from '@mantine/core'
import React from 'react'
import HelpPopover from '../Popover/HelpPopover'

type Props = {
    label: string
    placeholder: string
    helpText: string
    value: string
    onChange: (value: string) => void
}

const CreateAdTextField = ({ label, placeholder, helpText, value, onChange }: Props) => {

    return (
        <Stack spacing={'xs'}>
            <TextInput
                value={value}
                onChange={(e) => onChange(e.currentTarget.value)}
                placeholder={placeholder}
                label={label}
                withAsterisk
            />
            <HelpPopover helpText={helpText} />
        </Stack>
    )
}

export default CreateAdTextField