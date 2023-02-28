import { Divider, Title } from '@mantine/core'
import { LhrAudit, LhrMinified } from '../../lib/types/lighthouse/CustomLhrTypes'
import LhrAuditListItem from './LhrAuditListItem'

interface Props {
    title: string
    refs: string[]
    auditList: LhrAudit[]
}

const LhrAuditList = ({ title, refs, auditList }: Props) => {

    const audits = auditList.filter(audit => refs.includes(audit.id));
    if(audits.length === 0) return null;

    audits.sort((a, b) => {
        // Score = null is informative
        // Order is: Error, Warning, Informative, Passed
        if (a.score === null && b.score && b.score >= 0.9) {
            return -1;
        }
        if (a.score === null) {
            return 1;
        }
        if (b.score === null) {
            return -1;
        }
        return a.score - b.score;
    });

    return (
        <>
            <Title order={4} mt={"lg"} pb={"sm"}>{title}</Title>
            <Divider />
            {
                audits.map((audit, i) => (
                    <LhrAuditListItem key={audit.id+i} audit={audit} />
                ))
            }
        </>
    )
}

export default LhrAuditList