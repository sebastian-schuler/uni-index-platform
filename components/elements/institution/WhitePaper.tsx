import { Paper, useMantineTheme, Sx } from '@mantine/core';

interface Props {
    children: React.ReactNode
    px?: number | string
    py?: number | string
    sx?: Sx
}

const WhitePaper = ({ children, px, py, sx }: Props) => {
    const theme = useMantineTheme();

    return (
        <Paper shadow="sm" px={px || "lg"} py={py || "xl"} sx={{ ...sx, backgroundColor: theme.colors.light[0] }}>
            {children}
        </Paper>
    )
}

export default WhitePaper