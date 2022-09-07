import Link from 'next/link'
import React, { ReactNode } from 'react'

type Props = {
    href: string
    title: string
    children: ReactNode
}

const InternalLink: React.FC<Props> = props => {
    return (
        <>
            <Link href={props.href} passHref>
                <a
                    title={props.title}
                    className={`text-primary-accent hover:text-secondary-accent`} // TODO Might need to change this
                >
                    {props.children}
                </a>
            </Link>
        </>
    )
}

export default InternalLink