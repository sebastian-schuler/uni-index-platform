import { ActionIcon, Anchor, createStyles, Group, Text, ThemeIcon } from '@mantine/core'
import { IconBrandFacebook, IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from '@tabler/icons'
import React from 'react'

const useStyles = createStyles((theme) => ({

    groupContainer: {

        // Media query with value from theme
        [`@media (max-width: ${theme.breakpoints.md}px)`]: {
            gap: theme.spacing.sm,
        },

    },

    iconFacebook: {
        color: theme.colors.gray[6],
        transition: "all .2s ease-in-out",
        '&:hover': {
            color: theme.colors.blue[9],
        }
    },

    iconInstagram: {
        color: theme.colors.gray[6],
        transition: "all .2s ease-in-out",
        '&:hover': {
            color: theme.colors.pink[5],
        }
    },

    iconTwitter: {
        color: theme.colors.gray[6],
        transition: "all .2s ease-in-out",
        '&:hover': {
            color: theme.colors.blue[5],
        }
    },

    iconYoutube: {
        color: theme.colors.gray[6],
        transition: "all .2s ease-in-out",
        '&:hover': {
            color: theme.colors.red[5],
        }
    },

}));

interface Props {
    url: string
    label?: boolean | string
    type: 'facebook' | 'twitter' | 'instagram' | 'youtube'
    size?: number
    iconSize?: number
    title?: string
    gray?: boolean
}

const SmIconLink: React.FC<Props> = ({ type, url, label, size, iconSize, title, gray }: Props) => {

    const { classes, theme } = useStyles();

    const getIcon = () => {

        if (label === undefined) {

            switch (type) {
                case 'facebook':
                    return (
                        <ActionIcon variant='subtle' component="a" href={url} target={"_blank"}
                            className={classes.iconFacebook} title={title} color={gray ? undefined : "blue.9"}
                            size={size || 24} radius="xl"
                        >
                            <IconBrandFacebook size={iconSize || 18} />
                        </ActionIcon>
                    )
                case 'twitter':
                    return (
                        <ActionIcon variant='subtle' component="a" href={url} target={"_blank"}
                            className={classes.iconTwitter} title={title} color={gray ? undefined : "blue"}
                            size={size || 24} radius="xl"
                        >
                            <IconBrandTwitter size={iconSize || 18} />
                        </ActionIcon>
                    )
                case 'instagram':
                    return (
                        <ActionIcon variant='subtle' component="a" href={url} target={"_blank"}
                            className={classes.iconInstagram} title={title} color={gray ? undefined : "pink"}
                            size={size || 24} radius="xl"
                        >
                            <IconBrandInstagram size={iconSize || 18} />
                        </ActionIcon>
                    )
                case 'youtube':
                    return (
                        <ActionIcon variant='subtle' component="a" href={url} target={"_blank"}
                            className={classes.iconYoutube} title={title} color={gray ? undefined : "red"}
                            size={size || 24} radius="xl"
                        >
                            <IconBrandYoutube size={iconSize || 18} />
                        </ActionIcon>
                    )
                default:
                    return <></>
            }

        } else {

            switch (type) {
                case 'facebook':
                    return (
                        <ThemeIcon color={"darkblue"} size={size || 24} radius="xl">
                            <IconBrandFacebook size={iconSize || 18} />
                        </ThemeIcon>
                    )
                case 'twitter':
                    return (
                        <ThemeIcon color={"blue"} size={size || 24} radius="xl">
                            <IconBrandTwitter size={iconSize || 18} />
                        </ThemeIcon>
                    )
                case 'instagram':
                    return (
                        <ThemeIcon color={"pink"} size={size || 24} radius="xl">
                            <IconBrandInstagram size={iconSize || 18} />
                        </ThemeIcon>
                    )
                case 'youtube':
                    return (
                        <ThemeIcon color={"red"} size={size || 24} radius="xl">
                            <IconBrandYoutube size={iconSize || 18} />
                        </ThemeIcon>
                    )
                default:
                    return <></>
            }

        }


    }

    if (label === undefined) {
        return getIcon();

    } else {

        return (
            <Anchor component="a" href={url} color={"brandOrange.5"} target={"_blank"} title={title}>
                <Group noWrap className={classes.groupContainer}>
                    {
                        getIcon()
                    }
                    <Text sx={{ overflow: "clip" }}>{label === true ? shortenLink(url) : label.toString()}</Text>
                </Group>
            </Anchor>
        )
    }

}

const shortenLink = (link: string) => {
    link = link.replace(/((http)?s?:\/\/)(www.)?/i, "");
    return link;
}

export default SmIconLink