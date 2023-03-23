import { Anchor, createStyles, AnchorProps } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

const useStyles = createStyles((theme) => ({
    title: {
        fontSize: theme.fontSizes.lg,
        transition: 'all 0.1s ease-in-out',
        textDecoration: 'none',
        color: theme.colors.brandGray[3],
        fontWeight: 500,
        lineHeight: 1.5,
        wordBreak: 'break-word',
        hyphens: 'auto',

        '&:hover': {
            color: theme.colors.brandOrange[5],
        }
    },
}));

type Props = {
    text: string | JSX.Element
    href: string
    title?: string
    props?: AnchorProps
    lang? : string
}

const CardTitle: React.FC<Props> = ({ text, href, title, props, lang }: Props) => {

    const { classes } = useStyles();

    return (
        <Anchor lang={lang} className={classes.title} component={Link} href={href} title={title} {...props}>
            {text}
        </Anchor>
    )
}

export default CardTitle