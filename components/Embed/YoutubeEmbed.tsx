import { createStyles } from '@mantine/core'
import React from 'react'

const useStyles = createStyles((theme) => ({
    reponsiveVideo: {
        overflow: 'hidden',
        paddingBottom: "56.25%",
        position: 'relative',
        height: 0,

        [`iframe`]: {
            left: 0,
            top: 0,
            height: "100%",
            width: "100%",
            position: "absolute",
            border: 0,
        },
    },
}));

type Props = {
    videoId: string
}

const YoutubeEmbed = ({ videoId }: Props) => {

    const { classes } = useStyles();

    return (
        <div className={classes.reponsiveVideo}>
            <iframe
                width="853"
                height="480"
                src={`https://www.youtube.com/embed/${videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
            />
        </div>
    )
}

export default YoutubeEmbed