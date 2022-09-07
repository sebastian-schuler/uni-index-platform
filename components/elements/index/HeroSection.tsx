import React, { useState } from 'react'
import { createStyles, Container, Title, Text, Button, Anchor, Space } from '@mantine/core';
import GlobalSearch from '../../partials/GlobalSearch';
import ResponsiveContainer from '../../layout/ResponsiveContainer';
import LanguageModal from '../../layout/nav/LanguageModal';

const useStyles = createStyles((theme) => ({
    root: {
        backgroundColor: theme.colors.brandGray[5],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage:
            'linear-gradient(250deg, rgba(130, 201, 30, 0) 0%, ' + theme.colors.brandGray[5] + ' 70%), url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80)',
        paddingTop: theme.spacing.xl * 3,
        paddingBottom: theme.spacing.xl * 3,
    },

    inner: {
        display: 'flex',
        justifyContent: 'space-between',

        [theme.fn.smallerThan('md')]: {
            flexDirection: 'column',
        },
    },

    image: {
        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },
    },

    content: {
        paddingTop: theme.spacing.xl * 2,
        paddingBottom: theme.spacing.xl * 2,
        marginRight: theme.spacing.xl * 3,

        [theme.fn.smallerThan('md')]: {
            marginRight: 0,
        },
    },

    title: {
        color: theme.white,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 900,
        lineHeight: 1.05,
        maxWidth: 500,
        fontSize: 48,

        [theme.fn.smallerThan('md')]: {
            maxWidth: '100%',
            fontSize: 34,
            lineHeight: 1.15,
        },
    },

    description: {
        color: theme.white,
        opacity: 0.75,
        maxWidth: 500,

        [theme.fn.smallerThan('md')]: {
            maxWidth: '100%',
        },
    },

    control: {
        paddingLeft: 50,
        paddingRight: 50,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontSize: 22,

        [theme.fn.smallerThan('md')]: {
            width: '100%',
        },
    },

    changeLanguage: {
        fontSize: 14,
        color: theme.white,
        opacity: 0.55,
    }
}));

const HeroSection = () => {

    const [languageModalOpen, setLanguageModalOpen] = useState(false);
    const { classes } = useStyles();

    return (

        <>
            <div className={classes.root}>
                <ResponsiveContainer>
                    <div className={classes.inner}>
                        <div className={classes.content}>
                            <Title order={1} className={classes.title}>
                                The{' '}
                                <Text
                                    component="span"
                                    inherit
                                    variant="gradient"
                                    gradient={{ from: 'pink', to: 'yellow' }}
                                >
                                    easiest
                                </Text>{' '}
                                way to find the perfect uni course
                            </Title>

                            <Text className={classes.description} mt={30} mb={30}>
                                Search by subject, university, or course name to find university courses from over 1000 universities and colleges around all of Europe.
                                Check out their social media presence or read reviews from other students to help you decide which course is right for you.
                            </Text>

                            <GlobalSearch />

                            <Space h={"xl"}/>

                            <Anchor
                                component='a'
                                onClick={() => setLanguageModalOpen(true)}
                                className={classes.changeLanguage}
                                pt={30}
                            >
                                Change language...
                            </Anchor>

                        </div>
                    </div>
                </ResponsiveContainer>
            </div>

            <LanguageModal opened={languageModalOpen} setOpened={setLanguageModalOpen} />
        </>
    );
}

export default HeroSection