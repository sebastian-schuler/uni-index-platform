import { Box, Chip, Stack } from '@mui/material'
import React from 'react'

type Props = {

}

const SearchChips: React.FC<Props> = props => {


    return (
        <Stack
            display={'flex'}
            direction={'row'}
            flexWrap={'wrap'}
            justifyContent={'start'}
            paddingTop={2}
            spacing={1}
            sx={{
                listStyle: 'none',
            }}
        >
            <Chip
                label={'University'}
                variant="filled"
            />
            <Chip
                label={'Course'}
                variant="outlined"
            />
        </Stack>
    )
}

export default SearchChips