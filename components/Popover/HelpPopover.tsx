import React from 'react'
import { Popover, Text, Box, Anchor } from '@mantine/core';
import { IconHelp } from '@tabler/icons-react'

interface Props {
    helpText: string
}
const HelpPopover = ({ helpText }: Props) => {
    return (
        <Box display={"flex"}>
            <Popover width={200} position="bottom" withArrow shadow="md">
                <Popover.Target>
                        <Anchor component='div' size={'sm'}>Learn More</Anchor>
                </Popover.Target>
                <Popover.Dropdown>
                    <Text size="sm">{helpText}</Text>
                </Popover.Dropdown>
            </Popover>
        </Box>
    )
}

export default HelpPopover