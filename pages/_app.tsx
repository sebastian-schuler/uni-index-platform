import { MantineProvider } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import { useRouter } from 'next/router'
import AccountDrawer from '../components/layout/account/AccountDrawer'
import WebsiteNavbar from '../components/layout/nav/Navbar'
import WebsiteHeader from '../components/layout/nav/WebsiteHeader'
import { AuthProvider } from '../context/SessionContext'
import { URL_ACCOUNT } from '../data/urlConstants'
import { toLink } from '../lib/util'
import '../styles/globals.css'
import appTheme from '../theme/theme'

function MyApp({ Component, pageProps }: AppProps) {

  const { asPath } = useRouter();
  const { lang } = useTranslation();
  // const themeConfig = React.useMemo(
  //   () => createTheme(theme, locales[getLanguageThemeById(lang)]),
  //   [lang, theme],
  // );

  return (
    <AuthProvider>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={appTheme}
      >

        {
          // asPath.startsWith(toLink(URL_ACCOUNT)) ? (
          //   <AccountDrawer>
          //     <Component {...pageProps} />
          //   </AccountDrawer>
          // ) : (
            <>
              {/* <WebsiteNavbar /> */} 
              <WebsiteHeader />
              <Component {...pageProps} />
            </>
          // )
        }

      </MantineProvider>
    </AuthProvider>
  )
}

export default MyApp

// Get authentication -> available anywhere afterwards

// MyApp.getInitialProps = async (appContext) => {
//   const appProps = await App.getInitialProps(appContext)
//   const auth = await getUser(appContext.ctx)
//   return { ...appProps, auth: auth }
// }

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // console.log(metric)
}