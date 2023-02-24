import { Anchor, Card, createStyles, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { Country, State } from '@prisma/client'
import { IconBuilding, IconCategory, IconSchool } from '@tabler/icons'
import Flags from 'country-flag-icons/react/3x2'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React, { memo } from 'react'
import { InstitutionCardData } from '../../../lib/types/UiHelperTypes'
import { URL_INSTITUTION, URL_LOCATION } from '../../../lib/url-helper/urlConstants'
import { getLocalizedName, toLink } from '../../../lib/util/util'
import SocialMediaIconLink from '../socialmedia/SmIconLink'

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
    paddingTop: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingLeft: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },

  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
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
  const { lang } = useTranslation('common');

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
            <Link href={urlInstitution} passHref>
              <Anchor>
                <Text size="lg" color={theme.colors.brandGray[3]} weight={500} sx={{ lineHeight: 1 }}>
                  {data.Institution.name} <Text size={"xs"}>{data.Institution.nameBrackets}</Text>
                </Text>
              </Anchor>
            </Link>

            {/* City & State */}
            <Text color={theme.colors.brandGray[2]} sx={{ lineHeight: 1.2 }}>
              <Link href={urlCity} passHref>
                <Anchor>
                  {data.Institution.City.name}
                </Anchor>
              </Link>
              {', '}
              <Link href={urlState} passHref>
                <Anchor>
                  {getLocalizedName({ lang: lang, state: state })}
                </Anchor>
              </Link>
            </Text>

            {/* Social Media Link icons */}
            <Group spacing={"xs"}>
              {
                youtubeLink &&
                <SocialMediaIconLink type='youtube' url={youtubeLink} title={`Youtube channel of ${data.Institution.name}`} gray />
              }
              {
                twitterLink &&
                <SocialMediaIconLink type='twitter' url={twitterLink} title={`Twitter profile of ${data.Institution.name}`} gray />
              }
              {
                facebookLink &&
                <SocialMediaIconLink type='facebook' url={facebookLink} title={`Facebook profile of ${data.Institution.name}`} gray />
              }
              {
                instagramLink &&
                <SocialMediaIconLink type='instagram' url={instagramLink} title={`Instagram profile of ${data.Institution.name}`} gray />
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
            <ThemeIcon size={24} radius="xl">
              <IconBuilding size={18} />
            </ThemeIcon>
            <Text sx={{ lineHeight: 1.2 }}>{data.campusCount} campus location{data.campusCount > 1 ? "s" : ""}</Text>
          </Group>

          <Group noWrap>
            <ThemeIcon size={24} radius="xl">
              <IconSchool size={18} />
            </ThemeIcon>
            <Text sx={{ lineHeight: 1.2 }}>{data.subjectCount} subjects</Text>
          </Group>

          <Group noWrap>
            <ThemeIcon size={24} radius="xl">
              <IconCategory size={18} />
            </ThemeIcon>
            <Text sx={{ lineHeight: 1.2 }}>
              {
                data.biggestCategories.map((category, i) => (
                  <React.Fragment key={i}>
                    <Link href={category.url} passHref>
                      <Anchor>{category.name}</Anchor>
                    </Link>
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