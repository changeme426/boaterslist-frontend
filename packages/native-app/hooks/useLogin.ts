import React from 'react'
import * as AuthSession from 'expo-auth-session'
import * as Linking from 'expo-linking'
import * as SecureStore from 'expo-secure-store'
import * as WebBrowser from 'expo-web-browser'
import jwtDecode from "jwt-decode"
import { Platform } from 'react-native'
import { useRecoilState } from 'recoil'
import { userState } from 'common/atoms/userState'

const SECURE_AUTH_KEY = 'BoaterslistAuthToken'

// TODO create our own proxy rather than expo or pure native?
const needProxy = Platform.select({ web: false, default: true })
const clientId = process.env.AUTH0_CLIENT_ID
const authEndpoint = `${process.env.AUTH0_ISSUER_BASE_URL}/authorize`
const redirectUri = AuthSession.makeRedirectUri({ useProxy: needProxy })

const logoutEndpoint = `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout`
const logoutRedirectUrl = Linking.createURL('/me')
// TODO - needed for openBrowserAsync logout alternative solution
// const logoutRedirectUrl = Linking.createURL('/me?logout=1')

// Decoded login JWT token
export interface Decoded {
  email: string
  email_verified: boolean
  exp: number
  family_name: string
  given_name: string
  locale: string
  name: string
  nickname: string
  nonce: string
  picture: string
  sub: string
}

let token = ''

export function getToken() {
  SecureStore.getItemAsync(SECURE_AUTH_KEY).then((jwt) => {
    const decoded = jwtDecode(jwt) as Decoded
    // TODO setUser({ email: decoded.email })
    console.log("JWT", decoded)
    token = jwt
  })
}

export default function useLogin() {
  const url = Linking.useURL()
  console.log("URL", url)
  const [user, setUser] = useRecoilState<any>(userState);
  const [request, result, promptAsync] = AuthSession.useAuthRequest({
    redirectUri, clientId: clientId, responseType: "id_token",
    scopes: ["email", "openid", "profile"],
    extraParams: {
      // TODO random value
      nonce: "nonce",
    },
  }, { authorizationEndpoint: authEndpoint })
  const [signupRequest, signupResult, signupPromptAsync] = AuthSession.useAuthRequest({
    redirectUri, clientId: clientId, responseType: "id_token",
    scopes: ["email", "openid", "profile"],
    extraParams: {
      // TODO random value
      nonce: "nonce",
      screen_hint: 'signup',
    },
  }, { authorizationEndpoint: authEndpoint })

  // TODO SecureStore.getItemAsync(SECURE_AUTH_KEY, )

  const handleLogin = function (jwt: string) {
    console.log("HANDLE LOGIN")
    const decoded = jwtDecode(jwt) as Decoded
    console.log("LOGIN INFO", decoded)
    SecureStore.setItemAsync(SECURE_AUTH_KEY, jwt)
    token = jwt
    setUser({ email: decoded.email })
  }
  const handleLoginError = function (msg: string) {
    console.log("LOGIN ERROR", msg)
    //Alert.alert("Authentication error", msg)
  }
  const handleLogout = function () {
    if (token) {
      token = null
      console.log("HANDLE LOGOUT")
      SecureStore.deleteItemAsync(SECURE_AUTH_KEY)
      setUser(null)
      if (Platform.OS === 'ios') {
        WebBrowser.dismissBrowser()
      }
    }
  }

  // TODO
  // React.useEffect(() => {
  //   if (url && url.endsWith('/me?logout=1')) {
  //     handleLogout()
  //   }
  // }, [url])

  // TODO - workaround for Android: exp://192.168.0.182:19000/--/expo-auth-session#id_token=
  /*React.useEffect(() => {

  }*/

  React.useEffect(() => {
    if (result) {
      switch (result.type) {
        case 'error':
        case 'success':
          if (result.error) {
            handleLoginError(result.params.error_description || "something went wrong")
          } else {
            handleLogin(result.params.id_token)
          }
      }
    }
    if (signupResult) {
      switch (signupResult.type) {
        case 'error':
        case 'success':
          if (signupResult.error) {
            handleLoginError(signupResult.params.error_description || "something went wrong")
          } else {
            handleLogin(signupResult.params.id_token)
          }
      }
    }
  }, [result, signupResult])

  const login = function () {
    promptAsync({ useProxy: needProxy })
  }
  const logout = async function () {
    if (token) {
      try {
        // TODO - minor issue: logout confirmation shows sign in message but still logs out successfully
        const result = await WebBrowser.openAuthSessionAsync(`${logoutEndpoint}?client_id=${clientId}&returnTo=${logoutRedirectUrl}`, null)
        switch (result.type) {
          case 'dismiss':
          case 'success':
            handleLogout()
        }
        // TODO openBrowserAsync logout does not remove session token - so we're using openAuthSessionAsync above which has other minor issues
        // const result = await WebBrowser.openBrowserAsync(`${logoutEndpoint}?client_id=${clientId}&returnTo=${logoutRedirectUrl}`)
        // if (result.type != 'dismiss') {
        //  console.error('problem logging out', result)
        // }
      } catch (err) {
        console.log("LOGOUT ERROR")
        console.error(err)
      }
    }
  }
  const signup = function () {
    console.log("SIGN UP")
    signupPromptAsync({ useProxy: needProxy })
  }

  return {
    login: login,
    logout: logout,
    signup: signup,
    user: user,
    setUser: setUser,
  }
}
