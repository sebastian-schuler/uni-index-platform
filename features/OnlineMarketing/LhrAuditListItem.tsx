import { Anchor, Box, Collapse, createStyles, Divider, Group, Progress, Table, Text, TypographyStylesProvider, UnstyledButton } from '@mantine/core';
import { IconChevronDown, IconCircle, IconSquare, IconTriangle } from '@tabler/icons-react';
import React, { ReactNode, useState } from 'react';
import MantineLink from '../../components/Link/MantineLink';
import { LHR_SCORE_BREAKPOINTS, LHR_SCORE_COLORS } from '../../lib/lighthouse/lhrUtil';
import Details from '../../lib/types/lighthouse/audit-details';
import { LhrAudit } from '../../lib/types/lighthouse/CustomLhrTypes';
import { getByteAsKb } from '../../lib/util/calcUtil';

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
    if (score === null)
        return LHR_SCORE_COLORS.informative;

    if (score >= LHR_SCORE_BREAKPOINTS.good)
        return LHR_SCORE_COLORS.good;

    if (score >= LHR_SCORE_BREAKPOINTS.average)
        return LHR_SCORE_COLORS.average;

    return LHR_SCORE_COLORS.poor;
}

const getIcon = (score: number | null) => {
    if (score === null || score >= LHR_SCORE_BREAKPOINTS.good)
        return <IconCircle color={getColor(score)} size={20} />;

    if (score >= LHR_SCORE_BREAKPOINTS.average)
        return <IconSquare color={LHR_SCORE_COLORS.average} size={20} />

    return <IconTriangle color={LHR_SCORE_COLORS.poor} size={20} />;
}

interface Props {
    audit: LhrAudit,
}

const LhrAuditListItem: React.FC<Props> = ({ audit }: Props) => {

    const { classes } = useStyles();
    const [opened, setOpened] = useState(false);

    // if (audit.details.type === 'opportunity' && audit.details.items.length > 0) {
    //     // console.log(audit.id)
    //     // console.log(audit.details.items[0]["node"]);
    // }

    // if (audit.id === "crawlable-anchors") {
    //     // console.log(audit.details);
    // }

    let detailsObject: JSX.Element | null = null;

    if (audit.details.type === 'opportunity' && audit.details.items.length > 0) {

        detailsObject = (
            <Table>
                <thead>
                    <tr>
                        {
                            audit.details.headings.map((heading, index) => (
                                <th key={index}>{heading.label.toString()}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        audit.details.items.map((item, index) => {

                            const tds: ReactNode[] = [];

                            // TODO - look at headings, valueType to determine how to display
                            // console.log(audit.title);
                            // console.log(audit.details);
                            // console.log(item);

                            // Generate the table underneath the audit description     
                            if (item["node"] !== undefined) {
                                // If items are of type "node", then we need to generate a table with the node's properties

                                const node = item["node"] as Details.NodeValue;
                                tds.push(
                                    <>
                                        <Text>{node?.selector}</Text>
                                        <Text color={'cyan'}>{node?.snippet}</Text>
                                    </>
                                );
                                tds.push(<MantineLink type='external' url={item.url} />);
                                tds.push(<>{item.wastedMs}</>);

                            } else {
                                // If items have no type
                                tds.push(<MantineLink type='external' url={item.url} />);
                                tds.push(<>{getByteAsKb(item.totalBytes || 0) + ' KiB'}</>);
                                tds.push(<>{getByteAsKb(item.wastedBytes || 0) + ' KiB'}</>);
                            }

                            return (
                                <tr key={index}>
                                    {
                                        tds.map((td, index) => (
                                            <td key={index}>{td}</td>
                                        ))
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        )
    } else if (audit.details.type === "table" && audit.details.items.length > 0) {

        detailsObject = (
            <Table>
                <thead>
                    <tr>
                        {
                            audit.details.headings.map((heading, index) => (
                                <th key={index}>{heading.text.toString()}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        audit.details.items.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {
                                        audit.details.type === "table" && audit.details.headings.map((heading, index) => {

                                            if (!heading.key) return null;
                                            let inner: JSX.Element | null = null;

                                            if (heading.itemType === "source-location") {
                                                const sourceLocation = item[heading.key] as any;

                                                if (sourceLocation) {
                                                    if (sourceLocation.type === "code") {
                                                        const code = sourceLocation as Details.CodeValue;
                                                        inner = <Text>{code.value.toString()}</Text>;
                                                    } else if (sourceLocation.type === "source-location") {
                                                        const source = sourceLocation as Details.SourceLocationValue;
                                                        inner = <Anchor href={source.url}>{source.url}</Anchor>;
                                                    }
                                                }

                                            } else if (heading.itemType === "node") {
                                                const node = item[heading.key] as unknown as Details.NodeValue;
                                                if (node) {
                                                    inner = (
                                                        <>
                                                            <Text>{node.nodeLabel}</Text>
                                                            <Text color={'cyan'}>{node.snippet}</Text>
                                                        </>
                                                    );
                                                }

                                            } else if (heading.itemType === "code") {
                                                inner = heading.key ? <Text>{item[heading.key]?.toString()}</Text> : null;

                                            } else if (heading.itemType === "timespanMs") {
                                                const timespanMs = item[heading.key] as number;
                                                inner = heading.key ? <Text>{timespanMs?.toFixed(2)}</Text> : null;

                                            } else if (heading.itemType === "link") {
                                                inner = heading.key ? <Text>{item[heading.key]?.toString()}</Text> : null;

                                            } else if (heading.itemType === "ms") {
                                                const timespanMs = item[heading.key] as number;
                                                inner = heading.key ? <Text>{timespanMs?.toFixed(2)} ms</Text> : null;

                                            } else if (heading.itemType === "url") {
                                                const url = item[heading.key] as string;
                                                inner = heading.key ? <Anchor href={url}>{url}</Anchor> : null;

                                            } else if (heading.itemType === "bytes") {
                                                const bytes = item[heading.key] as number;
                                                // TODO - convert bytes to KB
                                                inner = heading.key ? <Text>{bytes} bytes</Text> : null;

                                            } else if (heading.itemType === "text" || heading.itemType === "numeric") {
                                                inner = heading.key ? <Text>{item[heading.key]?.toString()}</Text> : null;

                                            } else if (heading.itemType === "multi") {
                                                console.log(item[heading.key]);
                                            }

                                            return (
                                                <td key={index}>
                                                    {inner}
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        )

    }

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
                <Box px={44} pb={"sm"}>

                    <TypographyStylesProvider >
                        <div dangerouslySetInnerHTML={{ __html: audit.description }} />
                    </TypographyStylesProvider>

                    {detailsObject}
                </Box>
            </Collapse>

            <Divider />
        </>
    )
}

export default LhrAuditListItem;