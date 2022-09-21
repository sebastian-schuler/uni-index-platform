import { Box, Button, Center, Group, PasswordInput, Stack, Stepper, Text, TextInput, useMantineTheme } from '@mantine/core';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useAuth } from '../../../context/SessionContext';
import { isEmailValid, isPasswordValid } from '../../../lib/accountHandling/regex';
import { InstitutionRegistrationItem, RegisterStatus } from '../../../lib/types/AccountHandlingTypes';
import InstitutionSelect from '../../elements/accounts/register/InstitutionSelect';
import PasswordStrengthField from '../../elements/accounts/register/PasswordStrengthField';
import BrandPaper from '../BrandPaper';

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
    const langContent = {
        // Textfields
        institutionLabel: t('signup-institution-label'),
        institutionHelper: t('signup-institution-helper'),
        emailLabel: t('signup-email-label'),
        emailHelper: t('signup-email-helper'),
        passwordLabel: t('signup-password-label'),
        displaynameLabel: t('signup-displayname-label'),
        passwordHelper: t('signup-password-helper'),
        // Terms
        TermsName: t('signup-terms-name'),
        // Errors
        errorInstitutionTaken: t('signup-error-institution-taken'),
        errorEmailTaken: t('signup-error-email-taken'),
        errorEmailInvalid: t('signup-error-email-invalid'),
        errorPasswordInvalid: t('signup-error-password-invalid'),
        errorDisplayNameInvalid: t('signup-error-displayname-invalid'),
        errorStep: t('signup-error-step'),
        // Form
        next: t('signup-next'),
        back: t('signup-back'),
        finish: t('signup-finish'),
        signupCompleted: t('signup-completed'),
        stepsArray: t('signup-steps', { count: 1 }, { returnObjects: true }) as { [key in string]: string }[]
    }

    const isNextDisabled = (): boolean => {
        if (active === 0 && (!selectedInstitution || institutionError.length > 0)) return true;
        if (active === 1 && (
            email.length === 0 || password.length === 0 || password !== passwordConfirm ||
            !isEmailValid(email) || !isPasswordValid(password) ||
            emailError.length > 0 || passwordError.length > 0 )
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
                setEmailError(langContent.errorEmailInvalid);
                break;
            case 'INVALID_PASSWORD':
                setPasswordError(langContent.errorPasswordInvalid);
                break;
            case 'EMAIL_TAKEN':
                setEmailError(langContent.errorEmailTaken);
                break;
            case 'INSTITUTION_TAKEN':
                setInstitutionError(langContent.errorInstitutionTaken);
                break;
            case 'SUCCESS':
                setTimeout(() => {
                    setAuthToken(res.token, res.lifetime);
                    router.replace('/account');
                }, 5000);
                break;
        }
    }

    return (
        <Box component='form' sx={{ height: "100%" }}>

            <BrandPaper p={"lg"} sx={{ height: "100%" }}>

                <Stepper active={active} breakpoint="sm">
                    <Stepper.Step label="Institution" description="Select your institution">

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
                    <Stepper.Step label="Account Details" description="Set required account data">

                        <Center mt={theme.spacing.lg}>
                            <Stack sx={{ maxWidth: 650 }}>
                                <TextInput
                                    value={email}
                                    onChange={(e) => setEmail(e.currentTarget.value)}
                                    radius={theme.radius.md}
                                    label="Your email"
                                    description="E-Mail address has to be your institutions domain, e.g. @hs-kl.de"
                                    placeholder="Your email"
                                    required
                                    autoComplete='email'
                                    spellCheck={false}
                                    error={email === "" || isEmailValid(email) ? "" : "Invalid email"}
                                />

                                <PasswordStrengthField value={password} onChange={setPassword} />

                                <PasswordInput
                                    radius={theme.radius.md}
                                    label="Confirm password"
                                    placeholder="Confirm your password"
                                    value={passwordConfirm}
                                    onChange={(event) => setPasswordConfirm(event.currentTarget.value)}
                                    required
                                    autoComplete='new-password'
                                    error={password !== passwordConfirm}
                                />
                            </Stack>
                        </Center>

                    </Stepper.Step>
                    <Stepper.Step label="Confirm" description="Check if data is correct">

                        <Text>{email}</Text>
                        <Text>{password}</Text>
                        <Text>{selectedInstitution?.name}</Text>

                    </Stepper.Step>
                    <Stepper.Completed>
                        {
                            registerResult === null && "Waiting for response"
                        }
                        {
                            registerResult === "SUCCESS" && "Successfully registered, you will be redirected in a few seconds"
                        }
                    </Stepper.Completed>
                </Stepper>

                <Group position="apart" mt="xl">
                    <Button
                        radius={theme.radius.md}
                        variant="default"
                        onClick={prevStep}
                        disabled={active === 0}
                    >Back</Button>
                    <Button
                        radius={theme.radius.md}
                        onClick={nextStep}
                        disabled={isNextDisabled() || active === 3}
                    >
                        {active >= 2 ? "Finish" : "Next"}
                    </Button>
                </Group>

            </BrandPaper>


            {/* <Stepper activeStep={activeStep} sx={{ paddingBottom: 3 }}>
                {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                        optional?: React.ReactNode;
                        error?: boolean;
                    } = {};
                    if (isStepFailed(index)) {
                        labelProps.optional = (
                            <Typography variant="caption" color="error">
                                {langContent.errorStep}
                            </Typography>
                        );
                        labelProps.error = true;
                    }
                    return (
                        <Step key={label} {...stepProps} >
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>

            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        {langContent.signupCompleted}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    {
                        activeStep === 0 && (
                            <Box sx={{ mt: 2, mb: 1, px: 1 }}>
                                <Typography variant='body2'>{langContent.institutionHelper}</Typography>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-institution"
                                    options={registrationInstitutes}
                                    getOptionLabel={(option) => option.name}
                                    value={selectedInstitution}
                                    onChange={(e, value) => {
                                        setSelectedInstitution(value as InstitutionRegistrationItem);
                                        if (value !== null && value.hasAccount) {
                                            setInstitutionError(langContent.errorInstitutionTaken);
                                        } else {
                                            setInstitutionError("");
                                        }
                                    }}
                                    sx={{ width: '100%', mt: 2 }}
                                    renderInput={(params) => <TextField {...params} label={langContent.institutionLabel} />}
                                />
                                {
                                    institutionError.length > 0 && <Typography mt={1} color={'error'}>{institutionError}</Typography>
                                }
                            </Box>
                        )
                    }
                    {
                        activeStep === 1 && (
                            <Box sx={{ mt: 2, mb: 1, px: 1 }}>
                                <Typography variant='body2'>{langContent.emailHelper}</Typography>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label={langContent.emailLabel}
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={email}
                                    error={emailError.length > 0}
                                    helperText={emailError}
                                    onChange={(e) => handleEmailChange(e.target.value)}
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    id="displayname"
                                    label={langContent.displaynameLabel}
                                    name="displayname"
                                    value={displayName}
                                    onChange={(e) => handleDisplayNameChange(e.target.value)}
                                    error={displayNameError.length > 0}
                                    helperText={displayNameError}
                                />
                                <PasswordInput
                                    password={password}
                                    setPassword={setPassword}
                                    onChange={(val) => handlePasswordChange(val)}
                                    sx={{ mt: 2 }}
                                    isError={passwordError.length > 0}
                                    errorMessage={passwordError}
                                />
                                <Typography
                                    variant='caption'
                                    component={'p'}
                                    lineHeight={1.2}
                                    mt={1}
                                >
                                    {langContent.passwordHelper}
                                </Typography>
                            </Box>
                        )
                    }
                    {
                        activeStep === 2 && (
                            <Box sx={{ mt: 2, mb: 1, px: 1 }}>
                                <Trans
                                    i18nKey="account:signup-terms-notice"
                                    components={[<p className='text-sm' />, <DataNoticeLink />]}
                                />
                            </Box>
                        )
                    }
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            {langContent.back}
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button
                            onClick={handleNext}
                            disabled={isNextDisabled()}
                        >
                            {activeStep === steps.length - 1 ? langContent.finish : langContent.next}
                        </Button>
                    </Box>
                </React.Fragment>
            )} */}

        </Box>
    )
}

export default RegisterSteps