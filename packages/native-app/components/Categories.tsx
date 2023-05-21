import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import FishingIcon from 'common/assets/svg/fishing-icon.svg'
import PaddlingIcon from 'common/assets/svg/paddling-icon.svg'
import ShipIcon from 'common/assets/svg/ship-icon'
import CanoeIcon from 'common/assets/svg/canoe-icon'
import GuideIcon from 'common/assets/svg/guide-icon'
import HatIcon from 'common/assets/svg/hat-icon'
import BoatersListIcon from 'common/assets/svg/boaterslist-icon.svg'
import ToolsIcon from 'common/assets/svg/tools-icon.svg'

import { useWindowDimensions } from 'react-native'
import theme from 'common/theme'

interface CategoriesProps {
  onCategory: any
  children?: React.ReactChildren
}

export default function Categories({onCategory, children }: CategoriesProps) {
  const { width } = useWindowDimensions()
  const categories1 = [
    { label: 'All Categories', categoryId: "-1", icon: <BoatersListIcon /> },
    { label: 'Guides', categoryId: "s-5", icon: <FishingIcon /> },
    { label: 'Rentals', categoryId: "s-2", icon: <PaddlingIcon /> },
    { label: 'Services', categoryId: "s-3", icon: <ToolsIcon /> },
    { label: 'Marinas', categoryId: "s-1", icon: <ShipIcon /> },
    { label: 'Haul Out Service', categoryId: "s-4", icon: <CanoeIcon /> },
    { label: 'Sales', categoryId: "s-11", icon: <GuideIcon /> },
    { label: 'Crew for Hire', categoryId: "s-6", icon: <HatIcon /> },
  ]
  return <View style={styles.container}>
    <View style={styles.row}>
      {categories1.map(({ label, icon, categoryId }, i) => (i * 90 < width) ?
        <TouchableOpacity key={i} style={styles.icon}
          onPress={() => onCategory(label, categoryId)}>
          <View style={styles.iconIcon}>
            {icon}
          </View>
          <Text style={styles.iconText}>{label}</Text>
        </TouchableOpacity> : null)
      }
    </View>
    {children}
  </View>
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 0,
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: theme.colors.brandBlueDark,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 10,
    paddingBottom: 10,
  },
  icon: {
    marginHorizontal: 2,
    marginVertical: 2,
  },
  iconIcon: {
    height: 50,
  },
  iconText: {
    color: 'white',
    fontSize: 12,
    width: 65,
    textAlign: 'center',
  }
})
