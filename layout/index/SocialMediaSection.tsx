import { SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { Country } from '@prisma/client'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import BestTwitterCard from '../../components/elements/index/BestTwitterCard'
import BestYoutubeCard from '../../components/elements/index/BestYoutubeCard'
import SmIndexTopRanking from '../../components/elements/socialmedia/SmIndexTopRanking'
import { SmBestCardMinified, SmRankingEntryMinified } from '../../lib/types/SocialMediaTypes'
import ResponsiveContainer from '../ResponsiveContainer'

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