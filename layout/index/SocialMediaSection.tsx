import { Grid, Stack, Text, Title } from '@mantine/core'
import { Country } from '@prisma/client'
import React from 'react'
import { SmRankingEntryMinified, SocialMediaDBEntry } from '../../lib/types/SocialMediaTypes'
import ResponsiveContainer from '../ResponsiveContainer'
import SmIndexTopRanking from '../../components/elements/socialmedia/SmIndexTopRanking'
import BestTwitterCard from '../../components/elements/index/BestTwitterCard'
import BestYoutubeCard from '../../components/elements/index/BestYoutubeCard'

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
    <ResponsiveContainer id='socialMediaSection' paddingY>

      <Stack spacing={0}>
        <Title order={2} color={'light.9'}>
          Social Media Ranking
        </Title>
        <Text>We looked at every institutions social media pages.</Text>
      </Stack>

      <Grid mt={'md'} gutter={"lg"}>

        <Grid.Col span={6}>
          <SmIndexTopRanking
            socialMediaList={socialMediaList}
            countries={countries}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <Stack spacing={"lg"}>
            <BestTwitterCard highestTwitter={highestTwitter} />
            <BestYoutubeCard highestYoutube={highestYoutube} />
          </Stack>
        </Grid.Col>

      </Grid>
    </ResponsiveContainer>
  )

}

export default SocialMediaSection