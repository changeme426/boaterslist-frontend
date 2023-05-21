import React, { useState } from 'react'
import { Text, View, StyleSheet, Image, ScrollView, Pressable, Linking } from 'react-native'
import Constants from 'native-app/constants/Constants'
import useSearch from 'common/hooks/useSearch'
import theme from 'common/theme'
import Tabs from './Location/Tabs'
import InfoLocation from './Location/InfoLocation';
import Carousel from 'react-native-snap-carousel';
import AboutLocation from './Location/AboutLocation'
import parseWebsite from 'common/utils/parseWebsite'

export default function Location({ route, navigation }) {
  const search = useSearch(Constants.WebAppURL)
  const { locationId } = route.params
  const [activeIndex, setActiveIndex] = useState(0);
  const [tabSelection, setTabSelection] = useState(0);
  React.useEffect(() => {
    search.getLocationDetail(locationId)
  }, [])

  const picURL = (locid: number, type: string): string => {
    return `https://bluserimgs.s3.us-east-2.amazonaws.com/loc-${locid}-${type}.jpg`
  }

  const location = search.locationDetail
  const renderImages = () => {
    return [{
      id: 'logo',
      img: picURL(location?.locationId, "logo")
    }, {
      id: 'pic1',
      img: picURL(location?.locationId, "pic1")
    }, {
      id: 'logo',
      img: picURL(location?.locationId, "pic2")
    }]
  }

  const _renderItem = ({ item, index }) => {
    return (
      <View style={{
        margin: 'auto',
        alignItems: 'center'
      }}>
        <Image source={{ uri: item.img }} resizeMode="contain" style={{ width: 300, height: 300 }} />
      </View>
    )
  }

  const onLocationNamePress = () => {
    if (location?.website) {
      const parsedWebsite = parseWebsite(location.website);
      if (parsedWebsite && parsedWebsite.redirect) {
        Linking.openURL(parsedWebsite.parsed);
      }
    }
  }

  return location ?
    (
      <ScrollView>
        <View style={styles.locationContainer}>
          {location.premiere && <View style={{ alignItems: 'center', backgroundColor: theme.colors.brandBlueDark }}>
            <Carousel
              layout={"default"}
              data={renderImages()}
              sliderWidth={300}
              itemWidth={300}
              renderItem={_renderItem}
              onSnapToItem={index => setActiveIndex(index)} /></View>}
          <View style={styles.locationNameContainer}>
            <Pressable onPress={onLocationNamePress}><Text style={styles.locationName}>{location?.locationName}</Text></Pressable>
          </View>
          <Tabs onTabChange={(value) => setTabSelection(value)} locationDetail={location} />
          <View>
            {tabSelection === 0 && <InfoLocation locationDetail={location} />}
            {tabSelection === 1 && <AboutLocation locationDetail={location} />}
          </View>
        </View>
      </ScrollView>
    ) : null;
}

const styles = StyleSheet.create({
  badge: {
    marginLeft: 10,
  },
  locationContainer: {
    backgroundColor: theme.colors.brandWhite
  },
  locationNameContainer: {
    backgroundColor: theme.colors.brandBlueDark,
  },
  locationName: {
    fontSize: theme.locationsDetail.titleSize,
    color: theme.colors.brandWhite
  }
});
