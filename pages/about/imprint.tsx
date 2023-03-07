import { Stack, Text, Title } from '@mantine/core'
import React from 'react'
import ResponsiveWrapper from '../../components/Container/ResponsiveWrapper'
import MantineLink from '../../components/Link/MantineLink'
import EncryptedEmail from '../../components/Text/EncryptedEmail'

const Imprint = () => {
    return (
        <ResponsiveWrapper>

            <Stack>
                <Title order={1} size={'h3'}>Impressum</Title>

                <div>
                    <Title order={2} size={'h5'} pb={'xs'}>Anschrift</Title>
                    <Text>Hochschule Kaiserslautern</Text>
                    <Text>Schoenstr. 11</Text>
                    <Text>67659 Kaiserslautern</Text>
                    <Text>Telefon: +49 (0)6 31 / 37 24 - 0</Text>
                    <Text>Telefax: +49 (0)6 31 / 37 24 - 2105</Text>
                    <Text>E-Mail: <EncryptedEmail email={'presse@hs-kl.de'} /></Text>
                </div>

                <div>
                    <Title order={2} size={'h5'} pb={'xs'}>Ansprechpartner</Title>
                    <Text>Prof. Hendrik Speck</Text>
                    <Text>Fachbereich Informatik und Mikrosystemtechnik</Text>
                    <Text>Amerikastrasse 1</Text>
                    <Text>66482 Zweibrücken</Text>
                    <Text>Germany</Text>
                    <Text>Telefon: +49 (0)6 31 / 37 24 - 5360</Text>
                    <Text>Telefax: +49 (0)6 31 / 37 24 - 5313</Text>
                    <Text>E-Mail: <EncryptedEmail email={'hendrik.speck@hs-kl.de'} /></Text>
                </div>

                <div>
                    <Title order={2} size={'h5'} pb={'xs'}>Projekt</Title>
                    <Text>Forschungsprojekt n*soria</Text>
                    <Text>Website: <MantineLink type='external' url='https://www.nsoria.io'>n*soria</MantineLink></Text>
                </div>

            </Stack>

        </ResponsiveWrapper>
    )
}

export default Imprint