import { Box, SimpleGrid } from '@mantine/core'
import React from 'react'
import ResponsiveContainer from '../../layout/ResponsiveContainer'
import SmIndexTopRanking from '../socialmedia/SmIndexTopRanking'

interface Props{

}

const SocialMediaSection:React.FC<Props> = ({}:Props) => {

  return (
    <ResponsiveContainer>
        <SimpleGrid cols={2}>

            <Box> 
                <SmIndexTopRanking />
            </Box>

            <Box>
                Highlighted Social Media Profiles
            </Box>

        </SimpleGrid>
    </ResponsiveContainer>
  )

}

export default SocialMediaSection