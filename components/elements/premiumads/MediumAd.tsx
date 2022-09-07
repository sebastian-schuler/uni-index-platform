import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'
import Image from 'next/image'
import React, { memo } from 'react'
import { PATH_PLACEHOLDER_IMAGES } from '../../../data/urlConstants'
import { toLink } from '../../../lib/util'
import Link from '../../mui/NextLinkMui'

type Props = {
    url: string
    title: string
    headline: string
    subtext: string
    imgUrl: string

    disableLink?: boolean
}

const MediumAd: React.FC<Props> = props => {

    const { url, title, headline, subtext, imgUrl, disableLink } = props;

    return (
        <Card sx={{}}>
            <CardActionArea component={disableLink ? "div" : Link} href={disableLink ? "" : url} title={title}>
                <CardMedia sx={{ height: 140 }}>
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Image
                            src={imgUrl || toLink(PATH_PLACEHOLDER_IMAGES, "460x140.png")}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </CardMedia>
                <CardContent>
                    <Typography variant="subtitle1" component="h3" color="primary.main">
                        {headline}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default memo(MediumAd)