import { Anchor, DefaultMantineColor } from '@mantine/core'
import Link from 'next/link'

interface Props {
    url: string
    label: string
    color?: DefaultMantineColor
}

const MantineLink = ({ url, label, color }: Props) => {

    return (
        <Link href={url} passHref>
            <Anchor component="a" color={color ? color : "brandOrange.5"}>
                {label}
            </Anchor>
        </Link>
    )
}

export default MantineLink