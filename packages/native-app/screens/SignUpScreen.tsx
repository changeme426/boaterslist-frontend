import React from 'react'
import { View } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { useRecoilState } from 'recoil'
import { userState } from 'common/atoms/userState'

export default function SignUpScreen() {
  const [user, setUser] = useRecoilState(userState)
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return <View style={{ padding: 5 }}>
    <Input placeholder="Username" value={username} onChangeText={setUsername} />
    <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
    <Button title="Sign Up" onPress={() => setUser({ name: "I User" })} />
  </View>
}
