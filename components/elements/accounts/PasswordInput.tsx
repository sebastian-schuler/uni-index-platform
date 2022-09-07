import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, SxProps, Theme } from '@mui/material';
import useTranslation from 'next-translate/useTranslation';
import React from 'react'

type Props = {
    password: string;
    setPassword: (password: string) => void;
    onChange?: (e: string) => void;
    onKeyDown?: (key: string) => void;
    isError?: boolean;
    errorMessage?: string;
    sx?: SxProps<Theme>;
}

const PasswordInput: React.FC<Props> = props => {
    const { password, setPassword, isError, onKeyDown, sx, onChange, errorMessage } = props;

    const { t } = useTranslation('loginLogout');
    const langContent = {
        passwordLabel: t('login-password-label'),
    }

    const [showPassword, setShowpassword] = React.useState<boolean>(false);

    const handleClickShowPassword = () => {
        setShowpassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <FormControl fullWidth variant="outlined" error={isError} required sx={sx}>
            <InputLabel htmlFor="outlined-adornment-password" >{langContent.passwordLabel}</InputLabel>
            <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                    if (onChange === undefined) setPassword(e.target.value)
                    else onChange(e.target.value)
                }}
                onKeyDown={(e) => { if (onKeyDown !== undefined) onKeyDown(e.key) }}
                required
                aria-describedby="component-error-text"
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                label={langContent.passwordLabel}
            />
            {
                isError && <FormHelperText id="component-error-text">{errorMessage === undefined ? "Wrong password" : errorMessage}</FormHelperText>
            }
        </FormControl>
    )
}

export default PasswordInput