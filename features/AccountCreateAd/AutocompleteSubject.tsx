import { Autocomplete, Stack, useMantineTheme } from '@mantine/core';
import { IconSchool } from '@tabler/icons-react';
import { useState } from 'react';
import HelpPopover from '../../components/Popover/HelpPopover';

export type SubjectAutofill = {
    value: string
    subjectId: string
}

type PropsAutocompleteSubject = {
    selectedAdSubject: SubjectAutofill | undefined
    setSelectedAdSubject: (subject: SubjectAutofill | undefined) => void
    subjects: {
        id: string;
        name: string;
    }[]
}

const AutocompleteSubject = ({ selectedAdSubject, setSelectedAdSubject, subjects }: PropsAutocompleteSubject) => {

    const theme = useMantineTheme();
    const [typedAdSubject, setTypedAdSubject] = useState<string>("");
    const data = subjects.map((subject) => { return { value: subject.name, subjectId: subject.id } });

    return (
        <Stack spacing={'sm'}>
            <Autocomplete
                label='Subject'
                value={selectedAdSubject?.value}
                onChange={(value) => {
                    setSelectedAdSubject(data.find((subject) => subject.value === value));
                    setTypedAdSubject(value);
                }}
                icon={<IconSchool color={theme.colors.brandGray[0]} />}
                radius={theme.radius.md}
                data={data}
                nothingFound="No subjects found"
                required
                limit={6}
                sx={{ flexGrow: 1 }}
                error={
                    typedAdSubject.length !== 0 && selectedAdSubject === undefined
                }
            />
            <HelpPopover helpText='Select the subject you want to advertise for.' />
        </Stack>

    )
}

export default AutocompleteSubject