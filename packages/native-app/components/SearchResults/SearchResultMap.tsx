import { Locations } from "common/models/Locations";
import theme from "common/theme";
import React from "react";
import { View, StyleSheet, Dimensions, Text, Pressable, Linking, Platform } from "react-native";
import { Icon } from 'react-native-elements'

import MapView, { Callout, Marker } from 'react-native-maps';
import { Address } from "../Address";

type Props = {
  locations: any[];
  latDelta?: number;
  showAddress?: boolean;
  navigation?: any;
  directions? : boolean;
};

export function SearchResultMap({ locations, latDelta, showAddress, navigation, directions }: Props) {
  const locationsSource = (locations && locations[0].data) ? locations[0].data : null;
  const { height, width } = Dimensions.get('window');
  const LATITUDE_DELTA = latDelta || 0.01;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
  const [center, setCenter] = React.useState({
    latitude: 39.8283459,
    longitude: -98.5816684,
    longitudeDelta: LATITUDE_DELTA,
    latitudeDelta: LONGITUDE_DELTA
  });

  const onMarkerPress = async(marker) => {
    if(directions ){
      const latitude = marker.source.coordinate.lat;
      const longitude = marker.source.coordinate.lon;
      const label = marker.source.locationName;
      const tag = `${Platform.OS === 'ios' ? 'maps' : 'geo'}:0,0?q=`;
      const link = Platform.select({
          ios: `${tag}${label}@${latitude},${longitude}`,
          android: `${tag}${latitude},${longitude}(${label})`
      });
      try {
        const supported = await Linking.canOpenURL(link);

            if (supported) Linking.openURL(link);
        } catch (error) {
            console.log(error);
        }
    }
    if (navigation) {
      navigation.push('Location', { locationId: marker.source.locationId });
    }
  }

  React.useEffect(() => {
    if(locationsSource){
      const locationsWithCord = locationsSource.filter((l) => l.source.coordinate && l.source.coordinate.lon !== 0);
      if (locationsWithCord.length) {
        setCenter({ latitude: locationsWithCord[0].source.coordinate.lat, longitude: locationsWithCord[0].source.coordinate.lon, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA });
      }
    }
  }, [locationsSource]);

  if (locationsSource && locationsSource.length) {
    return (
      <View style={styles.container}>
        <MapView initialRegion={center} maxZoomLevel={19} zoomControlEnabled={true} region={center} style={styles.mapStyle}>
          {locationsSource.map((marker, index) => {
            if (typeof marker.source.coordinate === "object" && marker.source.coordinate) {
              return (<Marker
                onCalloutPress={() => onMarkerPress(marker)}
                key={index}
                coordinate={{ latitude: marker.source.coordinate.lat, longitude: marker.source.coordinate.lon }}
              >
                <View style={{ width: '100%' }}>
                  <Icon color={theme.colors.brandBlue} type="font-awesome" name="map-marker" size={40} />
                </View>

                <Callout style={styles.calloutStyles}>
                  <Pressable>
                    <Text style={styles.markerTitle}>{marker.source.locationName}</Text>
                    {showAddress && <Address location={marker.source} />}
                  </Pressable>
                </Callout>
              </Marker>)
            }
          })}
        </MapView>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  calloutStyles: {
    maxWidth: '100%',
    minWidth: 150,
    display: 'flex',
    justifyContent: 'center',
    position:'relative',
    zIndex: 99,
    elevation: 99,
    backgroundColor: theme.colors.brandWhite,
    borderRadius: 20
  },
  markerTitle: {
    color: theme.colors.brandBlue,
    fontWeight: '600',
    justifyContent: 'flex-start'
  }
});
