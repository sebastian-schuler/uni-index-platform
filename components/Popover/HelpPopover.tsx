import React from 'react'
import { Popover, Text, Button, ActionIcon } from '@mantine/core';
import { IconHelp } from '@tabler/icons-react'

interface Props {
    helpText: string
    size: number | string
}
const HelpPopover = ({ helpText, size }: Props) => {
    return (
        <Popover width={200} position="bottom" withArrow shadow="md">
            <Popover.Target>
                <ActionIcon radius="xl">
                    <IconHelp size={size}  />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
                <Text size="sm">{helpText}</Text>
            </Popover.Dropdown>
        </Popover>
    )
}

export default HelpPopover