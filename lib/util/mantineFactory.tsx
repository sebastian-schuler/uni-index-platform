import { Anchor } from "@mantine/core"

export const getGenericExternalLink = (url: string, label?:string) => {
    return <Anchor href={url} target={'_blank'}>{label || url}</Anchor>
}