import React, { useCallback } from 'react'
import { Image, ImageBackground, ScrollView, StyleSheet, Pressable, View } from 'react-native'
import { RootTabScreenProps } from 'native-app/types'
import theme from 'common/theme'
import background from '../assets/common/assets/images/background.png'
import ad1Img from '../assets/common/assets/images/ads/D-Dey-AD062821-1000x200.png'
import ad2Img from '../assets/common/assets/images/ads/GCYG-ad1-1000x200.png'
import ad3Img from '../assets/common/assets/images/ads/dillweeds-1000x200.png'
import ad4Img from '../assets/common/assets/images/ads/TBF-1000x200-boaters-list.jpg'
import Location from 'native-app/components/Location'
import LogoStacked from 'common/assets/svg/logos/boasters list - stacked - color white.svg'
import Categories from 'native-app/components/Categories'
import useSearch, { Mode } from 'common/hooks/useSearch'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Input } from 'react-native-elements'
import { useIntl } from 'react-intl'
import * as WebBrowser from 'expo-web-browser'
import Search from 'native-app/components/Search'
import AllCategories from 'native-app/components/AllCategories';
import Results from 'native-app/components/Results'
import Constants from 'native-app/constants/Constants'
import * as ExpoLocation from 'expo-location';
import { useUserLocation } from 'common/hooks/useUserLocation';
import { useUserCurrentLocation } from 'common/hooks/useUserCurrentLocation';

const Stack = createNativeStackNavigator();
const RNView = View

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  return <Stack.Navigator>
    <Stack.Screen name="Search" component={Home} options={{ headerShown: false }} />
    <Stack.Screen name="Location" component={Location} />
  </Stack.Navigator>
}

const contentComponents = {
  [Mode.Home]: ModeHome,
  [Mode.Search]: Search,
  [Mode.Results]: Results,
  [Mode.AllCategories]: AllCategories
}

const ads = [
  {
    img: ad1Img,
    url: "https://www.d-dey.com/"
  },
  {
    img: ad2Img,
    url: "https://www.gulfcoastyachtgroup.com/"
  },
  {
    img: ad3Img,
    url: "https://dillweedscustomwood.com/"
  },
  {
    img: ad4Img,
    url: "https://billfish.org/become-a-member/"
  }
]

function Home({ navigation }) {
  const search = useSearch(Constants.WebAppURL)
  const userLocationHook = useUserLocation();
  const useUserCurrentLocationHook = useUserCurrentLocation();

  const getGeoLocation = async () => {
    let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      userLocationHook.addUserLocationEnabled(false);
      console.log('Permission to access location was denied');
      return;
    }
    search.setLocation("Current location");
    userLocationHook.addUserLocationEnabled(true);
    let location = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.Balanced });
    const locationGeo = [location.coords.latitude, location.coords.longitude];
    search.setGeoLocation(locationGeo);
    useUserCurrentLocationHook.addUserCurrentLocation(locationGeo);
  }

  React.useEffect(() => {
    search.setAutoSuggest(true);
    getGeoLocation();
  }, [])

  const Content = contentComponents[search.mode]
  return <View style={styles.home}>
    <View style={styles.searchHome}>
      <View style={styles.search}>
        <Content navigation={navigation} search={search} />
      </View>
    </View>
  </View>
}

function OpenURLPressable({ url, children }) {
  const handlePress = useCallback(async () => {
    const result = await WebBrowser.openBrowserAsync(url)
  }, [url])

  return <Pressable onPress={handlePress} >{children}</Pressable>
}

