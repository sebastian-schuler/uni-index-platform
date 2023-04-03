import { Anchor, Box, Popover, Text } from '@mantine/core';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    helpText: string
}
const HelpPopover = ({ helpText }: Props) => {

    const { t } = useTranslation('account');

    return (
        <Box display={"flex"}>
            <Popover width={200} position="bottom" withArrow shadow="md">
                <Popover.Target>
                    <Anchor component='div' size={'sm'}>{t('create-ad.helper-text-label')}</Anchor>
                </Popover.Target>
                <Popover.Dropdown>
                    <Text size="sm">{helpText}</Text>
                </Popover.Dropdown>
            </Popover>
        </Box>
    )
}

export default HelpPopover