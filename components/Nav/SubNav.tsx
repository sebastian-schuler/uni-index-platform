import { Button, Group, Stack, Tabs, TabsProps } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo } from 'react';
import GenericPageHeader from '../Block/GenericPageHeader';

function StyledTabs(props: TabsProps) {
    return (
        <Tabs
            unstyled
            styles={(theme) => ({
                tab: {
                    ...theme.fn.focusStyles(),
                    backgroundColor: 'inherit',
                    color: theme.colors.light[0],
                    border: 'none',
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                    cursor: 'pointer',
                    fontSize: theme.fontSizes.lg,
                    alignItems: 'center',
                    justifyContent: 'center',

                    '&:hover': {
                        backgroundColor: theme.fn.lighten('inherit', 0.1),
                    },

                    '&:disabled': {
                        opacity: 0.5,
                        cursor: 'not-allowed',
                    },

                    '&[data-active]': {
                        backgroundColor: theme.colors.brandOrange[5],
                        borderColor: theme.colors.brandOrange[5],
                        color: theme.white,

                        '&:hover': {
                            backgroundColor: theme.fn.lighten(theme.colors.brandOrange[5], 0.3),
                        },

                    },
                },
                tabIcon: {
                    marginRight: theme.spacing.xs,
                    display: 'flex',
                    alignItems: 'center',
                },
                tabsList: {
                    display: 'grid',

                    [`@media (min-width: ${theme.breakpoints.sm})`]: {
                        gridTemplateColumns: '50% 50%',
                    },
                    [`@media (min-width: ${theme.breakpoints.md})`]: {
                        gridTemplateColumns: 'none',
                        gridAutoFlow: 'column',
                        gridAutoColumns: '1fr',
                    },
                },
                tabLabel: {
                    whiteSpace: 'nowrap',
                },
                root: {
                    backgroundColor: theme.colors.brandGray[4],
                }
            })}
            {...props}
        />
    );
}

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

    const router = useRouter();
    const path = router.asPath;

    return (
        <Stack mb={'xl'}>
            {
                backButton !== undefined ? (
                    <Group sx={{ justifyContent: 'space-between' }}>
                        <GenericPageHeader title={title} description={""} />
                        <Button component={Link} href={backButton.url} radius={"md"} variant='outline'>{backButton.text}</Button>
                    </Group>
                ) : <GenericPageHeader title={title} description={""} />
            }
            <StyledTabs
                value={path}
                onTabChange={(value) => router.push(value as string)}
            >
                <Tabs.List grow sx={{ flexWrap: 'wrap' }}>
                    {
                        pageLinkData.map((page, i) => (
                            <Tabs.Tab key={i} value={page.url} >
                                <Link href={page.url}>
                                    {page.name}
                                </Link>
                            </Tabs.Tab>
                        ))
                    }
                </Tabs.List>
            </StyledTabs>
        </Stack>
    )
}

export default memo(SubNav)