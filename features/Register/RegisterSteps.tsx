import { Box, Button, Center, Group, Paper, PasswordInput, Stack, Stepper, Text, TextInput, useMantineTheme } from '@mantine/core';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useAuth } from '../../lib/context/SessionContext';
import { isEmailValid, isPasswordValid } from '../../lib/accountHandling/regex';
import { InstitutionRegistrationItem, RegisterStatus } from '../../lib/types/AccountHandlingTypes';
import InstitutionSelect from './InstitutionSelect';
import PasswordStrengthField from './PasswordStrengthField';
import { toLink } from '../../lib/util/util';
import { URL_ACCOUNT } from '../../lib/url-helper/urlConstants';

interface Props {
    registrationInstitutes: InstitutionRegistrationItem[]
}

const RegisterSteps: React.FC<Props> = ({ registrationInstitutes }: Props) => {

    const theme = useMantineTheme();
    const { setAuthToken } = useAuth();
    const router = useRouter();

    // Stepper
    const [active, setActive] = useState(0);
    const [registerResult, setRegisterResult] = useState<RegisterStatus>(null);
    const nextStep = () => {
        if (active === 2) {
            // If the user is on the last step, submit the form
            submitRegistration();
        }
        // Go to next step
        setActive((current) => (current < 3 ? current + 1 : current));

    };
    const prevStep = () => {
        setActive((current) => (current > 0 ? current - 1 : current));
    };

    // INSTITUTION
    const [selectedInstitutionId, setSelectedInstitutionId] = useState('');
    const [selectedInstitution, setSelectedInstitution] = useState<InstitutionRegistrationItem | null>(null);

    // DETAILS
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    // Form Errors
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [institutionError, setInstitutionError] = useState("");

    // Language
    const { t } = useTranslation('loginLogout');

    const isNextDisabled = (): boolean => {
        if (active === 0 && (!selectedInstitution || institutionError.length > 0)) return true;
        if (active === 1 && (
            email.length === 0 || password.length === 0 || password !== passwordConfirm ||
            !isEmailValid(email) || !isPasswordValid(password) ||
            emailError.length > 0 || passwordError.length > 0)
        ) return true;
        else return false;
    }

    // Handle API
    const submitRegistration = async () => {

        const res = await fetch('/api/account/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                institutionID: selectedInstitution?.id
            })
        }).then((t) => t.json());

        const status = res.status as RegisterStatus;
        setRegisterResult(status);
        switch (status) {
            case 'INVALID_EMAIL':
                setEmailError(t('signup.step-2.error.email-invalid'));
                break;
            case 'INVALID_PASSWORD':
                setPasswordError(t('signup.step-2.error.password-invalid'));
                break;
            case 'EMAIL_TAKEN':
                setEmailError(t('signup.step-2.error.email-taken'));
                break;
            case 'INSTITUTION_TAKEN':
                setInstitutionError(t('signup.step-2.error.institution-taken'));
                break;
            case 'SUCCESS':
                setTimeout(() => {
                    setAuthToken(res.token, res.lifetime);
                    router.replace(toLink(URL_ACCOUNT));
                }, 5000);
                break;
        }
    }

    return (
        <Box component='form' sx={{ height: "100%" }}>
            <Paper p={"lg"} shadow="sm" radius="md" h={'100%'} sx={{ backgroundColor: theme.colors.light[0], }}>

                <Stepper active={active} breakpoint="sm">
                    <Stepper.Step label={t('signup.step-1.label')} description={t('signup.step-1.desc')}>

                        <Center mt={theme.spacing.lg}>
                            <Stack sx={{ maxWidth: 650 }} >

                                <InstitutionSelect
                                    registrationInstitutes={registrationInstitutes}
                                    setSelectedInstitution={setSelectedInstitution}
                                    institutionError={institutionError}
                                    setInstitutionError={setInstitutionError}
                                    selectedInstitutionId={selectedInstitutionId}
                                    setSelectedInstitutionId={setSelectedInstitutionId}
                                />

                            </Stack>
                        </Center>

                    </Stepper.Step>
                    <Stepper.Step label={t('signup.step-2.label')} description={t('signup.step-2.desc')}>

                        <Center mt={theme.spacing.lg}>
                            <Stack sx={{ maxWidth: 650 }}>
                                <TextInput
                                    value={email}
                                    onChange={(e) => setEmail(e.currentTarget.value)}
                                    radius={theme.radius.md}
                                    label={t('signup.step-2.email.label')}
                                    description={t('signup.step-2.email.helper')}
                                    placeholder={t('signup.step-2.email.placeholder')}
                                    required
                                    autoComplete='email'
                                    spellCheck={false}
                                    error={email === "" || isEmailValid(email) ? "" : "Invalid email"}
                                />

                                <PasswordStrengthField value={password} onChange={setPassword} />

                                <PasswordInput
                                    radius={theme.radius.md}
                                    label={t('signup.step-2.password-confirm.label')}
                                    placeholder={t('signup.step-2.password-confirm.placeholder')}
                                    value={passwordConfirm}
                                    onChange={(event) => setPasswordConfirm(event.currentTarget.value)}
                                    required
                                    autoComplete='new-password'
                                    error={password !== passwordConfirm}
                                />
                            </Stack>
                        </Center>

                    </Stepper.Step>
                    <Stepper.Step label={t('signup.step-3.label')} description={t('signup.step-3.desc')}>

                        <Text>{email}</Text>
                        <Text>{password}</Text>
                        <Text>{selectedInstitution?.name}</Text>

                    </Stepper.Step>
                    <Stepper.Completed>
                        {
                            registerResult === null && t('signup.step-3.text-waiting')
                        }
                        {
                            registerResult === "SUCCESS" && t('signup.step-3.text-success')
                        }
                    </Stepper.Completed>
                </Stepper>

                <Group position="apart" mt="xl">
                    <Button
                        radius={theme.radius.md}
                        variant="default"
                        onClick={prevStep}
                        disabled={active === 0}
                    >
                        {t('signup.stepper.back')}
                    </Button>
                    <Button
                        radius={theme.radius.md}
                        onClick={nextStep}
                        disabled={isNextDisabled() || active === 3}
                    >
                        {active >= 2 ? t('signup.stepper.finish') : t('signup.stepper.next')}
                    </Button>
                </Group>

            </Paper>
        </Box>
    )
}

export default RegisterSteps