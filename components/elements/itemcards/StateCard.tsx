import { Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { URL_LOCATION } from '../../../data/urlConstants'
import { DetailedState } from '../../../lib/types/DetailedDatabaseTypes'
import { getLocalizedName, toLink } from '../../../lib/util'
import Link from '../../mui/NextLinkMui'

type Props = {
    state: DetailedState
}

const StateCard: React.FC<Props> = props => {

    const { state } = props;
    const { lang } = useTranslation('common');

    const url = toLink(URL_LOCATION, state.Country.url, state.url);
    const cities = state.City.map(({ name }) => name).join(', ');

    return (
        <Card>
            <CardActionArea component={Link} href={url} title={""}>
                <CardContent sx={{ lineHeight: 1 }}>

                    <Typography variant="subtitle1" component="h3" color="primary.main" sx={{lineHeight: 1.1, marginBottom: 1}}>
                        {getLocalizedName({ lang: lang, state: state })}
                    </Typography>

                    <Stack direction={"row"} color="text.secondary">
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Total Cities: </Typography>
                        <Typography variant="body2">
                            {state._count.City}
                        </Typography>
                    </Stack>

                    <Stack direction={"column"} color="text.secondary">
                        <Typography variant="body2" sx={{ fontWeight: 500, lineBreak: "none" }}>Most popular: </Typography>
                        <Typography variant="body2">{cities}</Typography>
                    </Stack>

                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default StateCard