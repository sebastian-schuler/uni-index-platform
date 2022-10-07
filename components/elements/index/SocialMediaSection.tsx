import { Box, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import React from 'react'
import { SmRankingEntryMinified } from '../../../lib/types/SocialMediaTypes'
import ResponsiveContainer from '../../layout/ResponsiveContainer'
import SmIndexTopRanking from '../socialmedia/SmIndexTopRanking'

interface Props {
  socialMediaList: SmRankingEntryMinified[]
}

const SocialMediaSection: React.FC<Props> = ({ socialMediaList }: Props) => {

  return (
    <ResponsiveContainer paddingY>

      <Stack spacing={0}>
        <Title order={2} color={'dark.0'}>
          Social Media Ranking
        </Title>
        <Text>We looked at every institutions social media pages.</Text>
      </Stack>

      <SimpleGrid cols={2} mt={'md'}>

        <Box>
          <SmIndexTopRanking socialMediaList={socialMediaList} />
        </Box>

        <Box>
          Highlighted Social Media Profiles
        </Box>

      </SimpleGrid>
    </ResponsiveContainer>
  )

}

export default SocialMediaSection