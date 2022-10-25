import { Box, Collapse, createStyles, Divider, Group, Progress, Text, UnstyledButton } from '@mantine/core'
import { IconCheck, IconChevronDown, IconCircle, IconSquare, IconTriangle } from '@tabler/icons'
import React, { useState } from 'react'
import { LhrAudit } from '../../../lib/types/lighthouse/CustomLhrTypes';
import { LHR_SCORE_BREAKPOINTS, LHR_SCORE_COLORS } from '../../../lib/util/lighthouseUtil'
import MantineLink from '../MantineLink';

const useStyles = createStyles((theme) => ({
    root: {
        cursor: 'pointer',
        width: '100%',
        transition: "all .1s ease-in-out",

        '&:hover': {
            backgroundColor: theme.colors.brandOrange[0],
        }
    }
}));

const getColor = (score: number | null) => {
    if (score === null) {
        return LHR_SCORE_COLORS.informative;
    }

    if (score >= LHR_SCORE_BREAKPOINTS.good) {
        return LHR_SCORE_COLORS.good;
    }

    if (score >= LHR_SCORE_BREAKPOINTS.average) {
        return LHR_SCORE_COLORS.average;
    }

    return LHR_SCORE_COLORS.poor;
}

const getIcon = (score: number | null) => {
    if (score === null || score >= LHR_SCORE_BREAKPOINTS.good) {
        return <IconCircle color={getColor(score)} size={20} />;
    }

    if (score >= LHR_SCORE_BREAKPOINTS.average) {
        return <IconSquare color={LHR_SCORE_COLORS.average} size={20} />
    }

    return <IconTriangle color={LHR_SCORE_COLORS.poor} size={20} />;
}

type TextPart = { type: 'text', text: string } | { type: 'link', text: string, url: string };

/**
 * Parses a Lighthouse text containing links to an array 
 * e.g.: [Link text](Link url) 
 * @param text 
 */
const parseText = (text: string): TextPart[] => {
    const links = text.match(/\[[^()]*\](\(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)\))/g);

    if (links === null) return [{ type: 'text', text: text }];
    const result: TextPart[] = [];
    let lastIndex = 0;

    for (const link of links) {
        const index = text.indexOf(link);

        if (index > lastIndex) {
            result.push({ type: 'text', text: text.substring(lastIndex, index) });
            lastIndex = index;
        }
        const linkText = link.substring(link.indexOf('[') + 1, link.indexOf(']'));
        const linkUrl = link.substring(link.indexOf('(') + 1, link.indexOf(')'));
        result.push({ type: 'link', text: linkText, url: linkUrl });
        lastIndex += link.length;
    }
    return result;
}

interface Props {
    audit: LhrAudit,
}

const LhrAuditListItem: React.FC<Props> = ({ audit }: Props) => {

    const { classes } = useStyles();
    const [opened, setOpened] = useState(true);
    const description = parseText(audit.description);

    return (
        <>
            <UnstyledButton py={"xs"} px={"sm"} className={classes.root} onClick={() => setOpened((o) => !o)}>
                <Group position='apart' >
                    <Group>
                        {getIcon(audit.score)}
                        <Group spacing={"xs"}>
                            <Text>{audit.title}</Text>
                            {
                                audit.displayValue && <Text weight={600} color={getColor(audit.score)}>- {audit.displayValue}</Text>
                            }
                        </Group>
                    </Group>
                    <Group>
                        {
                            audit.details.type === "opportunity" && !audit.passed && (
                                <>
                                    <Box sx={{ width: 200, transform: "scaleX(-1)" }}>
                                        <Progress
                                            size="lg"
                                            sections={[
                                                { value: ((audit.details.overallSavingsMs || 0) / 2000) * 100, color: 'orange' },
                                            ]}
                                        />
                                    </Box>
                                    <Text weight={600} color={getColor(audit.score)}>{((audit.details.overallSavingsMs || 0) / 1000).toFixed(2)}s</Text>
                                </>
                            )
                        }
                        <IconChevronDown color={"gray"} size={20} />
                    </Group>
                </Group>
            </UnstyledButton>

            <Collapse in={opened}>
                {/* 20px (icon) + 16px (group gap) + 8px (padding button) */}
                <Box px={44} pb={"sm"}>
                    <Text size={"sm"}>
                        {
                            description.map((part, index) => (
                                part.type === 'text' ? part.text : <MantineLink key={index} label={part.text} url={part.url} type={"external"} />
                            ))
                        }
                    </Text>
                    {
                        audit.details.type === "opportunity" && !audit.passed && (
                            <>
                                {
                                    audit.details.headings.map((heading, index) => (
                                        heading.label
                                    ))
                                }
                            </>
                        )
                    }
                </Box>
            </Collapse>

            <Divider />
        </>
    )
}

export default LhrAuditListItem;