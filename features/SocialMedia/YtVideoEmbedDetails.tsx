import React from 'react'
import { YoutubeScoredVideo } from '../../lib/types/social-media/YoutubeTypes';
import { Text, Group, SimpleGrid, Stack } from '@mantine/core';
import YoutubeEmbed from '../../components/Embed/YoutubeEmbed';
import useTranslation from 'next-translate/useTranslation';

type Props = {
    video: YoutubeScoredVideo
}

const YtVideoEmbedDetails = ({ video }: Props) => {

    const { t, lang } = useTranslation('institution')

    const description = video.description.split('\n').map((item, i) => <Text key={i} mb={'xs'}>{item}</Text>);
    const date = new Date(video.publishedAt);

    return (
        <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
                        <Stack>
                <Text weight={700} size="xl">{video.title}</Text>
                <div>{description}</div>
            </Stack>
            <Stack>
                <YoutubeEmbed videoId={video.id} />
                <Group>
                    <Text>
                        <Text component='span' weight={700} size="xl">{video.videoStatistics.viewCount} </Text>
                        Views
                    </Text>
                    <Text>
                        <Text component='span' weight={700} size="xl">{video.videoStatistics.likeCount} </Text>
                        Likes
                    </Text>
                    <Text>
                        <Text component='span' weight={700} size="xl">{video.videoStatistics.commentCount} </Text>
                        Comments
                    </Text>
                </Group>
                <Text>Uploaded on {date.toDateString()}</Text>
            </Stack>

        </SimpleGrid>
    )
}

export default YtVideoEmbedDetails