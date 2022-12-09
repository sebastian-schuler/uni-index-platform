import { Box, Divider, Grid, Group, Stack, Text, Title, useMantineTheme } from '@mantine/core'
import React from 'react'
import MantineLink from '../../components/elements/MantineLink'
import ResponsiveContainer from '../ResponsiveContainer'

interface Props {
    title: string
    subtext?: string
    buttonText: string
    buttonUrl: string
    brandColor?: boolean
    children: React.ReactNode
}

const PopularSection: React.FC<Props> = ({ title, subtext, buttonText, buttonUrl, brandColor, children }: Props) => {

    const theme = useMantineTheme();

    return (
        <Box sx={{ backgroundColor: brandColor ? theme.colors.brandOrange[5] : "inherit" }}>

            <ResponsiveContainer paddingY>

                <Group mb={"sm"} sx={{ justifyContent: "space-between", alignItems: "flex-end" }}>
                    <Stack spacing={0}>
                        <Title order={2} color={brandColor ? 'light.0' : 'light.9'}>
                            {title}
                        </Title>
                        {subtext && <Text color={brandColor ? 'light.0' : 'light.9'}>{subtext}</Text>}
                    </Stack>
                    <MantineLink label={buttonText} url={buttonUrl} color={brandColor ? 'light.0' : undefined} type="internal"/>
                </Group>

                {
                    brandColor ? <Divider color={"light.0"} sx={{ opacity: 0.7 }} /> : <Divider />
                }

                <Grid gutter={theme.spacing.lg} mt={"md"}>{children}</Grid>

            </ResponsiveContainer>

        </Box>
    )
}

export default PopularSection