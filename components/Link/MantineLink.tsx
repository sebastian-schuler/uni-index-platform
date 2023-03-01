import { Anchor, AnchorProps } from '@mantine/core'
import Link from 'next/link'
import { ReactNode } from 'react'

type Props = {
    children?: ReactNode
    url: string
    type: "internal" | "external" | "scroll"
    title?: string
    props?: AnchorProps
}

const MantineLink: React.FC<Props> = ({ url, children, type, title, props }: Props) => {

    return (
        type === "external" && (
            <Anchor component="a" href={url} title={title} target={"_blank"} {...props}>
                {children}
            </Anchor>
        ) ||
        type === "internal" && (
            <Anchor component={Link} href={url} title={title} {...props}>
                {children}
            </Anchor >
        ) ||
        type === "scroll" && (
            <Anchor component="a" href={url} title={title} {...props}>
                {children}
            </Anchor>
        ) || <></>
    )
}

export default MantineLink