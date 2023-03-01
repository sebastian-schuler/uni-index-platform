import { MantineProvider } from '@mantine/core'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import { useRouter } from 'next/router'
import AccountNavigation from '../features/Account/AccountNavigation'
import Navbar from '../features/AppShell/Navbar'
import { AuthProvider } from '../lib/context/SessionContext'
import { URL_ACCOUNT } from '../lib/url-helper/urlConstants'
import { toLink } from '../lib/util/util'
import '../theme/globals.css'
import appTheme from '../theme/theme'
import * as gtag from '../lib/analytics/gtag'
import Head from 'next/head'
import Script from 'next/script'
import { useEffect } from 'react'
import ErrorBoundary from '../features/ErrorBoundary/ErrorBoundary'
import DevMessagePopover from '../features/DevMessagePopover'

function MyApp({ Component, pageProps }: AppProps) {

  const { asPath, events } = useRouter();

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
            {
              asPath.startsWith(toLink(URL_ACCOUNT)) ? (
                <AccountNavigation>
                  <Component {...pageProps} />
                </AccountNavigation>
              ) : (
                <>
                  <Navbar />
                  <Component {...pageProps} />
                </>
              )
            }

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