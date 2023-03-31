import { useState } from 'react';
import { IconX, IconCheck } from '@tabler/icons-react';
import { PasswordInput, Progress, Text, Popover, Box, useMantineTheme, ThemeIcon } from '@mantine/core';
import useTranslation from 'next-translate/useTranslation';

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
    return (
        <Text
            color={meets ? 'teal' : 'red'}
            sx={{ display: 'flex', alignItems: 'center' }}
            mt={7}
            size="sm"
        >
            {meets ? (
                <ThemeIcon variant='light'>
                    <IconCheck size={14} />
                </ThemeIcon>
            ) : (
                <ThemeIcon variant='light'>
                    <IconX size={14} />
                </ThemeIcon>
            )}
            <Box ml={'sm'}>{label}</Box>
        </Text>
    );
}

interface Props {
    value: string;
    onChange: (value: string) => void;
}
const PasswordStrengthField = ({ value, onChange }: Props) => {

    const { t } = useTranslation('loginLogout');
    const theme = useMantineTheme();
    const [popoverOpened, setPopoverOpened] = useState(false);

    const requirements = [
        { re: /[0-9]/, label: t('signup.step-2.password.req.number') },
        { re: /[a-z]/, label: t('signup.step-2.password.req.lower') },
        { re: /[A-Z]/, label: t('signup.step-2.password.req.upper') },
        { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: t('signup.step-2.password.req.special') },
    ];

    function getStrength(password: string) {
        let multiplier = password.length > 5 ? 0 : 1;
        requirements.forEach((requirement) => {
            if (!requirement.re.test(password)) {
                multiplier += 1;
            }
        });
        return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
    }

    const checks = requirements.map((requirement, index) => (
        <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
    ));

    const strength = getStrength(value);
    const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

    return (
        <Popover opened={popoverOpened} position="bottom" width="target" transitionProps={{ transition: "pop" }}>
            <Popover.Target>
                <div
                    onFocusCapture={() => setPopoverOpened(true)}
                    onBlurCapture={() => setPopoverOpened(false)}
                >
                    <PasswordInput
                        radius={theme.radius.md}
                        label={t('signup.step-2.password.label')}
                        placeholder={t('signup.step-2.password.placeholder')}
                        value={value}
                        onChange={(event) => onChange(event.currentTarget.value)}
                        required
                        autoComplete='new-password'
                    />
                </div>
            </Popover.Target>
            <Popover.Dropdown>
                <Progress color={color} value={strength} size={5} style={{ marginBottom: 10 }} />
                <PasswordRequirement label={t('signup.step-2.password.req.length')} meets={value.length > 5} />
                {checks}
            </Popover.Dropdown>
        </Popover>
    );
}

export default PasswordStrengthField