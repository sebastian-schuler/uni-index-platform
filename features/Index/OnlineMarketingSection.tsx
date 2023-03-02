import { Box, createStyles, Divider, Grid, SimpleGrid, Text, Title } from '@mantine/core';
import useTranslation from 'next-translate/useTranslation';
import OnlineMarketingCard from '../../components/Card/OnlineMarketingCard';
import ResponsiveContainer from '../../components/Container/ResponsiveContainer';
import MantineLink from '../../components/Link/MantineLink';
import { LhrSimple } from '../../lib/types/lighthouse/CustomLhrTypes';

const useStyles = createStyles((theme) => ({

  labelBack: {
    fontWeight: 500,
    color: 'white',
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      alignSelf: 'flex-end',
      textAlign: 'end',
    },
  },

}));

interface Props {
  simpleLhReports: LhrSimple[],
}

const OnlineMarketingSection = ({ simpleLhReports }: Props) => {

  const { classes, theme } = useStyles();
  const { t } = useTranslation('index');

  return (
    <Box sx={{ backgroundColor: theme.colors.brandOrange[5] }}>
      <ResponsiveContainer paddingY>

        <Title order={2} color={'white'}>{t('online-marketing.title')}</Title>
        <Grid pb={'sm'}>
          <Grid.Col md={8} sm={12}>
            <Text color={'white'}>{t('online-marketing.desc')}</Text>
          </Grid.Col>

          <Grid.Col md={4} sm={12} className={classes.labelBack}>
            <MantineLink url={"#"} props={{ color: 'white' }} type="internal">{t('online-marketing.label-all')}</MantineLink>
          </Grid.Col>
        </Grid>

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