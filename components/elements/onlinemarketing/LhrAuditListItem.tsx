import { createStyles, Divider, Group, Text } from '@mantine/core'
import { IconCheck, IconChevronDown, IconCircle, IconSquare, IconTriangle } from '@tabler/icons'
import React from 'react'
import { LhrAudit } from '../../../lib/types/lighthouse/CustomLhrTypes';
import { LHR_SCORE_BREAKPOINTS, LHR_SCORE_COLORS } from '../../../lib/util/lighthouseUtil'

const useStyles = createStyles((theme) => ({
    root: {
        cursor: 'pointer',

        transition: "all .1s ease-in-out",

        '&:hover': {
            backgroundColor: theme.colors.brandOrange[0],
        }
    },
}));


interface Props {
    audit: LhrAudit,
}

const LhrAuditListItem: React.FC<Props> = ({ audit }: Props) => {

    const { classes } = useStyles();

    const getColor = () => {
        if (audit.score === null) {
            return LHR_SCORE_COLORS.informative;
        }

        if (audit.score >= LHR_SCORE_BREAKPOINTS.good) {
            return LHR_SCORE_COLORS.good;
        }

        if (audit.score >= LHR_SCORE_BREAKPOINTS.average) {
            return LHR_SCORE_COLORS.average;
        }

        return LHR_SCORE_COLORS.poor;
    }

    const getIcon = () => {
        if (audit.score === null || audit.score >= LHR_SCORE_BREAKPOINTS.good) {
            return <IconCircle color={getColor()} size={20} />;
        }

        if (audit.score >= LHR_SCORE_BREAKPOINTS.average) {
            return <IconSquare color={LHR_SCORE_COLORS.average} size={20} />
        }

        return <IconTriangle color={LHR_SCORE_COLORS.poor} size={20} />;
    }

    return (
        <>
            <Group py={"xs"} px={"sm"} className={classes.root} position='apart'>
                <Group>
                    {getIcon()}
                    <Text>{audit.title}, {audit.type}, {audit.scoreDisplayMode}</Text>
                </Group>
                <IconChevronDown color={"gray"} size={20} />
            </Group>

            <Divider />
        </>
    )
}

export default LhrAuditListItem;