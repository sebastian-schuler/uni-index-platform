import React, { memo } from 'react'
import { Box, Title, Text } from '@mantine/core';

type Props = {
    title: string
    description: string
}

const GenericPageHeader: React.FC<Props> = props => {

    const { title, description } = props;

    return (
        <Box mb={'xs'}>
            <Title order={1}>
                {title}
            </Title>
            <Text>
                {description}
            </Text>
        </Box>
    )
}

export default memo(GenericPageHeader);