import { Box, Card, createStyles, Flex, Group, Image, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconBuilding, IconSchool } from '@tabler/icons-react'
import Link from 'next/link'
import React, { memo } from 'react'
import { PATH_PLACEHOLDER_IMAGES } from '../../lib/url-helper/urlConstants'
import { toLink } from '../../lib/util/util'

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
        height: "100%",
    },

    title: {
        display: 'block',
        marginTop: theme.spacing.md,
        marginBottom: `calc(${theme.spacing.xs} / 2)`,
    },

    section: {
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        padding: theme.spacing.md,
    },

    icon: {
        opacity: 0.75,
    }
}));

interface Props {
    link: string
    title: string
    subtext: string
    description: string
    imgUrl?: string
    colHeight: number
    adType: string
    disableLink?: boolean
}

const AdCardMedium: React.FC<Props> = ({ title, link, subtext, description, imgUrl, colHeight, adType, disableLink }: Props) => {

    const { classes, theme } = useStyles();

    const AdCard = (
        <Card component={"div"} withBorder radius="md" shadow="sm" p={0} className={classes.card} title={title} sx={{ height: colHeight }}>
            <Flex>

                <Box sx={{ width: "50%" }}>
                    <Image src={imgUrl || toLink(PATH_PLACEHOLDER_IMAGES, "460x140.png")} fit="cover" height={colHeight} alt={""} />
                </Box>

                <Box px={'md'} sx={{ flex: 1 }}>
                    <Card.Section className={classes.section}>
                        <Group position="apart" noWrap sx={{ alignItems: "start" }}>
                            <Stack spacing={theme.spacing.xs}>
                                <Text size="xl" color={theme.colors.brandGray[3]} weight={500} sx={{ lineHeight: 1 }}>
                                    {title}
                                </Text>
                                <Text sx={{ lineHeight: 1.2 }}>{subtext}</Text>
                            </Stack>
                            <ThemeIcon size={"lg"} radius="xl" className={classes.icon}>
                                {
                                    adType === "subject" ? <IconSchool size={24} /> : <IconBuilding size={22} />
                                }
                            </ThemeIcon>
                        </Group>
                    </Card.Section>

                    <Card.Section px={theme.spacing.md} py={theme.spacing.sm}>

                        <Text size="md" color="dimmed" lineClamp={3} sx={{ flex: 1, lineBreak: "normal", overflowWrap: "break-word", wordBreak: "break-word" }}>
                            {description}
                        </Text>

                    </Card.Section>
                </Box>

            </Flex>
        </Card>
    )

    if (disableLink) return AdCard;

    return (
        <Link href={link}>
            {AdCard}
        </Link>
    )
}

export default memo(AdCardMedium)