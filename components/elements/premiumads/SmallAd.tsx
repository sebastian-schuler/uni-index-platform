import { Card, CardActionArea, CardContent, Typography } from '@mui/material'
import React, { memo } from 'react'
import Link from '../../mui/NextLinkMui'

type Props = {
    url: string
    title: string
    headline: string
    subtext: string

    disableLink?: boolean
}
const SmallAd: React.FC<Props> = props => {

    const { url, title, headline, subtext, disableLink } = props

    return (
        <Card sx={{}}>
            <CardActionArea component={disableLink ? "div" : Link} href={disableLink ? "" : url} title={title}>
                <CardContent>
                    <Typography gutterBottom variant="subtitle1" component="h3" color="primary.main">
                        {headline}
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ opacity: 0.7 }}>
                        {subtext}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default memo(SmallAd)