import { MantineProvider } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect } from 'react'
import Shell from '../features/AppShell/Shell'
import DevMessagePopover from '../features/DevMessagePopover'
import ErrorBoundary from '../features/ErrorBoundary/ErrorBoundary'
import * as gtag from '../lib/analytics/gtag'
import { AuthProvider } from '../lib/context/SessionContext'
import '../theme/globals.css'
import appTheme from '../theme/theme'

function MyApp({ Component, pageProps }: AppProps) {

  const { events } = useRouter();
  const { t } = useTranslation('common');

  useEffect(() => {
    const handleRouteChange = (url: string) => gtag.pageview(url);
    events.on('routeChangeComplete', handleRouteChange)
    return () => {
      events.off('routeChangeComplete', handleRouteChange)
    }
  }, [events]);

  return (

    <>
      <Head>
        <title key={"title"}>{t('page-title')}</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gtag.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </Head>

      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />

      <ErrorBoundary>
        <AuthProvider>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={appTheme}
          >

            <Shell>
              <Component {...pageProps} />
            </Shell>

            <DevMessagePopover />

          </MantineProvider>
        </AuthProvider>
      </ErrorBoundary>
    </>
  )
}

export default MyApp

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // console.log(metric)
}