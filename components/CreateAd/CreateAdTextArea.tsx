import { Stack, Textarea } from '@mantine/core'
import React from 'react'
import HelpPopover from '../Popover/HelpPopover'

type CreateAdTextAreaProps = {
    label: string
    value: string
    onChange: (value: string) => void
    error?: boolean | React.ReactNode
}

const CreateAdTextArea = ({ label, value, onChange, error }: CreateAdTextAreaProps) => {
    return (
        <Stack spacing={'xs'}>
            <Textarea
                label={label}
                placeholder="Your description"
                radius="md"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                error={error}
                required
            />
            <HelpPopover helpText='The description placed inside your ad.' />
        </Stack>
    )
}

export default CreateAdTextArea