import React from 'react'
import { View } from 'react-native'
import { useRecoilState } from 'recoil'
import { userState } from 'common/atoms/userState'
import { Button, Input } from 'react-native-elements'

export default function SignInScreen({ navigation }) {
  const [user, setUser] = useRecoilState(userState)
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return <View style={{padding:5}}>
    <Input placeholder="Username" value={username} onChangeText={setUsername} />
    <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
    <Button containerStyle={{marginBottom: 8}} title="Sign In" onPress={() => { setUser({ name: "I User" }) }} />
    <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
  </View>
}
