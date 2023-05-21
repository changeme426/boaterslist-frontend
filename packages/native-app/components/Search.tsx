import { FlatList, Image, ImageBackground, ScrollView, SectionList, StyleSheet, TouchableOpacity, Pressable, View } from 'react-native';
import { Input, Icon } from 'react-native-elements'
import DefaultItemIcon from 'common/assets/svg/default-item-icon.svg'
import VerifiedSmall from 'common/assets/svg/verified-small.svg'
import PremiumSmall from 'common/assets/svg/premium-small.svg'
import { useDebounce } from 'use-debounce'
import theme from 'common/theme'
import { Text } from 'native-app/components/Themed';
import { Mode } from 'common/hooks/useSearch'
import Divider from 'common/components/Divider'
import { useUserLocation } from 'common/hooks/useUserLocation';
import { useEffect, useState } from 'react';
import { useUserCurrentLocation } from 'common/hooks/useUserCurrentLocation';


export default function Search({ navigation, search }) {
  const useUserCurrentLocationHook = useUserCurrentLocation();
  const CURRENT_LOCATION_TEXT = 'Current location'
  const [location, setLocation] = useState(search.location);
  const [geoLocation, setGeoLocation] = useState(search.geoLocation);
  const [predictions, setPredictions] = useState([]);
  const [showPredictionOptions, setShowPredictionOptions] = useState(false);
  const debouncedLocation = useDebounce(location, 500, { leading: true })
  const userLocationHook = useUserLocation();

  var sectionData = search.suggested

  const onSubmitEditInput = (query) => {
    const currentLocation = useUserCurrentLocationHook.userCurrentLocation;
    let geoLoc = currentLocation;
    if (geoLocation && geoLocation.length > 0) {
      geoLoc = geoLocation;
    }
    search.doSearch(query, geoLoc, undefined, undefined, undefined, undefined, undefined, currentLocation.length > 0 ? currentLocation : undefined );
    search.setMode(Mode.Results);
  }

  const onPressSuggestion = (suggestion, section) => {
    if (section === 'nearby') {
      navigation.push('Location', { locationId: suggestion.id })
    } else {
      let category = 0
      let subCategory = 0
      if (suggestion.id.includes('s-')) {
        const sa = suggestion.id.split('-')
        if (sa.length == 3) {
          subCategory = parseInt(sa[2])
        } else if (sa.length == 2) {
          category = parseInt(sa[1])
        }
      }
      const currentLocation = useUserCurrentLocationHook.userCurrentLocation
      let geo = currentLocation
      if (geoLocation.length > 0) {
        geo = geoLocation
      }
      search.doSearch(suggestion.title, geo, category, subCategory, undefined, undefined, undefined, currentLocation.length > 0 ? currentLocation : undefined);
      search.setMode(Mode.Results);
    }
  }

  //Start Prediction logic for google places autocomplete
  const onChangeLocation = async (value) => {
    setShowPredictionOptions(true)
    setLocation(value);
  }

  useEffect(() => {
    let locationFetch = location;
    if (location === CURRENT_LOCATION_TEXT) {
      locationFetch = "";
    }
    const fetchLocationPrediction = async () => {
      if (locationFetch !== "") {
        const placeIdURL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&input=${locationFetch}`;
        try {
          const result = await fetch(placeIdURL);
          const json = await result.json();
          setPredictions(json?.predictions);
        } catch (error) {
          console.log(error, "ERROR")
        }
      }
    }
    fetchLocationPrediction();
  }, [debouncedLocation]);

  const getGeoLocationByPlaceId = async (placeId) => {
    const placeURL = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    try {
      const result = await fetch(placeURL);
      const json = await result.json();
      if (json.result?.geometry) {
        const geoLngLat = json.result.geometry.location;
        setGeoLocation([geoLngLat.lat, geoLngLat.lng]);
        search.setGeoLocation([geoLngLat.lat, geoLngLat.lng])
        userLocationHook.addUserLocation([geoLngLat.lat, geoLngLat.lng]);
      }
    } catch (error) {
      console.log(error, "ERROR")
    }
  }

  const onPredictionPress = (prediction) => {
    if (prediction.description !== CURRENT_LOCATION_TEXT) {
      getGeoLocationByPlaceId(prediction.place_id);
    } else {
      setGeoLocation(useUserCurrentLocationHook.userCurrentLocation);
    }
    setLocation(prediction.description)
    search.setLocation(prediction.description);
    setShowPredictionOptions(false)
  }

  const onFocusLocations = () => {
    if (location === CURRENT_LOCATION_TEXT) {
      setLocation("");
      setPredictions([{ description: CURRENT_LOCATION_TEXT }])
    }
    if (location === "") {
      setPredictions([{ description: CURRENT_LOCATION_TEXT }])
    }
    setShowPredictionOptions(true);
  }

  const showPredictions = () => {
    return predictions.map((prediction, idx) => <Pressable onPress={() => onPredictionPress(prediction)} key={idx}><Text style={styles.predictionText}>{prediction.description}</Text></Pressable>)
  }
  //End Prediction logic for google places autocomplete

  const onIconLocationPress = () => {
    setLocation(CURRENT_LOCATION_TEXT);
    search.setLocation(CURRENT_LOCATION_TEXT);
    search.setGeoLocation(useUserCurrentLocationHook.userCurrentLocation);
    setGeoLocation(useUserCurrentLocationHook.userCurrentLocation);
  }

  return <View style={{ flex: 1 }}>
    {(predictions.length > 0 && showPredictionOptions) &&
      <View style={styles.suggestionContainer}>
        {showPredictions()}
      </View>}
    <View style={{ zIndex: 0, elevation: 0, position: 'relative', paddingTop: 45, backgroundColor: theme.colors.brandBlueDark }}>
      <Input containerStyle={{}} errorStyle={{ height: 0 }} inputContainerStyle={{ borderRadius: 5 }}
        autoFocus={true} leftIcon={{ type: 'font-awesome', name: 'search', color: theme.colors.brandBlue }}
        rightIcon={{ type: 'font-awesome', name: 'times-circle', color: 'lightgray', onPress: () => search.setQuery("") }}
        onChangeText={(value) => { search.setQuery(value) }} value={search.query} returnKeyType="search" onSubmitEditing={() => onSubmitEditInput(search.query)} />
      <Input placeholder='Enter location'
        value={location}
        inputContainerStyle={{ borderRadius: 5 }}
        leftIcon={{ type: 'font-awesome', name: 'location-arrow', color: theme.colors.brandBlue, onPress: onIconLocationPress }}
        rightIcon={{ type: 'font-awesome', name: 'times-circle', color: 'lightgray', onPress: () => { setLocation(""); setGeoLocation([]); } }}
        onFocus={onFocusLocations}
        returnKeyType="search"
        onSubmitEditing={() => onSubmitEditInput(search.query)}
        onBlur={() => setShowPredictionOptions(false)}
        onChangeText={value => onChangeLocation(value)} />
      <View style={{ position: 'absolute', left: 10, top: 55 }}>
        <Icon style={{ width: 20 }} type="font-awesome" name="times" color="white" onPress={() => search.setMode(Mode.Home)} />
      </View>
      <View style={{ position: 'absolute', right: 10, top: 55 }}>
        <Icon style={{ width: 20 }} type="font-awesome" name="filter" color="white" />
      </View>
    </View>
    <SectionList style={{ backgroundColor: 'white', zIndex: -1, position: 'relative', width: '100%' }} sections={sectionData}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index, section }) =>
        <SearchItem section={section} item={item} onPress={() => onPressSuggestion(item, section.id)} />}
      renderSectionHeader={({ section: { id, title } }) => <Divider show={id != 'h1'}>
        <Text key={id} style={styles.sectionHeading}>{title}</Text>
      </Divider>} />
  </View>
}

const SearchItem = ({ item, onPress, section }) => {
  if (section.id == 'nearby') {
    return <Pressable onPress={onPress}>
      <View pointerEvents='box-none' style={{ padding: 4, flexDirection: 'row' }}>
        <View style={{ paddingTop: 10 }}>
          {item.leftIcon !== "ship" ?
            <Icon style={{ width: 40, height: 40, justifyContent: 'center' }} type="font-awesome" name={item.leftIcon} color="lightgray" />
            : <DefaultItemIcon style={{ width: 98 * .5, height: 40 * .5 }} />}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'black', fontWeight: '700', fontSize: 12 }}>{item.title}</Text>
          <Text style={{ color: 'gray', fontSize: 12 }}>{item.detail}</Text>
        </View>
        {item.rightIcon ?
          <View style={{ width: 30, height: 30, alignSelf: 'flex-end' }}>
            {item.rightIcon == "verified" ? <VerifiedSmall /> :
              item.rightIcon == "premium" ? <PremiumSmall /> : null}
          </View> : null}
      </View>
    </Pressable>
  }
  return <Pressable onPress={onPress}>
    <View style={{ marginTop: 5, flexDirection: 'row' }}>
      <Icon style={{ flex: 1, marginLeft: 10, marginRight: 10, width: 35, height: 35 }} type="font-awesome" name={item.leftIcon} color="lightgray" />
      <Text style={{ paddingTop: 3, color: 'black', fontWeight: '700', fontSize: 12 }}>{item.title}</Text>
    </View>
  </Pressable>
}

const styles = StyleSheet.create({
  sectionHeading: {
    color: theme.colors.brandBlue,
    fontWeight: '700',
    backgroundColor: 'white',
    padding: 3,
  },
  suggestionContainer: {
    position: 'absolute',
    top: 150,
    backgroundColor: theme.colors.brandWhite,
    padding: 10,
    right: 30,
    left: 30,
    zIndex: 3,
    elevation: 3
  },
  predictionText: {
    color: theme.colors.brandBlack,
    marginBottom: 10
  },
})
