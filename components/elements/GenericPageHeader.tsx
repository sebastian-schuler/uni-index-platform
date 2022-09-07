import { Stack, Typography } from '@mui/material'
import React, { memo } from 'react'

type Props = {
    title: string
    description: string
}

const GenericPageHeader: React.FC<Props> = props => {

    const { title, description } = props;

    return (
        <Stack sx={{ marginBottom: 2 }}>
            <Typography
                variant="h6"
                component="h2"
            >
                {title}
            </Typography>
            <Typography
                variant="subtitle1"
                component="span"
            >
                {description}
            </Typography>
        </Stack>
    )
}

export default memo(GenericPageHeader)