import { Anchor, Card, createStyles, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { Country, State } from '@prisma/client'
import { IconBuilding, IconCategory, IconSchool } from '@tabler/icons-react'
import Flags from 'country-flag-icons/react/3x2'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React, { memo } from 'react'
import SmIconLink from '../../features/SocialMedia/SmIconLink'
import { InstitutionCardData } from '../../lib/types/UiHelperTypes'
import { URL_INSTITUTION, URL_LOCATION } from '../../lib/url-helper/urlConstants'
import { getLocalizedName, toLink } from '../../lib/util/util'

const useStyles = createStyles((theme) => ({

  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.light[0],
    height: "100%",
  },

  section: {
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    paddingTop: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingLeft: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },

  flag: {
    width: "2rem",
    opacity: 0.75,
  }

}));

type Props = {
  data: InstitutionCardData
  country: Country | undefined
  state: State | undefined
}

const InstitutionCard: React.FC<Props> = ({ data, country, state }: Props) => {

  const { classes, theme } = useStyles();
  const { t, lang } = useTranslation('common');

  const youtubeLink = data.InstitutionSocialMedia?.youtube_url;
  const facebookLink = data.InstitutionSocialMedia?.facebook_url;
  const twitterLink = data.InstitutionSocialMedia?.twitter_url;
  const instagramLink = data.InstitutionSocialMedia?.instagram_url;

  const countryUrl = country?.url;
  const stateUrl = state?.url;
  const urlInstitution = countryUrl ? toLink(URL_INSTITUTION, countryUrl, data.Institution.url) : "#";
  const urlCity = countryUrl && stateUrl ? toLink(URL_LOCATION, countryUrl, stateUrl, data.Institution.City.url) : '#';
  const urlState = countryUrl && stateUrl ? toLink(URL_LOCATION, countryUrl, stateUrl) : '#';

  const Flag = Flags[country?.country_code || ""] || Flags["EU"];

  return (
    <Card withBorder radius="md" p="md" shadow={"sm"} className={classes.card}>

      <Card.Section className={classes.section}>
        <Group position="apart" noWrap sx={{ alignItems: "start" }} spacing="sm">

          <Stack spacing={theme.spacing.xs}>

            {/* Name & Name in brackets */}
            <Anchor component={Link} href={urlInstitution}>
              <Text size="lg" color={theme.colors.brandGray[3]} weight={500} sx={{ lineHeight: 1 }}>
                {data.Institution.name} <Text size={"xs"}>{data.Institution.nameBrackets}</Text>
              </Text>
            </Anchor>

            {/* City & State */}
            <Text color={theme.colors.brandGray[2]} sx={{ lineHeight: 1.2 }}>
              <Anchor component={Link} href={urlCity}>
                {data.Institution.City.name}
              </Anchor>
              {', '}
              <Anchor component={Link} href={urlState}>
                {getLocalizedName({ lang: lang, state: state })}
              </Anchor>
            </Text>

            {/* Social Media Link icons */}
            <Group spacing={"xs"}>
              {
                youtubeLink &&
                <SmIconLink type='youtube' url={youtubeLink} title={t('link-titles.yt-profile', { name: data.Institution.name })} gray />
              }
              {
                twitterLink &&
                <SmIconLink type='twitter' url={twitterLink} title={t('link-titles.tw-profile', { name: data.Institution.name })} gray />
              }
              {
                facebookLink &&
                <SmIconLink type='facebook' url={facebookLink} title={t('link-titles.fb-profile', { name: data.Institution.name })} gray />
              }
              {
                instagramLink &&
                <SmIconLink type='instagram' url={instagramLink} title={t('link-titles.in-profile', { name: data.Institution.name })} gray />
              }
            </Group>
          </Stack>

          {/* Flag */}
          <Stack align={"center"} spacing={"sm"}>
            <Flag className={classes.flag} />
          </Stack>

        </Group>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Stack spacing={"sm"}>

          <Group noWrap>
            <ThemeIcon size={"md"} radius="xl">
              <IconBuilding size={18} />
            </ThemeIcon>
            <Text>{t('card-institution.label-locations', { count: data.campusCount })}</Text>
          </Group>

          <Group noWrap>
            <ThemeIcon size={"md"} radius="xl">
              <IconSchool size={18} />
            </ThemeIcon>
            <Text>{t('card-institution.label-subjects', { count: data.subjectCount })}</Text>
          </Group>

          <Group noWrap>
            <ThemeIcon size={"md"} radius="xl">
              <IconCategory size={18} />
            </ThemeIcon>
            <Text>
              {
                data.biggestCategories.map((category, i) => (
                  <React.Fragment key={i}>
                    <Anchor component={Link} href={category.url}>{category.name}</Anchor>
                    {i < data.biggestCategories.length - 1 && ', '}
                  </React.Fragment>
                ))
              }
            </Text>
          </Group>

        </Stack>
      </Card.Section>

    </Card>
  )
}

export default memo(InstitutionCard);