import React, { useState } from 'react'
import { Text, View, StyleSheet, Pressable, ScrollView } from 'react-native'
import theme from 'common/theme'
import { Address } from '../Address';
import Services from './Services';
import Ratings from './Ratings';
import { SearchResultMap } from '../SearchResults/SearchResultMap';
import OperatingHours from './OperatingHours';


export default function InfoLocation({ locationDetail }) {
  return <View style={styles.container}>
    <View style={styles.addressMap}>
      <View style={styles.addressContainer}>
        <Text style={styles.section}>ADDRESS</Text>
        <Address location={locationDetail} />
        <View style={styles.operatingHours}><OperatingHours location={locationDetail} /></View>
      </View>
      <View style={styles.searchResultsMap}>
        <SearchResultMap directions locations={[
          {
            data: [{ source: locationDetail }]
          }
        ]} />
      </View>
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.section}>SERVICES</Text>
      <Services location={locationDetail} />
      {/* <Text style={styles.section}>RATINGS</Text>
      <View><Ratings /></View> */}
    </View>
  </View>


}

const styles = StyleSheet.create({
  container: {
    margin: theme.locationsTab.containerMargin,
    marginRight: 5,
    position: 'relative',
  },
  section: {
    color: theme.colors.brandGray,
    fontSize: theme.locationsTab.sectionFontSize,
    marginBottom: theme.locationsTab.sectionMarginBottom
  },
  infoContent: {
    position: 'relative',
    marginBottom: 10
  },
  addressMap: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row'
  },
  addressContainer: {
    flex: 1
  },
  operatingHours: {
    marginTop: 10
  },
  searchResultsMap: {
    position: 'relative',
    width: 200,
    height: 200
  }
});
