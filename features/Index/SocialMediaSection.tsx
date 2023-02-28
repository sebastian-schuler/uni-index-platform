import { SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { Country } from '@prisma/client'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import ResponsiveContainer from '../../components/Container/ResponsiveContainer'
import { SmBestCardMinified, SmRankingEntryMinified } from '../../lib/types/SocialMediaTypes'
import SmIndexTopRanking from '../SocialMedia/SmIndexTopRanking'
import BestTwitterCard from './BestTwitterCard'
import BestYoutubeCard from './BestYoutubeCard'

interface Props {
  socialMediaList: SmRankingEntryMinified[]
  highestTwitter: SmBestCardMinified
  highestYoutube: SmBestCardMinified
  countries: Country[]
}

const SocialMediaSection: React.FC<Props> = ({ socialMediaList, highestTwitter, highestYoutube, countries }: Props) => {

  const { t } = useTranslation('index');

  return (
    <ResponsiveContainer id='socialMediaSection' paddingY>

      <Stack spacing={0}>
        <Title order={2}>{t('social-media.title')}</Title>
        <Text>{t('social-media.desc')}</Text>
      </Stack>

      <SimpleGrid
        mt={'md'}
        breakpoints={[
          { minWidth: 'md', cols: 2, spacing: 'md' },
          { minWidth: 'sm', cols: 1, spacing: 'sm' },
        ]}
      >

        <SmIndexTopRanking
          socialMediaList={socialMediaList}
          countries={countries}
        />

        <Stack spacing={"md"}>
          <BestTwitterCard highestTwitter={highestTwitter} />
          <BestYoutubeCard highestYoutube={highestYoutube} />
        </Stack>

      </SimpleGrid>
    </ResponsiveContainer>
  )

}

export default SocialMediaSection