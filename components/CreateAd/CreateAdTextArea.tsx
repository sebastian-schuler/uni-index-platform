import { Stack, Textarea } from '@mantine/core'
import React from 'react'
import HelpPopover from '../Popover/HelpPopover'

type CreateAdTextAreaProps = {
    label: string
    placeholder: string
    helper: string
    value: string
    onChange: (value: string) => void
    error?: boolean | React.ReactNode
}

const CreateAdTextArea = ({ label, placeholder, helper, value, onChange, error }: CreateAdTextAreaProps) => {
    return (
        <Stack spacing={'xs'}>
            <Textarea
                label={label}
                placeholder={placeholder}
                radius="md"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                error={error}
                required
            />
            <HelpPopover helpText={helper} />
        </Stack>
    )
}

export default CreateAdTextArea