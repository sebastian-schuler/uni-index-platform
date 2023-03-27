import { Autocomplete, Group, Stack, useMantineTheme } from '@mantine/core';
import { Subject } from '@prisma/client';
import { IconSchool } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react'
import HelpPopover from '../../components/Popover/HelpPopover';
import { getUserDataFromApi } from '../../lib/accountHandling/AccountApiHandler';
import { UserDataProfile } from '../../lib/types/AccountHandlingTypes';

export type SubjectAutofill = {
    value: string
    subject: Subject
}

type PropsAutocompleteSubject = {
    token: string
    setUserData: (userData: UserDataProfile | null) => void
    selectedAdSubject: SubjectAutofill | undefined
    setSelectedAdSubject: (subject: SubjectAutofill | undefined) => void
}

const AutocompleteSubject = ({ token, setUserData, selectedAdSubject, setSelectedAdSubject }: PropsAutocompleteSubject) => {

    const theme = useMantineTheme();
    const [formAvailableSubjects, setFormAvailableSubjects] = useState<SubjectAutofill[]>([]);
    const [typedAdSubject, setTypedAdSubject] = useState<string>("");

    /**
 * Gets the subjects from the api and sets them as the available subjects
 */
    useEffect(() => {
        const getSubjects = async () => {
            const userDataRes = await getUserDataFromApi({ userSubjects: true, profile: true });
            if (userDataRes === null || userDataRes.status !== "SUCCESS") return;

            const subjectAutofill = userDataRes.subjects?.map((subject) => { return { value: subject.name, subject: subject } });
            setFormAvailableSubjects(subjectAutofill || []);
            setUserData(userDataRes.profile || null);
        }

        getSubjects();

        return () => { }
    }, [token])

    return (
        <Stack spacing={'sm'}>
            <Autocomplete
                label='Subject'
                value={selectedAdSubject?.value}
                onChange={(value) => {
                    setSelectedAdSubject(formAvailableSubjects.find((subject) => subject.value === value));
                    setTypedAdSubject(value);
                }}
                icon={<IconSchool color={theme.colors.brandGray[0]} />}
                radius={theme.radius.md}
                data={formAvailableSubjects}
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