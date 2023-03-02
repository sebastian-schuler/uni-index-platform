import { Button, createStyles, Text, Title } from '@mantine/core';
import ResponsiveContainer from '../../components/Container/ResponsiveContainer';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';

const useStyles = createStyles((theme) => ({
    root: {
        backgroundColor: theme.colors.brandGray[5],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage:
            'linear-gradient(250deg, rgba(130, 201, 30, 0) 0%, ' + theme.colors.brandGray[5] + ' 70%), url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80)',
        paddingTop: `calc(${theme.spacing.xl} * 2)`,
        paddingBottom: `calc(${theme.spacing.xl} * 2)`,
    },
    inner: {
        display: 'flex',
        justifyContent: 'space-between',

        [theme.fn.smallerThan('md')]: {
            flexDirection: 'column',
        },
    },
    content: {
        marginRight: `calc(${theme.spacing.xl} * 3)`,

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
        fontSize: 18,

        [theme.fn.smallerThan('md')]: {
            maxWidth: '100%',
        },
    },
}));

const HeroSection = () => {

    const { classes } = useStyles();
    const { t } = useTranslation("index");

    return (
        <div className={classes.root}>
            <ResponsiveContainer>
                <div className={classes.inner}>
                    <div className={classes.content}>

                        <Title order={1} className={classes.title}>
                            <Trans
                                i18nKey="index:hero.title"
                                components={[
                                    <Text
                                        component="span"
                                        inherit
                                        variant="gradient"
                                        gradient={{ from: 'pink', to: 'yellow' }}
                                    />
                                ]}
                            />
                        </Title>

                        <Text className={classes.description} mt={30} mb={30}>{t('hero.desc')}</Text>

                        <Button component='a' href='#socialMediaSection' size='md' px={'lg'}>{t('hero.label-button')}</Button>

                    </div>
                </div>
            </ResponsiveContainer>
        </div>
    );
}

export default HeroSection