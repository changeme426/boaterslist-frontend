import { Text, View, StyleSheet } from 'react-native'
import { Locations } from 'common/models/Locations'

interface PropTypes {
  location: Locations
}

export function Address({ location }: PropTypes) {
  const trimSpaces = (value: string | undefined) => {
    return value ? value.trim() : ""
  }
  return <>
    {location.address1 ? <Text>{trimSpaces(location.address1)}, </Text> : null}
    {location.address2 ? <Text>{trimSpaces(location.address2)}, </Text> : null}
    <Text>{trimSpaces(location.city)}, {trimSpaces(location.state)}{location.zipCode ? ", " + trimSpaces(location.zipCode) : ""}</Text>
  </>
}
