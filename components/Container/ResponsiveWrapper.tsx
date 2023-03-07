import { Box, useMantineTheme } from '@mantine/core'
import { NextPage } from 'next'
import { ReactNode } from 'react'
import { HEADER_HEIGHT } from '../../features/AppShell/Shell'
import Footer, { FooterContent } from '../../features/Footer/Footer'
import ResponsiveContainer from './ResponsiveContainer'

type Props = {
    children: ReactNode,
    removeVerticalPadding?: boolean
    removeContainerWrapper?: boolean
    footerContent?: FooterContent[],
}

const ResponsiveWrapper: NextPage<Props> = props => {

    const { children, removeVerticalPadding, removeContainerWrapper, footerContent } = props;
    const theme = useMantineTheme();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - " + HEADER_HEIGHT + "px)", marginTop: HEADER_HEIGHT }}>
            <Box component={'main'} sx={{ flex: 2 }}>
                {
                    removeContainerWrapper ? children :
                        (
                            <ResponsiveContainer paddingY={!removeVerticalPadding}>
                                {children}
                            </ResponsiveContainer>
                        )
                }
            </Box>
            {
                <Footer footerContent={footerContent} />
            }
        </Box>
    )

}

export default ResponsiveWrapper