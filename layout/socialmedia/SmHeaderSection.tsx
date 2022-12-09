import { ActionIcon, Card, Group, List, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { Institution, InstitutionSocialMedia } from '@prisma/client'
import { IconBrandTwitter, IconBrandYoutube } from '@tabler/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { URL_INSTITUTION } from '../../lib/url-helper/urlConstants'
import { toLink } from '../../lib/util/util'
import MantineLink from '../../components/elements/MantineLink'
import SmIconLink from '../../components/elements/socialmedia/SmIconLink'

interface Props {
    institutionSM: InstitutionSocialMedia
    institution: Institution
    classes: Record<"card" | "title", string>
    showTwitterNavItem: boolean
    showYoutubeNavItem: boolean
}

const SmHeaderSection: React.FC<Props> = ({ institutionSM, institution, classes, showTwitterNavItem, showYoutubeNavItem }: Props) => {

    const router = useRouter();
    console.log();
    const currentUrl = router.asPath;
    return (
        <Stack>
            <div>
                <Title order={2}>Social Media Statistics</Title>
                <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
            </div>
            <Group sx={{ justifyContent: "center" }} spacing={"xl"}>

                <Stack align={"center"} spacing={"sm"}>
                    <Link href={toLink(router.asPath, "twitter")} passHref>
                        <ActionIcon component='a' variant="filled" size={50} radius={"xl"} color="twitter" >
                            <IconBrandTwitter size={30} />
                        </ActionIcon>
                    </Link>
                    <Text>Twitter Details</Text>
                </Stack>

                <Stack align={"center"} spacing={"sm"}>
                    <Link href={toLink(router.asPath, "youtube")} passHref>
                        <ActionIcon component='a' variant="filled" size={50} radius={"xl"} color="youtube" >
                            <IconBrandYoutube size={30} />
                        </ActionIcon>
                    </Link>
                    <Text>Youtube Details</Text>
                </Stack>

            </Group>
        </Stack>
    )
}

export default SmHeaderSection