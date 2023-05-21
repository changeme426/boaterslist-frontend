import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Locations } from 'common/lib/api/Locations'
import theme from 'common/theme'
import { Address } from 'native-app/components/Address'
import DefaultItemIcon from 'common/assets/svg/default-item-icon.svg'
import PremiumSmall from 'common/assets/svg/premium-small.svg'
import VerifiedSmall from 'common/assets/svg/verified-small.svg'

interface PropsType {
  location: Locations
  onSelect: any
}

export function LocationItem({ location, onSelect }: PropsType) {
  const iconLeft = () => {
    if (location.premiere) {
      return <PremiumSmall style={{ marginTop: -5, width: 50, height: 40 }} />
    } else if (location.verified) {
      return <VerifiedSmall style={{ marginTop: -5, width: 50, height: 40 }} />
    } else {
      return <DefaultItemIcon style={{ width: 98 * .5, height: 40 * .5 }} />;
    }
  }
  return <Pressable onPress={() => onSelect(location)}>
    <View style={{ width: '100%', padding: 3, paddingRight: 60 }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ paddingTop: 10, paddingRight: 10 }}>
          {iconLeft()}
        </View>
        <View>
          <Text style={styles.locationName}>{location.locationName}</Text>
          <Address location={location} />
          <View style={{ flexDirection: 'row' }}>
            {/* <Text style={{ fontWeight: '700', padding: 2 }}>4.3</Text> */}
            {/* <Icon style={{ padding: 2, paddingTop: 4 }} type="font-awesome" name="anchor" size={16} color={theme.colors.brandBlue} />
            <Icon style={{ padding: 2, paddingTop: 4 }} type="font-awesome" name="anchor" size={16} color={theme.colors.brandBlue} />
            <Icon style={{ padding: 2, paddingTop: 4 }} type="font-awesome" name="anchor" size={16} color={theme.colors.brandBlue} />
            <Icon style={{ padding: 2, paddingTop: 4 }} type="font-awesome" name="anchor" size={16} color={theme.colors.brandBlue} />
            <Icon style={{ padding: 2, paddingTop: 4 }} type="font-awesome" name="anchor" size={16} color='lightgray' /> */}
            {/* <Icon style={{ paddingTop: 10, paddingLeft: 4, paddingRight: 4 }} type="font-awesome" name="circle" size={3} color='gray' /> */}
            <Text style={{ color: 'gray', padding: 2 }}>{Math.round(location.dist)} miles</Text>
          </View>
          {location.detail && <View style={styles.details}>
            <Text>{location.detail}</Text>
          </View>}
        </View>
      </View>
    </View>
  </Pressable>
}

const styles = StyleSheet.create({
  badge: {
    marginLeft: 10,
  },
  locationName: {
    fontSize: theme.locations.titleSize,
    color: 'black',
    fontWeight: 'bold',
  },
  details: {
    flexDirection: 'row',
  },
  subCategory: {
    fontWeight: '700',
  },
  title: {
    alignItems: 'center',
    flexDirection: 'row',
  },
})
