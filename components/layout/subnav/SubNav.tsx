import { Button, Divider, Grid, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { memo } from 'react';
import Link from '../../mui/NextLinkMui';

type Props = {
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

    const path = useRouter().asPath;

    return (
        <>
            {
                backButton !== undefined ? (
                    <Stack direction={'row'} sx={{ justifyContent: 'space-between' }}>
                        <Typography variant='h5' component={'h1'}>{title}</Typography>
                        <Button variant='outlined' LinkComponent={Link} href={backButton.url}>{backButton.text}</Button>
                    </Stack>
                ) : <Typography variant='h4' component={'h1'}>{title}</Typography>
            }

            <Stack direction={'row'} spacing={0} paddingBottom={2}>
                {
                    pageLinkData.map((page, i) => (
                        <Grid item key={i} sx={{ borderBottom: (page.url === path ? 2 : 0), borderColor: 'primary.main' }} >
                            <Button variant='text' LinkComponent={Link} href={page.url || '#'}>{page.name}</Button>
                        </Grid>
                    ))
                }
            </Stack>
        </>
    )
}

export default memo(SubNav)