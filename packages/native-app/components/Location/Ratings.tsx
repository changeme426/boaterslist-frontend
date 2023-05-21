import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Icon, Divider } from 'react-native-elements'
import theme from 'common/theme'


export default function Ratings() {

  const userRating = [{
    userName: 'User 1',
    date: 'Jul 20, 2021',
    comment: 'Amazing service'
  },
  {
    userName: 'User 2',
    date: 'Sep 2, 2021',
    comment: 'Great service'
  },
  {
    userName: 'User 3',
    date: 'Jan 24, 2021',
    comment: 'Amazing service'
  },
  {
    userName: 'User 4',
    date: 'Sep 4 20, 2021',
    comment: 'Great service'
  },
  {
    userName: 'User 5',
    date: 'Dec 8, 2021',
    comment: 'Amazing service'
  }];

  return <View >
    <View style={styles.ratingContainer}>
      <View><Text style={styles.ratingNumber}>4.3</Text></View>
      <View style={styles.ratingIcons}>
        <Icon style={styles.iconStyles} type="font-awesome" name="anchor" size={20} color={theme.colors.brandBlue} />
        <Icon style={styles.iconStyles} type="font-awesome" name="anchor" size={20} color={theme.colors.brandBlue} />
        <Icon style={styles.iconStyles} type="font-awesome" name="anchor" size={20} color={theme.colors.brandBlue} />
        <Icon style={styles.iconStyles} type="font-awesome" name="anchor" size={20} color={theme.colors.brandBlue} />
        <Icon style={styles.iconStyles} type="font-awesome" name="anchor" size={20} color={theme.colors.brandLightGray} />
      </View>
      <View><Text style={styles.userRatingDate}>5 Ratings</Text></View>
    </View>
    <View>
      <Divider />
      {userRating.map((user, idx) => <View key={idx}>
        <View style={styles.userRatingContainer}>
          <View style={styles.userIcon}><Icon type="font-awesome" name="user-circle" size={40} color={theme.colors.brandGray} /></View>
          <View>
            <View><Text style={styles.userRatingData}>{user.userName}</Text></View>
            <View><Text style={[styles.userRatingData, styles.userRatingDate]}>{user.date}</Text></View>
            <View><Text style={styles.userRatingData}>{user.comment}</Text></View>
          </View>
        </View>
        <Divider />
      </View>)}
    </View>
  </View>
}

const styles = StyleSheet.create({
  ratingContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5
  },
  ratingNumber: {
    fontSize: 25
  },
  userRatingDate: {
    color: theme.colors.brandGray
  },
  iconStyles: {
    marginLeft: 5
  },
  userRatingData: {
    marginBottom: 2
  },
  ratingIcons: {
    marginLeft: 5,
    marginRight: 5,
    display: 'flex',
    flexDirection: 'row'
  },
  userRatingContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 5,
    paddingRight: 0,
    paddingLeft: 0
  },
  userIcon: {
    paddingRight: 10
  }
});
