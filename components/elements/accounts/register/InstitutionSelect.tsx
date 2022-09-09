import { ActionIcon, Autocomplete, Group, SelectItemProps, Text, useMantineTheme } from '@mantine/core';
import { IconSchool, IconX } from '@tabler/icons';
import useTranslation from 'next-translate/useTranslation';
import React, { forwardRef } from 'react';
import { InstitutionRegistrationItem } from '../../../../lib/types/AccountHandlingTypes';

interface ItemProps extends SelectItemProps {
    value: string
    item: InstitutionRegistrationItem
}

const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ value, item, ...others }: ItemProps, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <div>
                    <Text color={item.hasAccount ? "red" : "black"}>{value}</Text>
                    <Text size="xs" color="red">
                        {item.hasAccount ? "Institution already has an account" : ""}
                    </Text>
                </div>
            </Group>
        </div>
    )
);

interface Props {
    registrationInstitutes: InstitutionRegistrationItem[]

    selectedInstitutionId: string
    setSelectedInstitutionId: (id: string) => void

    setSelectedInstitution: (item: InstitutionRegistrationItem | null) => void
    institutionError: string
    setInstitutionError: (error: string) => void
}

const InstitutionSelect: React.FC<Props> = ({ registrationInstitutes, selectedInstitutionId, setSelectedInstitutionId, setSelectedInstitution, institutionError, setInstitutionError }: Props) => {

    const theme = useMantineTheme();

    const { t } = useTranslation('loginLogout');
    const langContent = {
        institutionLabel: t('signup-institution-label'),
        institutionHelper: t('signup-institution-helper'),
        errorInstitutionTaken: t('signup-error-institution-taken'),
    }

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
            setInstitutionError("Institution not found");
        } else if (selectedInstitution.hasAccount) {
            setInstitutionError(langContent.errorInstitutionTaken);
        }
    }

    return (
        <Group spacing={0}>
            <Autocomplete
                label={langContent.institutionLabel}
                description={langContent.institutionHelper}
                radius={theme.radius.md}
                icon={<IconSchool color={theme.colors.brandGray[0]} />}
                value={selectedInstitutionId}
                onChange={handleInstitutionChange}
                data={institutionList}
                autoCorrect={"off"}
                spellCheck={false}
                itemComponent={AutoCompleteItem}
                limit={5}
                error={institutionError}
                onItemSubmit={(value) => handleInstitutionChange(value.value)}
                rightSection={
                    selectedInstitutionId.length > 0 &&
                    <ActionIcon radius="xl" onClick={() => handleInstitutionChange("")}>
                        <IconX size={theme.fontSizes.md} />
                    </ActionIcon>
                }
            />

        </Group>
    )
}

export default InstitutionSelect