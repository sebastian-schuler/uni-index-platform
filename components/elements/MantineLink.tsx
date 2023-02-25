import { Anchor, DefaultMantineColor } from '@mantine/core'
import Link from 'next/link'
import { ReactNode } from 'react'

interface Props {
    children?: ReactNode
    url: string
    type: "internal" | "external" | "scroll"
    color?: DefaultMantineColor
    title?: string
}

const MantineLink: React.FC<Props> = ({ url, children, color, type, title }: Props) => {

    return (
        type === "external" && (
            <Anchor component="a" href={url} title={title} color={color ? color : "brandOrange.5"} target={"_blank"}>
                {children}
            </Anchor>
        ) ||
        type === "internal" && (
            <Anchor component={Link} href={url} title={title} color={color ? color : "brandOrange.5"}>
                {children}
            </Anchor >
        ) ||
        type === "scroll" && (
            <Anchor component="a" href={url} title={title} color={color ? color : "brandOrange.5"}>
                {children}
            </Anchor>
        ) || <></>
    )
}

export default MantineLink