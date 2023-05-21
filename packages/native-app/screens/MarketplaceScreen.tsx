import { ImageBackground, Text, View, StyleSheet, Platform, Linking, Pressable } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import theme from 'common/theme';
import background from '../assets/common/assets/images/BL_Search.png';
import AnchoredLogo from 'common/assets/svg/logos/Anchored_Logo.svg';

export default function MarketplaceScreen() {

  return (
    <View style={styles.container}>
      <ImageBackground source={background} resizeMode="cover"
        style={{ marginTop: 45, width: '100%', flex: 1, height: '100%' }}>
        <Pressable onPress={() => Linking.openURL("https://thedock.boaterslist.com")}>
          <View style={styles.marketContent}>
            <View style={styles.anchorLogo}><AnchoredLogo height='200' /></View>
            <View>
              <View style={styles.titleContent}><Text style={styles.title}>The Dock Marketplace</Text></View>
              <View style={styles.marketText}>
                <Text style={styles.textContent}>Click the link below to enter the best community to buy and sell boats and marine items.</Text>
                <Text style={styles.linkDock}>Enter The Dock</Text>
                <View style={styles.leftBorder}></View>
              </View>
            </View>
          </View>
        </Pressable>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  titleContent: {
    position: 'relative',
    height: 50
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingLeft: 0,
    position: 'absolute',
    bottom: 0,
  },
  linkDock: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  marketContent: {
    margin: 30,
    paddingTop: 30,
    paddingBottom: 30,
    paddingRight: 30,
    paddingLeft: 30,
    borderRadius: 20,
    position: 'relative',
    height: 250,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.brandWhite
  },
  textContent: {
    lineHeight: 25,
    fontSize: 14,
    padding: 5,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  marketText: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingRight: 40,
    paddingLeft: 20,
    position: 'relative',
  },
  leftBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 80,
    height: 70,
    borderLeftColor: theme.colors.brandBlue,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 5,
    borderBottomWidth: 5,
    borderBottomColor: theme.colors.brandBlue,
    borderBottomLeftRadius: 5,
  },
  anchorLogo: {
    position: 'absolute',
    right: 5,
    top: 10,
    bottom: 30
  }
});
