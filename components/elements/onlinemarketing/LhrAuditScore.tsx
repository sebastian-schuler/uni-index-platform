import { Divider, Group, Stack, Text } from '@mantine/core';
import { IconCircle, IconSquare, IconTriangle } from '@tabler/icons';
import React from 'react';
import { getLhrScoreColor, LHR_SCORE_BREAKPOINTS, LHR_SCORE_COLORS } from '../../../lib/lighthouse/lhrUtil';

interface Props {
    title: string,
    displayedScore: string,
    score: number
}

const LhrAuditScore: React.FC<Props> = ({ title, displayedScore, score }: Props) => {

    const icon = (
        <>
            {
                score >= LHR_SCORE_BREAKPOINTS.good ? <IconCircle color={LHR_SCORE_COLORS.good} size={20} /> :
                    score >= LHR_SCORE_BREAKPOINTS.average ? <IconSquare color={LHR_SCORE_COLORS.average} size={20} /> :
                        <IconTriangle color={LHR_SCORE_COLORS.poor} size={20} />
            }
        </>
    )

    return (
        <>
            <Group spacing={"xs"} align={"flex-start"} py={"sm"}>
                {icon}
                <Stack spacing={0}>
                    <Text size="md" weight={500} color="gray.9">
                        {title}
                    </Text>
                    <Text size="lg" weight={600} color={getLhrScoreColor(score)}>
                        {displayedScore}
                    </Text>
                </Stack>
            </Group>
            <Divider />
        </>
    )
}

export default LhrAuditScore