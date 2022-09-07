import { Button, Modal, Stack } from '@mantine/core'
import React from 'react'
import LanguagePicker from './LanguagePicker'

interface Props {
    opened: boolean
    setOpened: (open: boolean) => void
}

const LanguageModal = ({ opened, setOpened }: Props) => {

    return (
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Settings"
            size={"md"}
        >

            <Stack spacing={48}>
                <LanguagePicker />
                <Button variant='filled'  onClick={() => setOpened(false)}>Finish</Button>
            </Stack>

        </Modal>
    )
}

export default LanguageModal