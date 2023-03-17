import { Stack, Text, Title, Anchor } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import ResponsiveWrapper from '../../components/Container/ResponsiveWrapper'
import MantineLink from '../../components/Link/MantineLink'
import EncryptedEmail from '../../components/Text/EncryptedEmail'
import { URL_ABOUT, URL_PRIVACY } from '../../lib/url-helper/urlConstants'
import { toLink } from '../../lib/util/util'

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

                <div>
                    <Title order={2} size={'h5'} pb={'xs'}>Vertretungsberechtigt</Title>
                    <Text>Die Hochschule Kaiserslautern wird gesetzlich durch den Präsidenten Prof. Dr.-Ing. Hans-Joachim Schmidt vertreten.</Text>
                    <Text>Die Hochschule Kaiserslautern ist eine Körperschaft des Öffentlichen Rechts.</Text>
                </div>

                <div>
                    <Title order={2} size={'h5'} pb={'xs'}>Zuständige Aufsichtsbehörde</Title>
                    <Text>Ministerium für Wissenschaft, Weiterbildung und Kultur des Landes Rheinland-Pfalz</Text>
                    <Text>Mittlere Bleiche 61</Text>
                    <Text>55116 Mainz</Text>
                </div>

                <div>
                    <Title order={2} size={'h5'} pb={'xs'}>Umsatzsteueridentifikationsnummer</Title>
                    <Text>DE 812 609 430 (gemäß § 27a Umsatzsteuergesetz)</Text>
                </div>

                <div>
                    <Title order={2} size={'h5'} pb={'xs'}>Datenschutzerklärung</Title>
                    <Text>Weitere Informationen finden Sie hier: <Anchor component={Link} href={toLink(URL_ABOUT, URL_PRIVACY)}>Datenschutz</Anchor></Text>
                </div>

            </Stack>

        </ResponsiveWrapper>
    )
}

export default Imprint