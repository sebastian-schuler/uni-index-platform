import { RingProgress, Stack, Text } from '@mantine/core'
import React from 'react'
import { getLhrScoreColor } from '../../../lib/util/lighthouseUtil'

interface Props {
    score: number,
    title: string,
    description: string,
}

const LhrRingProgress: React.FC<Props> = ({ score, title, description }: Props) => {
    return (
        <Stack spacing={0} align={"center"}> 
            <RingProgress
                thickness={12}
                sections={[{ value: score, color: getLhrScoreColor(score) }, { value: 100 - score, color: "gray" }]}
                label={
                    <Text color={getLhrScoreColor(score)} weight={700} align="center" size="xl">
                        {score}%
                    </Text>
                }
            />
            <Text size="lg" transform="uppercase" weight={700} align={"center"}>
                {title}
            </Text>
            <Text size={"sm"}>
                {description}
            </Text>
        </Stack>
    )
}

export default LhrRingProgress