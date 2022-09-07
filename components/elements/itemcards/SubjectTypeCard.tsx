import { Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { URL_SUBJECT } from '../../../data/urlConstants'
import { DetailedSubjectType } from '../../../lib/types/DetailedDatabaseTypes'
import { getLocalizedName, toLink } from '../../../lib/util'
import Link from '../../mui/NextLinkMui'

type Props = {
    subjectType: DetailedSubjectType
}

const SubjectTypeCard: React.FC<Props> = props => {

    const { subjectType } = props;
    const { lang } = useTranslation('common');

    const url = toLink(URL_SUBJECT, subjectType.url);

    return (
        <Card>
            <CardActionArea component={Link} href={url} title={""}>
                <CardContent sx={{ lineHeight: 1 }}>

                    <Typography variant="subtitle1" component="h3" color="primary.main" sx={{ lineHeight: 1.1, marginBottom: 1 }}>
                        {getLocalizedName({ lang: lang, any: subjectType })}
                    </Typography>

                    <Stack direction={"row"} color="text.secondary">
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Total Subjects: </Typography>
                        <Typography variant="body2">
                             {subjectType.subjectCount}
                        </Typography>
                    </Stack>

                    <Stack direction={"column"} color="text.secondary">
                        <Typography variant="body2" sx={{ fontWeight: 500, lineBreak: "none" }}>Most popular: </Typography>
                        {/* <Typography variant="body2">{cities}</Typography> */}
                    </Stack>

                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default SubjectTypeCard