import { Stack, Title } from '@mantine/core';
import LanguageSettings from '../../features/Account/AccountLangSettings';
import useTranslation from 'next-translate/useTranslation';

const Settings = () => {

  const { t } = useTranslation('account');

  return (
    <div>
      <Title order={5} mb={'lg'}>{t('settings.title')}</Title>
      <Stack>

        <LanguageSettings />
      </Stack>
    </div>
  )
}

export default Settings