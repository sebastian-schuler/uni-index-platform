import { Divider, Typography } from '@mui/material'
import { Box } from '@mui/system'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import theme from '../../../theme/theme'
import LanguageList from './LanguageList'

type Props = {
    handleSettingsDrawerToggle: () => void
}

const SettingsDrawer: React.FC<Props> = props => {

    const { handleSettingsDrawerToggle } = props;
    const { t } = useTranslation("common");
    const langContent = {
        pageSettings: t("page-settings"),
    }

    return (
        <Box onClick={handleSettingsDrawerToggle} sx={{ textAlign: 'left' }}>
            <Typography variant="h6" padding={theme.spacing(2, 2)} sx={{}}>
                {langContent.pageSettings}
            </Typography>
            <Divider />
            <LanguageList />
        </Box>
    )
}

export default SettingsDrawer