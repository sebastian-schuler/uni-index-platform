import { Box, Typography } from '@mui/material'
import React from 'react'
import LanguageList from '../../components/layout/nav/LanguageList'

const Settings = () => {
  return (
    <Box>
        <Typography variant="h5">Settings</Typography>
        <LanguageList />
    </Box>
  )
}

export default Settings