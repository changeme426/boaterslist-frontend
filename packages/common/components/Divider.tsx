import {View} from 'react-native'

export default function Divider({ show, size = 3, children }) {
  return show ? <View><View style={{ height: size, backgroundColor: 'lightgrey' }} />{children}</View> : children
}
