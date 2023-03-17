import React from 'react'
import ResponsiveWrapper from '../../components/Container/ResponsiveWrapper'
import { Title, Text, Anchor, Stack, Box } from '@mantine/core'

const PrivacyPolicyPage = () => {

    return (
        <ResponsiveWrapper>

            <Title order={1} size={'h3'} mb={'md'}>Datenschutzerklärung</Title>

            <Stack>

                <Text>Die nachfolgende Datenschutzerklärung gilt für die Nutzung der Webseite analyse.hs-kl.de (nachfolgend „Webseite“).</Text>

                <Text>Wir messen dem Datenschutz große Bedeutung bei. Die Erhebung und Verarbeitung Ihrer personenbezogenen Daten geschieht unter Beachtung der geltenden datenschutzrechtlichen Vorschriften, insbesondere der insbesondere der Datenschutz-Grundverordnung (DSGVO) dem Landesdatenschutzgesetz (LDSG) des Landes Rheinland-Pfalz und dem Telemediengesetz (TMG). Wir erheben und verarbeiten Ihre personenbezogenen Daten, um Ihnen das oben genannten Portal anbieten zu können. Diese Erklärung beschreibt, wie und zu welchem Zweck Ihre Daten erfasst und genutzt werden und welche Wahlmöglichkeiten Sie im Zusammenhang mit persönlichen Daten haben.
                </Text>

                <Text>Durch Ihre Verwendung dieser Website stimmen Sie der Erfassung, Nutzung und Übertragung Ihrer Daten gemäß dieser Datenschutzerklärung zu.</Text>

            </Stack>
        </ResponsiveWrapper>
    )
}

export default PrivacyPolicyPage