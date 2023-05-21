import React from 'react'
import { Text, View, StyleSheet, Pressable, Linking } from 'react-native'
import { Icon } from 'react-native-elements'
import theme from 'common/theme'
import parseWebsite from 'common/utils/parseWebsite'

export default function AboutLocation({ locationDetail }) {
  const parsedWebsite = parseWebsite(locationDetail.website);
  const onWebsiteClick = (website: any) => {
    if (website.redirect) {
      Linking.openURL(website.parsed);
    }
  };

  return <View style={styles.aboutLocation}>
    <View style={styles.sectionContent}>
      <Text>{locationDetail.description}</Text>
    </View>
    {locationDetail?.website !== "" && <View style={styles.sectionContent}>
      <Text style={styles.section}>WEBSITE</Text>
      <Pressable onPress={() => onWebsiteClick(parsedWebsite)}>
        <Text style={styles.linkFormat}>{(parsedWebsite && parsedWebsite.original !== null) && parsedWebsite.original[0]}</Text>
      </Pressable>
    </View>}
    <View style={styles.sectionContent}>
      <Text style={styles.section}>CONTACT</Text>
      <View style={styles.contactData}><Text>{locationDetail.contactPerson}</Text></View>
      <View style={styles.contactData}>
        {(locationDetail?.contactEmail !== "") &&
          <View style={styles.iconAndContactInfo}>
            <Icon style={styles.iconStyles} type="font-awesome" name="envelope-o" size={16} />
            <Pressable onPress={() => Linking.openURL(`mailto:${locationDetail.contactEmail}`)}>
              <Text style={styles.linkFormat}>{locationDetail.contactEmail}</Text>
            </Pressable>
          </View>}
        {(locationDetail.contactPhone || locationDetail.phoneNumber) &&
          <View style={styles.iconAndContactInfo}>
            <Icon style={styles.iconStyles} type="font-awesome" name="phone" size={16} />
            <Pressable onPress={() => Linking.openURL(`tel:${locationDetail.contactPhone || locationDetail.phoneNumber}`)}>
              <Text style={styles.linkFormat}>{locationDetail.contactPhone || locationDetail.phoneNumber}</Text>
            </Pressable>
          </View>}
      </View>
      <View style={styles.sectionContent}>
        {false /* TODO NOW */ && <>
          <Text style={styles.section}>SOCIALS</Text>
          <View style={[styles.socialIcons]}><Icon style={styles.iconStyles} type="font-awesome" name="twitter" size={16} />
            <Text style={styles.linkFormat}>@Twitter</Text></View>
          <View style={styles.socialIcons}><Icon style={styles.iconStyles} type="font-awesome" name="instagram" size={16} />
            <Text style={styles.linkFormat}>@Instagram</Text></View>
          <View style={styles.socialIcons}><Icon style={styles.iconStyles} type="font-awesome" name="facebook" size={16} />
            <Text style={styles.linkFormat}>@Facebook</Text></View>
        </>}
      </View>
    </View>
  </View>
}

const styles = StyleSheet.create({
  aboutLocation: {
    margin: theme.locationsTab.containerMargin,
    fontSize: theme.locationsTab.aboutDefaultFontSize
  },
  contactData: {
    marginBottom: 5
  },
  sectionContent: {
    marginBottom: 10
  },
  section: {
    color: theme.colors.brandGray,
    fontSize: theme.locationsTab.sectionFontSize,
    marginBottom: theme.locationsTab.sectionMarginBottom
  },
  iconAndContactInfo: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5
  },
  socialIcons: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5
  },
  iconStyles: {
    marginRight: 10,
  },
  linkFormat: {
    color: theme.colors.brandBlue,
    fontWeight: 'bold'
  }

});
