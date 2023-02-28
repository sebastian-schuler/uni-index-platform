import { Stack, Title } from '@mantine/core';
import LanguageSettings from '../../features/Account/AccountLangSettings';

const Settings = () => {

  return (
    <Stack>
      <Title order={5}>Settings</Title>
      <LanguageSettings />
    </Stack>
  )
}

export default Settings