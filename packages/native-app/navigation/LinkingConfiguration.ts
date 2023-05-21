/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { getStateFromPath, LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  getStateFromPath: (path, options) => {
    // TODO Android workaround - redirect to profile page
    const newPath = path.startsWith('expo-auth-session') ? '/me' : path
    return getStateFromPath(newPath, options)
  },
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              Home: 'home',
            },
          },
          Me: {
            screens: {
              SearchScreen: 'me',
            },
          },
          Marketplace: {
            screens: {
              SearchScreen: 'marketplace',
            },
          },
          More: {
            screens: {
              MoreScreen: 'more',
            },
          },
        },
      },
      Modal: 'modal',
      NotFound: '*',
    },
  },
};

export default linking;