function ModeHome({ navigation, search }) {
  const intl = useIntl()
  const useUserCurrentLocationHook = useUserCurrentLocation();
  // const divider = ads.length;
  // const i = new Date().getHours() % divider;
  const ad1 = ads[0]
  const ad2 = ads[1]
  const ad3 = ads[2]
  const ad4 = ads[3]
  // const ad2 = ads[(i + 1) % divider]
  // const ad3 = (ads.length >= 3) ? ads[(i + 2) % divider] : null;
  // const ad4 = (ads.length >= 4) ? ads[(i + 3) % divider] : null;

  // TODO remove top Pressable when overflow click Android bug fixed in React Native: https://github.com/facebook/react-native/commit/e35a963bfb93bbbdd92f4dd74d14e2ad6df5e14a
  return <ScrollView>
    <View style={{ position: 'relative' }}>
      <ImageBackground source={background} imageStyle={{ height: 600 }} style={{ flex: 1, height: 350 }}>
        <View style={styles.backgroundView}>
          <LogoStacked width="75%" height="100%" />
        </View>
      </ImageBackground>
      <Pressable style={{ position: 'absolute', height: 30, width: '100%', bottom: 0 }} onPress={() => search.setMode(Mode.Search)} />
    </View>
    <View style={{ height: 4, backgroundColor: '#ebb112' }} />
    <View style={{ position: 'relative', backgroundColor: 'transparent' }}>
      <Categories onCategory={(category, id) => {
        if (id === "-1") {
          navigation.setParams({
            fromPage: 'home',
          });
          search.setMode(Mode.AllCategories)
        } else {
          const idParse = id.split('-');
          const currentLocation = useUserCurrentLocationHook.userCurrentLocation;
          search.doSearch(category, search.geoLocation || currentLocation, parseInt(idParse[1]), undefined, undefined, undefined, undefined, currentLocation.length > 0 ? currentLocation : undefined);
          search.setMode(Mode.Results)
        }
      }} />
      <Pressable style={{ position: 'absolute', top: -27, width: '100%' }} onPress={() => search.setMode(Mode.Search)}>
        <Input disabled={true} onPressOut={() => search.setMode(Mode.Search)}
          placeholder={intl.formatMessage({ description: 'Search placeholder', defaultMessage: 'Search for boats, marinas...' })}
          leftIcon={{ type: 'font-awesome', name: 'search', color: 'gray' }} />
      </Pressable>
    </View>

    <View style={{ height: '100%', backgroundColor: theme.colors.brandBlueDark }}>
      <OpenURLPressable url={ad1.url}>
        <RNView style={{ justifyContent: 'center', alignItems: 'center' }}><Image source={ad1.img} resizeMode="contain" style={{ width: 315, height: 73 }} /></RNView>
      </OpenURLPressable>
      <OpenURLPressable url={ad2.url}>
        <RNView style={{ justifyContent: 'center', alignItems: 'center' }}><Image source={ad2.img} resizeMode="contain" style={{ width: 315, height: 73 }} /></RNView>
      </OpenURLPressable>
      {ad3 && <OpenURLPressable url={ad3.url}>
        <RNView style={{ justifyContent: 'center', alignItems: 'center' }}><Image source={ad3.img} resizeMode="contain" style={{ width: 315, height: 73 }} /></RNView>
      </OpenURLPressable>}
      {ad4 && <OpenURLPressable url={ad4.url}>
        <RNView style={{ justifyContent: 'center', alignItems: 'center' }}><Image source={ad4.img} resizeMode="contain" style={{ width: 315, height: 73 }} /></RNView>
      </OpenURLPressable>}
    </View>
  </ScrollView>
}

const styles = StyleSheet.create({
  backgroundView: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
  },
  sectionHeading: {
    color: theme.colors.brandBlue,
    fontWeight: '700',
    backgroundColor: 'white',
    padding: 3,
  },

  searchHome: {
  },
  search: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.brandBlueDark,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  home: {
    position: 'relative',
  },
  mainImgHomeContainer: {
    position: 'relative',
    width: '100%',
    height: 500,
    zIndex: -1,
  },
  mainImg: {

  },
  resultTop: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    paddingLeft: 10,
  },
  resultTopIcon: {
    color: 'white',
    paddingRight: 10,
  },
  resultTopIconRight: {
    color: 'white',
    marginLeft: 'auto',
  },
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
  }
})
