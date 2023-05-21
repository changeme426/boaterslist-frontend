import React, { useState } from 'react'
import { Text, View, StyleSheet, Pressable } from 'react-native'
import theme from 'common/theme'
import Premium from 'common/assets/svg/premium-small.svg'
import Verified from 'common/assets/svg/verified-small.svg'

export default function Tabs({ locationDetail, onTabChange }) {
  const [tabSelected, setTabSelected] = useState(0);
  const onTabChanged = (tab: number) => {
    setTabSelected(tab);
    onTabChange(tab);
  }

  return <View style={styles.tabsContainer}>
    <View style={styles.tabContent}>
      <View style={styles.tabOptions}>
        <Pressable style={[styles.tabView, tabSelected === 0 && styles.tabSelected]} onPress={() => onTabChanged(0)}>
          <Text style={[styles.textStyles]}>Info</Text>
        </Pressable>
        <Pressable style={tabSelected === 1 && styles.tabSelected} onPress={() => onTabChanged(1)}>
          <Text style={[styles.textStyles]}>About</Text>
        </Pressable>
      </View>
      <View style={styles.iconBadge}>{locationDetail.premiere ? <Premium width={30} height={30} /> : locationDetail.verified ? <Verified width={30} height={30} /> : null}
      </View>
    </View>
  </View>
}

const styles = StyleSheet.create({
  tabsContainer: {
    backgroundColor: theme.colors.brandBlueDark
  },
  tabContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5,
    marginLeft: theme.locationsTab.containerMargin,
    marginRight: 0
  },
  tabView: {
    marginRight: 10,
    textAlign: 'center'
  },
  tabSelected: {
    borderBottomColor: theme.colors.brandWhite,
    borderBottomWidth: 2
  },
  textStyles: {
    color: theme.colors.brandWhite,
    fontSize: theme.locationsDetail.contactFontSize,
  },
  tabOptions: {
    display: 'flex',
    flexDirection: 'row',
  },
  iconBadge: {
    marginRight: 5
  }
});
