import { SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { country } from '@prisma/client'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import SocialMediaCard from '../../components/Card/SocialMediaCard'
import ResponsiveContainer from '../../components/Container/ResponsiveContainer'
import { BestSocialMediaItem, SocialMediaGenericRankingItem } from '../../lib/types/social-media/SocialMediaSimplifiedTypes'
import SmIndexTopRanking from './SmIndexTopRanking'

interface Props {
  socialMediaList: SocialMediaGenericRankingItem[]
  bestTwitter: BestSocialMediaItem | null
  bestYoutube: BestSocialMediaItem | null
  countries: country[]
}

const SocialMediaSection: React.FC<Props> = ({ socialMediaList, bestTwitter, bestYoutube, countries }: Props) => {

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
          {
            bestTwitter && <SocialMediaCard cardData={bestTwitter} />
          }
          {
            bestYoutube && <SocialMediaCard cardData={bestYoutube} />
          }
        </Stack>

      </SimpleGrid>
    </ResponsiveContainer>
  )

}

export default SocialMediaSection