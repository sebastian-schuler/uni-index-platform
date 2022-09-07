import { Box, Card, CardContent, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Faq from '../../components/elements/support/Faq';

const Support = () => {

  return (
    <Box>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5">Frequently asked questions</Typography>
            <Faq />
          </Stack>
        </CardContent>
      </Card>

    </Box>
  )
}

export default Support