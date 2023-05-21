import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootStackScreenProps } from '../types'
import { Button, Input } from 'react-native-elements';
import { UserProfileForm } from '../components/UserProfileForm';
import theme from 'common/theme'
import useLogin from 'native-app/hooks/useLogin'

const Stack = createNativeStackNavigator()

function Me() {
  return <View style={styles.container}>
    <ScrollView>
      <View style={styles.container}>
        <Input errorStyle={{ height: 0 }} disabled inputContainerStyle={{ borderRadius: 5 }} labelStyle={{ paddingLeft: 30 }} label={'Email'} value={'test@email.com'} />
        <Button buttonStyle={styles.passBtnStyle} type="outline" title="Change Password" containerStyle={styles.changePasswordStyles} onPress={() => console.log('CHANGE PASSWORD')} />
        <UserProfileForm />
      </View>
    </ScrollView>
  </View>
}

export default function MeScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
  const login = useLogin()

  return <View style={{ padding: 5, paddingTop:50 }}>
    {!login.user ? <>
      <Button containerStyle={{ marginTop: 50, marginBottom: 8 }} title="Sign In" onPress={login.login} />
      <Button containerStyle={{ marginBottom: 8 }} title="Sign Up" onPress={login.signup} />
    </> :
      <Button title="Logout" onPress={login.logout} />
    }
    <Text style={{ color: 'white' }}>{login.user ? 'Welcome: ' + login.user.email : ''}</Text>
  </View>
  /*return <Stack.Navigator>{user != null ? <>
    <Stack.Screen name="Profile" component={Me} options={{ headerShown: false }} />
  </> : <>
    <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerTitle: 'Sign In' }} />
    <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerTitle: 'Sign Up' }} />
  </>}
  </Stack.Navigator>*/
}

//<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
//<EditScreenInfo path="/screens/TabTwoScreen.tsx" />

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    marginTop: 50,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: theme.colors.brandBlueDark
  },
  changePasswordStyles: {
    marginHorizontal: 35,
    marginVertical: 5
  },
  passBtnStyle: {
    backgroundColor: theme.colors.brandWhite,
    borderWidth: 2,
    borderRadius: 30,
  }
})
