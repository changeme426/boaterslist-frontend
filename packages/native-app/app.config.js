import { loadEnvConfig } from '@next/env'

loadEnvConfig(__dirname, true)

const baseVersion = "1.0.35"
const _va = baseVersion.split(".")
// max Android verision code is 2100000000
const _dev = true
const _now = new Date()
const _nowInt = _now.getUTCFullYear() % 100 * 1000000 + (_now.getUTCMonth() + 1) * 10000 +
  _now.getUTCDate() * 100 + _now.getUTCHours() * 4 + Math.floor(_now.getUTCMinutes() / 15)
const version = _dev ?
  baseVersion + "-" + String(_nowInt) :
  baseVersion
const iosBuildNumber = _dev ? baseVersion + "." + String(_nowInt) : baseVersion
// development release use date (yymmddtt) (15 min time blocks)
// production use version (aabbcccc) + 100000000
const androidVersionCode = _dev ?
  _nowInt :
  100000000 + Number(_va[0]) * 1000000 + Number(_va[1]) * 10000 + Number(_va[2])

export default {
  "expo": {
    "name": "Boaterslist",
    "slug": "native-app",
    "sdkVersion": "44.0.0",
    "version": baseVersion,
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "boaterslist",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0D213D"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "buildNumber": iosBuildNumber,
      "bundleIdentifier": "com.boaterslist.nativeapp",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Your current location is required to provide the most relevant search results."
      }
    },
    "android": {
      "versionCode": androidVersionCode,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#0D213D"
      },
      "config": {
        "googleMaps": {
          "apiKey": process.env.GOOGLE_MAPS_API_KEY
        }
      },
      "package": "com.boaterslist.nativeapp"
    },
    "web": {
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": ["sentry-expo"],
    "hooks": {
      "postPublish": [
        {
          "file": "sentry-expo/upload-sourcemaps",
          "config": {
            "authToken": process.env.SENTRY_AUTH_TOKEN,
            "organization": process.env.SENTRY_ORG,
            "project": process.env.SENTRY_PROJECT,
          }
        }
      ]
    }
  }
}
