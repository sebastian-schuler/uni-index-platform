import { Box, Divider, Group, SimpleGrid, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import useTranslation from 'next-translate/useTranslation';
import MantineLink from '../../components/Link/MantineLink';
import OnlineMarketingCard from '../OnlineMarketing/OnlineMarketingCard';
import { LhrSimple } from '../../lib/types/lighthouse/CustomLhrTypes';
import ResponsiveContainer from '../../components/Container/ResponsiveContainer';

interface Props {
  simpleLhReports: LhrSimple[],
}

const OnlineMarketingSection = ({ simpleLhReports }: Props) => {

  const theme = useMantineTheme();
  const { t } = useTranslation('index');

  return (
    <Box sx={{ backgroundColor: theme.colors.brandOrange[5] }}>
      <ResponsiveContainer paddingY>

        <Group mb={"sm"} sx={{ justifyContent: "space-between", alignItems: "flex-end" }} noWrap>
          <Stack spacing={0}>
            <Title order={2} color={'white'}>{t('online-marketing.title')}</Title>
            <Text color={'white'}>{t('online-marketing.desc')}</Text>
          </Stack>
          <MantineLink url={"#"} color={'light.0'} type="internal">{t('online-marketing.label-all')}</MantineLink>
        </Group>

        <Divider color={'white'} sx={{ opacity: 0.7 }} />

        <SimpleGrid
          mt={'md'}
          spacing={"lg"}
          breakpoints={[
            { maxWidth: 'sm', cols: 1 },
            { minWidth: 'sm', cols: 1 },
            { minWidth: 'md', cols: 2 },
          ]}
        >
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