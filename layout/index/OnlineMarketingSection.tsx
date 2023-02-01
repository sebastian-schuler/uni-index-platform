import { Box, Divider, Group, SimpleGrid, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import MantineLink from '../../components/elements/MantineLink';
import OnlineMarketingCard from '../../components/elements/onlinemarketing/OnlineMarketingCard';
import { LhrSimple } from '../../lib/types/lighthouse/CustomLhrTypes';
import ResponsiveContainer from '../ResponsiveContainer';

interface Props {
  simpleLhReports: LhrSimple[],
}

const OnlineMarketingSection = ({ simpleLhReports }: Props) => {

  const theme = useMantineTheme();

  return (
    <Box sx={{ backgroundColor: theme.colors.brandOrange[5] }}>
      <ResponsiveContainer paddingY>

        <Group mb={"sm"} sx={{ justifyContent: "space-between", alignItems: "flex-end" }}>
          <Stack spacing={0}>
            <Title order={2} color={'white'}>Online Marketing</Title>
            <Text color={'white'}>We analysed every institutions website.</Text>
          </Stack>
          <MantineLink label={"See all online marketing analyses"} url={"#"} color={'light.0'} type="internal" />
        </Group>

        <Divider color={'white'} sx={{ opacity: 0.7 }} />

        <SimpleGrid mt={'md'} cols={2} spacing={"lg"}>
          {
            simpleLhReports.map((report, i) => (
              <OnlineMarketingCard key={report.institution.id} report={report} />
            ))
          }
        </SimpleGrid>

      </ResponsiveContainer>
    </Box>

  )
}

export default OnlineMarketingSection