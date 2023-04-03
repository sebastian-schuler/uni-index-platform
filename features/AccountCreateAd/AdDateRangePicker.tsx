import { Stack, Text, useMantineTheme } from '@mantine/core';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import HelpPopover from '../../components/Popover/HelpPopover';
import { FromToDateRange } from '../../lib/types/UiHelperTypes';

type Props = {
    label: string
    placeholder: string
    helper: string
    onChange: (value: FromToDateRange | undefined) => void
}

const AdDateRangePicker = ({ label, placeholder, helper, onChange }: Props) => {

    const theme = useMantineTheme();
    const { lang, t } = useTranslation();

    const [value, setValue] = useState<DatesRangeValue | undefined>();

    const onChangeRange = (value: DatesRangeValue | undefined) => {
        setValue(value);

        if (value) {
            let from = value[0]?.getTime() || 0;
            let to = value[1]?.getTime() || 0;
            to += to <= 0 ? 0 : 23 * 60 * 60 * 1000; // Add 23 hours to the end date to make it inclusive, if it's not undefined or 0
            onChange({ from, to });
        } else {
            onChange(value);
        }
    }

    return (
        <Stack spacing={'xs'}>
            <DatePickerInput
                label={label}
                type='range'
                required
                placeholder={placeholder}
                value={value}
                onChange={onChangeRange}
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
            <HelpPopover helpText={helper} />
        </Stack>
    )
}

export default AdDateRangePicker