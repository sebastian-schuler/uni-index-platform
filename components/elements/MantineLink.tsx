import { Anchor, DefaultMantineColor } from '@mantine/core'
import Link from 'next/link'

interface Props {
    url: string
    label: string
    color?: DefaultMantineColor
    external?: boolean
}

const MantineLink = ({ url, label, color, external }: Props) => {

    return (

        external ? (
            <Anchor component="a" href={url} color={color ? color : "brandOrange.5"} target={"_blank"}>
                {label}
            </Anchor>
        ) :
            <Link href={url} passHref>
                <Anchor component="a" color={color ? color : "brandOrange.5"}>
                    {label}
                </Anchor >
            </Link >
    )
}

export default MantineLink