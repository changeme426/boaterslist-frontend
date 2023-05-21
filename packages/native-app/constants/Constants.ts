import ExpoConstants from 'expo-constants'

const Constants = {
  WebAppURL: __DEV__ ? 'http://' + ExpoConstants.manifest.debuggerHost.split(':')[0] + ':3000':
    process.env.WEB_APP_URL
}

export default Constants
