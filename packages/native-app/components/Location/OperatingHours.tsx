import React from 'react'
import { Text, View } from 'react-native'
import { formattedHours } from 'common/utils/FormattedHours'

export default function OperatingHours({ location }) {
  let operatingHours;
  if (location.operatingDaysHoursJSON && location.operatingDaysHoursJSON != 'null') {
    operatingHours = formattedHours(location.operatingDaysHoursJSON)
    return <View >
      <Text>{operatingHours}</Text>
    </View>
  }
  return null;
}
