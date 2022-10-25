import { Card, List, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { Institution, InstitutionSocialMedia } from '@prisma/client'
import React from 'react'
import MantineLink from '../../elements/MantineLink'
import SmIconLink from '../../elements/socialmedia/SmIconLink'

interface Props {
    institutionSM: InstitutionSocialMedia
    institution: Institution
    classes: Record<"card" | "title", string>
    showTwitterNavItem: boolean
    showYoutubeNavItem: boolean
}

const SmHeaderSection: React.FC<Props> = ({ institutionSM, institution, classes, showTwitterNavItem, showYoutubeNavItem }: Props) => {

    return (
        <div>
            <Title order={2}>Social Media Statistics</Title>
            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>

            <SimpleGrid cols={2}>

                <Card shadow={"xs"} className={classes.card}>
                    <Text size="xs" color="dimmed" className={classes.title}>
                        Navigation
                    </Text>
                    <List type='ordered'>
                        <List.Item><MantineLink label='Overview' url='#sectionOverview' type='scroll' /></List.Item>
                        {
                            showTwitterNavItem && <List.Item><MantineLink label='Twitter Details' url='#sectionTwitterDetails' type='scroll' /></List.Item>
                        }
                        {
                            showYoutubeNavItem && <List.Item><MantineLink label='Youtube Details' url='#sectionYoutubeDetails' type='scroll' /></List.Item>
                        }
                    </List>
                </Card>

                <Card shadow={"xs"} className={classes.card}>
                    <Stack spacing={"sm"}>
                        <Text size="xs" color="dimmed" className={classes.title}>
                            Social Media Links
                        </Text>
                        {
                            institutionSM.youtube_url &&
                            <SmIconLink type='youtube' url={institutionSM.youtube_url} label title={`Youtube channel of ${institution.name}`} />
                        }
                        {
                            institutionSM.twitter_url &&
                            <SmIconLink type='twitter' url={institutionSM.twitter_url} label title={`Twitter profile of ${institution.name}`} />
                        }
                        {
                            institutionSM.facebook_url &&
                            <SmIconLink type='facebook' url={institutionSM.facebook_url} label title={`Facebook profile of ${institution.name}`} />
                        }
                        {
                            institutionSM.instagram_url &&
                            <SmIconLink type='instagram' url={institutionSM.instagram_url} label title={`Instagram profile of ${institution.name}`} />
                        }
                    </Stack>
                </Card>
            </SimpleGrid>
        </div>
    )
}

export default SmHeaderSection