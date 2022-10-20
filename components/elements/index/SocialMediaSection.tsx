import { Box, Card, CardSection, Grid, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { Country } from '@prisma/client'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { SmRankingEntry, SmRankingEntryMinified, SocialMediaDBEntry } from '../../../lib/types/SocialMediaTypes'
import { getLocalizedName } from '../../../lib/util/util'
import ResponsiveContainer from '../../layout/ResponsiveContainer'
import WhiteCard from '../../layout/WhiteCard'
import SmIndexTopRanking from '../socialmedia/SmIndexTopRanking'
import BestTwitterCard from './BestTwitterCard'
import BestYoutubeCard from './BestYoutubeCard'

interface Props {
  socialMediaList: SmRankingEntryMinified[]
  highestTwitterStringified: string
  highestYoutubeStringified: string
  countries: Country[]
}

const SocialMediaSection: React.FC<Props> = ({ socialMediaList, highestTwitterStringified, highestYoutubeStringified, countries }: Props) => {

  const highestTwitter = JSON.parse(highestTwitterStringified) as SocialMediaDBEntry;
  const highestYoutube = JSON.parse(highestYoutubeStringified) as SocialMediaDBEntry;

  return (
    <ResponsiveContainer paddingY>

      <Stack spacing={0}>
        <Title order={2} color={'dark.0'}>
          Social Media Ranking
        </Title>
        <Text>We looked at every institutions social media pages.</Text>
      </Stack>

      <Grid mt={'md'}>

        <Grid.Col span={6}>
          <SmIndexTopRanking
            socialMediaList={socialMediaList}
            countries={countries}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <Stack>
            <BestTwitterCard highestTwitter={highestTwitter} />
            <BestYoutubeCard highestYoutube={highestYoutube} />
          </Stack>
        </Grid.Col>

      </Grid>
    </ResponsiveContainer>
  )

}

export default SocialMediaSection