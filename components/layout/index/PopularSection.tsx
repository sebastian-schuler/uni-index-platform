import { Anchor, Box, Divider, Grid, Group, Stack, Text, Title, useMantineTheme } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import MantineLink from '../../elements/MantineLink'
import ResponsiveContainer from '../ResponsiveContainer'

type Props = {
    title: string
    buttonText: string
    buttonUrl: string
    brandColor?: boolean
    children: React.ReactNode
}

const PopularSection: React.FC<Props> = props => {

    const { title, buttonText, buttonUrl, brandColor, children } = props;

    const theme = useMantineTheme();

    return (
        <Box sx={{ backgroundColor: brandColor ? theme.colors.brandOrange[5] : "inherit" }}>

            <ResponsiveContainer paddingY>

                <Group sx={{ justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 1 }}>
                    <Title order={2} color={brandColor ? 'light.0' : 'dark.0'}>
                        {title}
                    </Title>
                    <MantineLink label={buttonText} url={buttonUrl} color={brandColor ? 'light.0' : undefined} />
                </Group>

                {
                    brandColor ? <Divider color={"light.0"} sx={{ opacity: 0.7 }} /> : <Divider />
                }

                <Grid gutter={12} mt={12}>{children}</Grid>

            </ResponsiveContainer>

        </Box>
    )
}

export default PopularSection