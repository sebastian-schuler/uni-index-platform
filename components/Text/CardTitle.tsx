import { Anchor, createStyles, AnchorProps } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

const useStyles = createStyles((theme) => ({
    title: {
        fontSize: theme.fontSizes.xl,
        transition: 'all 0.1s ease-in-out',
        textDecoration: 'none',
        color: theme.colors.brandGray[3],
        fontWeight: 500,
        lineHeight: 1,
        wordBreak: 'break-word',

        '&:hover': {
            // color: theme.fn.lighten(theme.colors.brandOrange[5], 0.25),
            color: theme.colors.brandOrange[5],
            // textDecoration: 'none',
        }
    },
}));

type Props = {
    text: string | JSX.Element
    href: string
    title?: string
    props?: AnchorProps
}

const CardTitle: React.FC<Props> = ({ text, href, title, props }: Props) => {

    const { classes } = useStyles();

    return (
        <Anchor className={classes.title} component={Link} href={href} title={title} {...props}>
            {text}
        </Anchor>
    )
}

export default CardTitle