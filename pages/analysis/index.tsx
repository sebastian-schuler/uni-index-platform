import { Stack, Title, List, Divider, Anchor } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import GenericPageHeader from '../../components/Block/GenericPageHeader'
import ResponsiveWrapper from '../../components/Container/ResponsiveWrapper'
import Breadcrumb from '../../features/Breadcrumb/Breadcrumb'
import { URL_ANALYSIS, URL_SOCIAL_MEDIA, URL_SOCIAL_MEDIA_RANKING, URL_SOCIAL_MEDIA_STATISTICS } from '../../lib/url-helper/urlConstants'
import { toLink } from '../../lib/util/util'

const AnalysisPage = () => {

  const { t } = useTranslation('analysis');

  return (
    <ResponsiveWrapper>

      <Head>
        <title key={"title"}>{t('common:page-title') + " | " + t('meta.analysis-title')}</title>
        <meta key={"description"} name="description" content={t('meta.analysis-description')} />
      </Head>

      <Breadcrumb />

      <Stack>
        <GenericPageHeader title={t('title')} description={t('subtitle')} />

        <Title order={2}>{t('social-media.title')}</Title>
        <List>
          <List.Item>
            <Anchor component={Link} href={toLink(URL_ANALYSIS, URL_SOCIAL_MEDIA, URL_SOCIAL_MEDIA_RANKING)}>
              {t('social-media.label-ranking')}
            </Anchor>
          </List.Item>

          <List.Item>
            <Anchor component={Link} href={toLink(URL_ANALYSIS, URL_SOCIAL_MEDIA, URL_SOCIAL_MEDIA_STATISTICS)}>
              {t('social-media.label-statistics')}
            </Anchor>
          </List.Item>
        </List>

        <Divider />

        <Title order={2}>{t('online-marketing')}</Title>
        <List>

        </List>

      </Stack>

    </ResponsiveWrapper>
  )
}

export default AnalysisPage