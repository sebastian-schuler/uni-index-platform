import { Box, Container } from '@mantine/core'
import { NextPage } from 'next'
import React, { ReactNode } from 'react'
import Footer, { FooterContent } from './footer/Footer'

type Props = {
    children: ReactNode,
    removeVerticalPadding?: boolean
    removeContainerWrapper?: boolean
    footerContent?: FooterContent[],
}

const LayoutContainer: NextPage<Props> = props => {

    const { children, removeVerticalPadding, removeContainerWrapper, footerContent } = props;

    return (
        <>
            <Box component={'main'} >

                {
                    removeContainerWrapper ? children :
                        (
                            <Container size={"lg"} py={removeVerticalPadding ? 0 : 48}>
                                {children}
                            </Container>
                        )
                }

            </Box>
            {
                <Footer footerContent={footerContent} />
            }
        </>
    )

}

export default LayoutContainer