import { Box, SimpleGrid, Stack, Text, Title, useMantineTheme } from '@mantine/core'
import { Country } from '@prisma/client'
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


  return (
    <ResponsiveContainer id='socialMediaSection' paddingY>

      <Stack spacing={0}>
        <Title order={2}>
          Social Media Ranking
        </Title>
        <Text>We looked at every institutions social media pages.</Text>
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