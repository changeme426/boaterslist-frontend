import { FlatList, StyleSheet, Pressable, View } from 'react-native';
import theme from 'common/theme'
import { Text } from 'native-app/components/Themed';
import { Icon } from 'react-native-elements'
import Divider from 'common/components/Divider'
import { Mode } from 'common/hooks/useSearch'
import { LocationItem } from 'native-app/components/LocationItem';
import { useState } from 'react';
import { SearchResultMap } from './SearchResults/SearchResultMap';
import { useUserLocation } from 'common/hooks/useUserLocation';
import { useUserCurrentLocation } from 'common/hooks/useUserCurrentLocation';

export default function ModeResults({ navigation, search }) {
  const userLocationHook = useUserLocation();
  const useUserCurrentLocationHook = useUserCurrentLocation();
  let displayResults = false;
  if (userLocationHook.userLocationEnabled) {
    if (useUserCurrentLocationHook.userCurrentLocation.length > 0) {
      displayResults = true;
    }
  } else {
    displayResults = true;
  }

  // TODO implement result groups
  const result = (search.result && search.result.length > 0) ? search.result[0].data : [];

  const [viewMode, setViewMode] = useState('list');

  return <View style={{ backgroundColor: theme.colors.brandBlueDark, flex: 1 }}>
    <Pressable style={styles.resultTopIconTouch} onPress={() => search.setMode(Mode.Search)}>
      <View style={{ flexDirection: 'row', backgroundColor: 'transparent', padding: 5 }}>
        <Icon style={{ paddingTop: 5, paddingRight: 5 }} type="font-awesome-5" name="arrow-left" color="white" onPress={() => {
          search.setMode(Mode.Home)
          }} />
        <View style={{ paddingTop: 5, flexDirection: 'row', flex: 1, height: 35, borderRadius: 5, padding: 5, marginRight: 5, backgroundColor: 'white' }}>
          <Icon style={{ paddingRight: 5 }} type="font-awesome-5" name="search" color={theme.colors.brandBlue} />
          <Text style={styles.resultTopSearch}>{search.query}</Text>
          <Text style={styles.resultTopLocation}>{search.location}</Text>
        </View>
        {viewMode === 'list' && <Icon style={{ paddingTop: 5 }} type="font-awesome-5" name="map" color="white" onPress={() => setViewMode('map')} />}
        {viewMode === 'map' && <Icon style={{ paddingTop: 5 }} type="font-awesome-5" name="list" color="white" onPress={() => setViewMode('list')} />}
      </View>
    </Pressable>
    {displayResults ? <View style={{ height: '100%', backgroundColor: 'white', flex: 1 }}>
        {viewMode === 'list' ? <FlatList data={result} renderItem={({ item, index }) => {
          return <View key={index}>
            <Divider show={index != 0} size={1}>
              <LocationItem location={item.source} onSelect={(location) => {
                navigation.push('Location', { locationId: item.id })
              }} />
            </Divider>
          </View>
        }} /> : <View style={styles.searchResultsMap}>
          <SearchResultMap navigation={navigation} locations={search.result} latDelta={1} showAddress />
        </View>}
      </View> : null}
  </View>
}

const styles = StyleSheet.create({
  resultTopIconTouch: {
    paddingTop: 50,
    paddingBottom: 10,
  },
  resultTopSearch: {
    paddingTop: 3,
    color: 'black',
    paddingRight: 10,
    fontWeight: 'bold',
  },
  resultTopLocation: {
    paddingTop: 3,
    color: 'gray',
  },
  searchResultsMap: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  titleGroup: {
    color: theme.colors.brandBlack
  }
})
