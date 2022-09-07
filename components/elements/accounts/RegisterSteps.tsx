import { Autocomplete, Box, Button, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useAuth } from '../../../context/SessionContext';
import { isDisplayNameValid, isEmailValid, isPasswordValid } from '../../../lib/regex';
import { InstitutionRegistrationItem, RegisterStatus } from '../../../lib/types/AccountHandlingTypes';
import Link from '../../mui/NextLinkMui';
import PasswordInput from './PasswordInput';

type Props = {
    registrationInstitutes: InstitutionRegistrationItem[]
}

const RegisterSteps: React.FC<Props> = props => {
    const { registrationInstitutes } = props;
    const { setAuthToken } = useAuth();
    const router = useRouter();

    // FORM VALUES
    const [selectedInstitution, setSelectedInstitution] = useState<InstitutionRegistrationItem | null>(null);
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    // Form Errors
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [displayNameError, setDisplayNameError] = useState("");
    const [institutionError, setInstitutionError] = useState("");

    // Language
    const { t } = useTranslation('loginLogout');
    const DataNoticeLink = (p: any) => <Link href={"/terms"}><span className='text-secondary-accent hover:underline'>{langContent.TermsName}</span></Link>
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

    // Steps localized
    const steps = Array.isArray(langContent.stepsArray) ? langContent.stepsArray.map((step, index) => {
        let key = Object.keys(step)[0];
        return step[key];
    }) : ['Select institution', 'Enter your details', 'Confirm'];

    // Form
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        // If finished
        if (activeStep === steps.length - 1) {
            submitRegistration();
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const isStepFailed = (step: number) => {
        if (step === 0 && (institutionError.length > 0)) return true;
        if (step === 1 && (
            ((email.length > 0 && !isEmailValid(email)) || emailError.length > 0) ||
            ((password.length > 0 && !isPasswordValid(password)) || passwordError.length > 0) ||
            (displayNameError.length > 0)
        )) return true;
        return false;
    };

    const isNextDisabled = () => {
        if (activeStep === 0 && (!selectedInstitution || institutionError.length > 0)) return true;
        if (activeStep === 1 && (
            email.length === 0 || password.length === 0 ||
            !isEmailValid(email) || !isPasswordValid(password) ||
            emailError.length > 0 || passwordError.length > 0 || displayNameError.length > 0)
        ) return true;
        else return false;
    }

    // Textfield Change Handlers
    const handleEmailChange = (value: string) => {
        setEmail(value);
        if (value.length === 0 || isEmailValid(value)) {
            setEmailError("");
        } else {
            setEmailError(langContent.errorEmailInvalid);
        }
    }
    const handlePasswordChange = (value: string) => {
        setPassword(value);
        if (value.length === 0 || isPasswordValid(value)) {
            setPasswordError("");
        } else {
            setPasswordError(langContent.errorPasswordInvalid);
        }
    }
    const handleDisplayNameChange = (value: string) => {
        setDisplayName(value);
        console.log(value)
        if (value.length === 0 || isDisplayNameValid(value)) {
            setDisplayNameError("");
        } else {
            setDisplayNameError(langContent.errorDisplayNameInvalid);
        }
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
                displayName: displayName,
                institutionID: selectedInstitution?.id
            })
        }).then((t) => t.json());

        const status = res.status as RegisterStatus;
        switch (status) {
            case 'INVALID_DISPLAYNAME':
                setDisplayNameError(langContent.errorDisplayNameInvalid);
                break;
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
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                setTimeout(() => {
                    setAuthToken(res.token, res.lifetime);
                    router.replace('/account');
                }, 3000);
                break;
        }
    }

    return (
        <>

            <Stepper activeStep={activeStep} sx={{ paddingBottom: 3 }}>
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
            )}

        </>
    )
}

export default RegisterSteps