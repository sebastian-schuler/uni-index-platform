import { Anchor, createStyles } from '@mantine/core';
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

        '&:hover': {
            color: theme.colors.brandOrange[5],
            textDecoration: 'none',
        }
    },
}));

type Props = {
    text: string
    href: string
    title?: string
}

const CardTitle: React.FC<Props> = ({ text, href, title }: Props) => {

    const { classes } = useStyles();

    return (
        <Anchor className={classes.title} component={Link} href={href} title={title}>
            {text}
        </Anchor>
    )
}

export default CardTitle