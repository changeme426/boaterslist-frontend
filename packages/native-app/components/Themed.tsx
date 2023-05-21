/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, TextInput as DefaultTextInput, View as DefaultView, StyleSheet, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import theme from 'common/theme'
import { FontAwesome5 } from '@expo/vector-icons';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
  icon?: string;
  iconPress?: any;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: theme.colors.brandLightGray,
    fontSize: 18,
    fontWeight: "300",
    padding: 14,
    paddingLeft: 35,
    width: '100%',
    backgroundColor: '#ffffff'
  },
  iconInputView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconTouch: {
    padding: 10,
    position: 'absolute',
    left: 0,
    top: 5,
  },
  icon: {
    color: '#ccc'
  },
})

export function TextInput(props: TextProps) {
  const { style, lightColor, darkColor, icon, iconPress, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  if (icon) {
    return <View style={styles.iconInputView}>
      <DefaultTextInput style={[styles.input, { color }, style]} {...otherProps} />{iconPress ?
        <TouchableOpacity style={styles.iconTouch} onPress={iconPress}>
          <FontAwesome5 style={styles.icon} size={20} name={icon} />
        </TouchableOpacity> :
        <FontAwesome5 style={[styles.icon,styles.iconTouch]} size={20} name={icon} />}
    </View>
  }
  return <DefaultTextInput style={[styles.input, { color }, style]} {...otherProps} />
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
