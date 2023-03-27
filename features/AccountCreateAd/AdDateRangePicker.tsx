import { Stack, Text, useMantineTheme } from '@mantine/core';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';
import useTranslation from 'next-translate/useTranslation';
import HelpPopover from '../../components/Popover/HelpPopover';

type Props = {
    value: DatesRangeValue | undefined
    onChange: (value: DatesRangeValue | undefined) => void
}

const AdDateRangePicker = ({ value, onChange }: Props) => {

    const theme = useMantineTheme();
    const { lang, t } = useTranslation();

    return (
        <Stack spacing={'xs'}>
            <DatePickerInput
                label='Select time frame'
                type='range'
                required
                placeholder='Select until date'
                value={value}
                onChange={onChange}
                radius={theme.radius.md}
                hideOutsideDates
                excludeDate={(date) => date.getTime() < Date.now()}
                lang={lang}
                renderDay={(date) => {
                    const day = date.getDate();
                    const today = new Date();

                    // Date is in the past
                    if (date.getTime() < today.getTime()) {
                        return (
                            <Text color={'dimmed'}>{day}</Text>
                        )
                    }

                    // Date is selected
                    if (value?.[0]?.getTime() === date.getTime() || value?.[1]?.getTime() === date.getTime()) {
                        return (
                            <Text color={'white'}>{day}</Text>
                        )
                    }

                    // Default case
                    return (
                        <Text color={'black'}>{day}</Text>
                    );
                }}
            />
            <HelpPopover helpText='How long you want to book your ad for. Starting from the day after the booking until the day of your choosing, inclusive.' />
        </Stack>
    )
}

export default AdDateRangePicker