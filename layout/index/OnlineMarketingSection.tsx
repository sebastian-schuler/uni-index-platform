import { Card, CardSection, createStyles, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import Link from 'next/link';
import React from 'react'
import LhrRingProgress from '../../components/elements/onlinemarketing/LhrRingProgress';
import { LhrSimple } from '../../lib/types/lighthouse/CustomLhrTypes'
import ResponsiveContainer from '../ResponsiveContainer';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
    transition: "all .2s ease-in-out",
    height: "100%",

    '&:hover': {
      transform: "scale(1.05)",
    }
  },

  section: {
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },

}));

interface Props {
  simpleLhReports: LhrSimple[],
}

const OnlineMarketingSection = ({ simpleLhReports }: Props) => {

  const { classes, theme } = useStyles();

  return (
    <ResponsiveContainer paddingY>

      <Stack spacing={0}>
        <Title order={2}>
          Online Marketing
        </Title>
        <Text>We analysed every institutions website.</Text>
      </Stack>

      <SimpleGrid cols={2} spacing={"lg"}>
        {
          simpleLhReports.map((report, i) => (
            <Link key={report.institution.id} href={report.institution.slug} passHref>
              <Card component='a' withBorder radius="md" p="md" shadow={"sm"} className={classes.card}>

                <CardSection className={classes.section}>
                  <Text size={"xl"}>{report.institution.name}</Text>
                  <Text>{report.institution.website}</Text>
                </CardSection>

                <LhrRingProgress
                  size='sm'
                  title={"Performance"}
                  score={report.performanceScore * 100}
                />

              </Card>
            </Link>
          ))
        }
      </SimpleGrid>

    </ResponsiveContainer>
  )
}

export default OnlineMarketingSection