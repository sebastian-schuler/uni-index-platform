import { DefaultProps, Paper, useMantineTheme } from '@mantine/core';
import React, { memo } from 'react';

interface Props extends DefaultProps {
    children: React.ReactNode
}

const BrandPaper: React.FC<Props> = (props) => {
    const theme = useMantineTheme();
    return (
        <Paper {...props} shadow="sm" radius="md" sx={{ backgroundColor: theme.colors.light[0], ...props.sx }} />
    )
}

export default memo(BrandPaper);