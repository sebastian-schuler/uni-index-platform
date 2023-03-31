import { ActionIcon, Autocomplete, Group, useMantineTheme } from '@mantine/core';
import { IconSchool, IconX } from '@tabler/icons-react';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { InstitutionRegistrationItem } from '../../lib/types/AccountHandlingTypes';

interface Props {
    registrationInstitutes: InstitutionRegistrationItem[]
    selectedInstitutionId: string
    setSelectedInstitutionId: (id: string) => void
    setSelectedInstitution: (item: InstitutionRegistrationItem | null) => void
    institutionError: string
    setInstitutionError: (error: string) => void
}

const InstitutionSelect: React.FC<Props> = (
    { registrationInstitutes, selectedInstitutionId, setSelectedInstitutionId, setSelectedInstitution, institutionError, setInstitutionError }: Props
) => {

    const theme = useMantineTheme();
    const { t } = useTranslation('loginLogout');

    const institutionList = registrationInstitutes.map((item) => ({
        value: item.name,
        item: item
    }))

    const handleInstitutionChange = (value: string) => {

        const selectedInstitution = institutionList.find((item) => item.value === value)?.item || null;

        setSelectedInstitutionId(value);
        setSelectedInstitution(selectedInstitution);

        if (value.length === 0) {
            setInstitutionError("");

        } else if (selectedInstitution === null) {
            setInstitutionError(t('signup.step-1.institution-select.error-notfound'));

        } else if (selectedInstitution.hasAccount) {
            setInstitutionError(t('signup.step-1.institution-select.error-taken'));

        } else {
            setInstitutionError("");
        }
    }

    return (
        <Group spacing={0}>
            <Autocomplete
                label={t('signup.step-1.institution-select.label')}
                description={t('signup.step-1.institution-select.helper')}
                radius={theme.radius.md}
                icon={<IconSchool color={theme.colors.brandGray[0]} />}
                value={selectedInstitutionId}
                size='md'
                onChange={handleInstitutionChange}
                data={institutionList}
                autoCorrect={"off"}
                spellCheck={false}
                limit={5}
                error={institutionError}
                onItemSubmit={(value) => handleInstitutionChange(value.value)}
                rightSection={
                    selectedInstitutionId.length > 0 &&
                    <ActionIcon radius="xl" onClick={() => handleInstitutionChange("")}>
                        <IconX size={theme.fontSizes.md} />
                    </ActionIcon>
                }
                required
            />

        </Group>
    )
}

export default InstitutionSelect