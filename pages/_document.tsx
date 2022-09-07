import { createGetInitialProps } from '@mantine/next';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react'

// For custom getInitialProps: https://mantine.dev/guides/next/
const getInitialProps = createGetInitialProps();

export default class _Document extends Document {

    static getInitialProps = getInitialProps;

    render() {
        return (
            <Html>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

