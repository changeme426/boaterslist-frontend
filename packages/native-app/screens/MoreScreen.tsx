import theme from 'common/theme'
import Constants from 'native-app/constants/Constants'
import { Icon } from 'react-native-elements'
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import LogoStacked from "common/assets/svg/logos/boaterslist-mark-color.svg"

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.logo}>
        <LogoStacked width="100" height="100" />
      </Pressable>
      <Pressable onPress={() => Linking.openURL('https://boaterslistmerch.com/')} style={styles.section}>
        <Text style={styles.sectionText}>Merchandise</Text>
      </Pressable>
      <Pressable onPress={() => Linking.openURL(`${Constants.WebAppURL}/articles`)} style={styles.section}>
        <Text style={styles.sectionText}>Articles and Advice</Text>
      </Pressable>
      <Pressable onPress={() => Linking.openURL(`${Constants.WebAppURL}/about-us`)} style={styles.section}>
        <Text style={styles.sectionText}>About</Text>
      </Pressable>
      <Pressable onPress={() => Linking.openURL(`${Constants.WebAppURL}/contact-us`)} style={styles.section}>
        <Text style={styles.sectionText}>Contact</Text>
      </Pressable>
      <View style={[styles.section, styles.icons]}>
        <View>
          <Icon size={40} style={{ paddingRight: 20 }} type="font-awesome-5" name="instagram-square" color={`${theme.colors.brandBlue}`} onPress={() => {
            Linking.openURL(theme.iconsUrl.instagram)
          }} />
        </View>
        <View>
          <Icon size={40} style={{ paddingRight: 20 }} type="font-awesome-5" name="facebook-square" color={`${theme.colors.brandBlue}`} onPress={() => {
            Linking.openURL(theme.iconsUrl.facebook)
          }} />
        </View>
        <View>
          <Icon size={40} style={{ paddingRight: 5 }} type="font-awesome-5" name="youtube-square" color={`${theme.colors.brandBlue}`} onPress={() => {
            Linking.openURL(theme.iconsUrl.youtube)
          }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingRight: 50,
    paddingLeft: 50,
    backgroundColor: theme.colors.brandWhite
  },
  logo: {
    width: '100%',
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: theme.colors.brandBlue
  },
  icons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'

  },
  sectionText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
