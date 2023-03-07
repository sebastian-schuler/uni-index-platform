import { SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { Country } from '@prisma/client'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import SocialMediaCard from '../../components/Card/SocialMediaCard'
import ResponsiveContainer from '../../components/Container/ResponsiveContainer'
import { SmBestCardMinified, SmRankingEntryMinified } from '../../lib/types/SocialMediaTypes'
import SmIndexTopRanking from './SmIndexTopRanking'

interface Props {
  socialMediaList: SmRankingEntryMinified[]
  highestTwitter: SmBestCardMinified
  highestYoutube: SmBestCardMinified
  countries: Country[]
}

const SocialMediaSection: React.FC<Props> = ({ socialMediaList, highestTwitter, highestYoutube, countries }: Props) => {

  const { t } = useTranslation('index');

  return (
    <ResponsiveContainer props={{ id: 'socialMediaSection' }} paddingY>

      <Stack spacing={0}>
        <Title order={2}>{t('social-media.title')}</Title>
        <Text>{t('social-media.desc')}</Text>
      </Stack>

      <SimpleGrid
        mt={'md'}
        breakpoints={[
          { minWidth: 'md', cols: 2, spacing: 'lg' },
          { minWidth: 0, cols: 1, spacing: 'lg', verticalSpacing: 'lg' },
        ]}
      >

        <SmIndexTopRanking
          socialMediaList={socialMediaList}
          countries={countries}
        />

        <Stack spacing={"lg"}>
          <SocialMediaCard cardData={highestTwitter} />
          <SocialMediaCard cardData={highestYoutube} />
        </Stack>

      </SimpleGrid>
    </ResponsiveContainer>
  )

}

export default SocialMediaSection