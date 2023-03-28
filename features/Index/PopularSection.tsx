import { Box, createStyles, Divider, Grid, Text, Title } from '@mantine/core';
import React from 'react';
import ResponsiveContainer from '../../components/Container/ResponsiveContainer';
import MantineLink from '../../components/Link/MantineLink';

const useStyles = createStyles((theme) => ({

    labelBack: {
        fontWeight: 500,
        color: 'white',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
            alignSelf: 'flex-end',
            textAlign: 'end',
        },
    },

}));

interface Props {
    title: string
    desc: string | undefined
    buttonText: string
    buttonUrl: string
    brandColor?: boolean
    children: React.ReactNode
}

const PopularSection: React.FC<Props> = ({ title, desc, buttonText, buttonUrl, brandColor, children }: Props) => {

    const { classes, theme } = useStyles();

    return (
        <Box sx={{ backgroundColor: brandColor ? theme.colors.brandOrange[5] : "inherit" }}>

            <ResponsiveContainer paddingY>

                <Title order={2} color={brandColor ? 'light.0' : 'light.9'}>{title}</Title>
                <Grid pb={'sm'}>
                    <Grid.Col md={8} sm={12}>
                        {desc && <Text color={brandColor ? 'light.0' : 'light.9'}>{desc}</Text>}
                    </Grid.Col>

                    <Grid.Col md={4} sm={12} className={classes.labelBack}>
                        <MantineLink url={"#"} props={{ color: brandColor ? 'light.0' : undefined }} type="internal">{buttonText}</MantineLink>
                    </Grid.Col>
                </Grid>

                {
                    brandColor ? <Divider color={"light.0"} sx={{ opacity: 0.7 }} /> : <Divider />
                }

                <Grid gutter={theme.spacing.lg} mt={"md"}>{children}</Grid>

            </ResponsiveContainer>

        </Box>
    )
}

export default PopularSection