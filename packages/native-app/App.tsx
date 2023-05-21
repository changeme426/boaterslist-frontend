import log from 'common/global/log'
import 'expo-asset'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import Navigation from './navigation'

import { LogBox } from 'react-native'
import { RecoilRoot, waitForAllSettled } from 'recoil'
import { ThemeProvider } from 'react-native-elements'
import * as Sentry from 'sentry-expo';
import { IntlProvider } from 'react-intl'
import 'intl'
import 'intl/locale-data/jsonp/en'
import 'intl/locale-data/jsonp/es'
import 'intl/locale-data/jsonp/fr'
import esMsg from './compiled-lang/es.json'

LogBox.ignoreLogs(["timer"])

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // TODO lower in production
  tracesSampleRate: 1.0,
  enableInExpoDevelopment: true,
  // TODO: If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  debug: true,
})

log.error = function (err: Error) {
  if (__DEV__) {
    console.log(err)
  } else {
    Sentry.Native.captureException(err)
  }
}

// React Native Elements theme
const rneTheme = {
  Input: {
    inputStyle: {
      paddingLeft: 15,
      paddingRight: 15,
    },
    inputContainerStyle: {
      alignSelf: 'center',
      backgroundColor: 'white',
      borderBottomWidth: 0,
      borderRadius: 20,
      width: '85%',
    },
    leftIconContainerStyle: {
      left: 10,
      zIndex: 1000,
    },
  },
}

function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  if (!isLoadingComplete) {
    return null
  } else {
    return <ThemeProvider theme={rneTheme}>
      <RecoilRoot>
        <IntlProvider locale="en" defaultLocale="en" messages={esMsg}>
          <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </SafeAreaProvider>
        </IntlProvider>
      </RecoilRoot>
    </ThemeProvider>
  }
}

export default Sentry.Native.wrap(App)
