import { Anchor, DefaultMantineColor } from '@mantine/core'
import Link from 'next/link'

interface Props {
    url: string
    label: string
    type: "internal" | "external" | "scroll"
    color?: DefaultMantineColor
}

const MantineLink = ({ url, label, color, type }: Props) => {

    return (
        type === "external" && (
            <Anchor component="a" href={url} color={color ? color : "brandOrange.5"} target={"_blank"}>
                {label}
            </Anchor>
        ) ||
        type === "internal" && (
            <Link href={url} passHref>
                <Anchor component="a" color={color ? color : "brandOrange.5"}>
                    {label}
                </Anchor >
            </Link >
        ) || 
        type === "scroll" && (
            <Anchor component="a" href={url} color={color ? color : "brandOrange.5"}>
                {label}
            </Anchor>
        ) || <></>
    )
}

export default MantineLink