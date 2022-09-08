import { createStyles, Stack, Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import { memo } from 'react';
import GenericPageHeader from '../../elements/GenericPageHeader';

const useStyles = createStyles((theme) => ({

    tabLabel: {
        fontSize: theme.fontSizes.lg,
    },

    root: {
        backgroundColor: theme.colors.light[0],
        paddingTop: theme.spacing.xs,
    },
    
  }));

interface Props {
    title: string,
    pageLinkData: {
        name: string;
        url: string;
    }[],
    backButton?: {
        url: string,
        text: string,
    },
}

const SubNav = ({ title, pageLinkData, backButton }: Props) => {

    const { classes } = useStyles();
    const router = useRouter();
    const path = router.asPath;

    return (
        <Stack>
            {/* {
                backButton !== undefined ? (
                    <Stack direction={'row'} sx={{ justifyContent: 'space-between' }}>
                        <Typography variant='h5' component={'h1'}>{title}</Typography>
                        <Button variant='outlined' LinkComponent={Link} href={backButton.url}>{backButton.text}</Button>
                    </Stack>
                ) : <Typography variant='h4' component={'h1'}>{title}</Typography>
            } */}

            <GenericPageHeader title={title} description={""} />

            <Tabs
                classNames={classes}
                value={path}
                onTabChange={(value) => router.push(value as string)}
            >
                <Tabs.List>
                    {
                        pageLinkData.map((page, i) => (
                            <Tabs.Tab key={i} value={page.url}>{page.name}</Tabs.Tab>
                        ))
                    }
                </Tabs.List>
            </Tabs>
        </Stack>
    )
}

export default memo(SubNav)