import { Paper, useMantineTheme, Sx } from '@mantine/core';

interface Props {
    children: React.ReactNode
    sx?: Sx
}

const InstitutionPaper = ({ children, sx }: Props) => {
    const theme = useMantineTheme();

    return (
        <Paper shadow="sm" px="lg" py="xl" sx={{ ...sx, backgroundColor: theme.colors.light[0] }}>
            {children}
        </Paper>
    )
}

export default InstitutionPaper