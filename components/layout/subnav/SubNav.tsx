import { Button, createStyles, Group, Stack, Tabs, Title } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo } from 'react';
import GenericPageHeader from '../../elements/GenericPageHeader';

const useStyles = createStyles((theme) => ({

    tabLabel: {
        fontSize: theme.fontSizes.lg,
    },

    root: {
        backgroundColor: theme.colors.light[0],
        paddingTop: theme.spacing.lg,
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
            {
                backButton !== undefined ? (
                    <Group sx={{ justifyContent: 'space-between' }}>
                        <GenericPageHeader title={title} description={""} />
                        <Link href={backButton.url}>
                            <Button component='a' radius={"md"} variant='outline'>{backButton.text}</Button>
                        </Link>
                    </Group>
                ) : <GenericPageHeader title={title} description={""} />
            }

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