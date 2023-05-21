import { Image, NamedStyles, StyleSheet, ViewStyle } from 'react-native'
import verified from "common/assets/images/verified-badge.png"
import premiere from "common/assets/images/premium-badge.png"

export enum BadgeType {
  None = -1,
  Verified,
  Premiere,
}

interface PropsType {
  badgeType: BadgeType,
  style?: NamedStyles<ViewStyle>,
}

const badgeImages = [ verified, premiere ]

export default function LocationBadge({ style, badgeType }: PropsType) {
  if (badgeType == BadgeType.None) {
    return null
  }
  return <Image style={[style, styles.image]} source={badgeImages[badgeType]}></Image>
}

const styles = StyleSheet.create({
  image: {
    width: 84,
    height: 30,
  }
})
