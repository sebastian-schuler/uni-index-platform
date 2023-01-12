import { Group, RingProgress, Stack, Text, Title } from '@mantine/core'
import React from 'react'
import { getLhrScoreColor } from '../../../lib/lighthouse/lhrUtil'

interface Props {
    score: number,
    title: string,
    description?: string,
    size: "lg" | "md" | "sm"
}

const LhrRingProgress: React.FC<Props> = ({ score, title, description, size }: Props) => {

    if (size === "lg") {
        return (
            <Group spacing={0} noWrap ml={-12}>
                <RingProgress
                    size={120}
                    thickness={12}
                    sections={[{ value: score, color: getLhrScoreColor(score) }, { value: 100 - score, color: "#525252" }]}
                    label={
                        <Text color={getLhrScoreColor(score)} weight={700} align="center" size={"xl"}>
                            {score}%
                        </Text>
                    }
                />
                <Stack spacing={0}>
                    <Title order={2}>{title}</Title>
                    <Text size={"sm"}>
                        {description}
                    </Text>
                </Stack>
            </Group>
        )

    } else if (size === "md") {
        return (
            <Stack spacing={0} align={"center"}>
                <RingProgress
                    size={120}
                    thickness={12}
                    sections={[{ value: score, color: getLhrScoreColor(score) }, { value: 100 - score, color: "#525252" }]}
                    label={
                        <Text color={getLhrScoreColor(score)} weight={700} align="center" size={"xl"}>
                            {score}%
                        </Text>
                    }
                />
                <Title order={3}>{title}</Title>
                <Text size={"sm"}>
                    {description}
                </Text>
            </Stack>
        )

    } else {
        return (
            <Group spacing={"sm"} noWrap>
                <RingProgress
                    size={50}
                    thickness={5}
                    sections={[{ value: score, color: getLhrScoreColor(score) }, { value: 100 - score, color: "#525252" }]}
                    label={
                        <Text color={getLhrScoreColor(score)} weight={700} align="center" size={"sm"}>
                            {score}%
                        </Text>
                    }
                />
                <Text size="lg" align={"center"}>
                    {title}
                </Text>
            </Group>
        )
    }
}

export default LhrRingProgress