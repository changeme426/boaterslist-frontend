import React, { useCallback, useState } from 'react'
import { Text, View, StyleSheet, Pressable, ScrollView, SectionList } from 'react-native'
import theme from 'common/theme'
import { getAllCategories } from 'common/global/categories';
import { Divider, Icon } from 'react-native-elements';
import { Mode } from 'common/hooks/useSearch';
import { useUserCurrentLocation } from 'common/hooks/useUserCurrentLocation';


export default function AllCategories({ navigation, search }) {
  const allCategories = getAllCategories();
  const userLocationHook = useUserCurrentLocation();
  const categories = allCategories.map(cat => ({
    title: cat.categoryName,
    category: cat,
    data: cat.subCategories
  }));

  const onBackClick = () => {
    if (navigation.getState().routes[0].params.fromPage === 'home') {
      search.setMode(Mode.Home);
    } else {
      search.setMode(Mode.Search);
    }
  }

  const onCategoryClick = (category, type) => {
    const query = (type === 'category') ? category.categoryName : category.subCategoryName;
    const subCategoryId = (type === 'subcategory') ? parseInt(category.subCategoryId) : null;
    search.setLocation(search.location)
    search.doSearch(query, search.geoLocation || userLocationHook.userCurrentLocation, parseInt(category.categoryId), subCategoryId, undefined, undefined, undefined, userLocationHook.userCurrentLocation.length > 0 ? userLocationHook.userCurrentLocation : undefined);
    search.setMode(Mode.Results)
  }

  const RenderItem = useCallback(
    ({ item }) => {
      return <View style={styles.itemContainer}>
        <Pressable onPress={() => onCategoryClick(item, 'subcategory')}><Text style={styles.subCategoryText}>{item.subCategoryName}</Text></Pressable>
      </View>
    }, []
  );

  const RenderCategoryHeader = useCallback(({ section: { title, category } }) => {
    return <>
      {category.categoryId !== "1" && <View style={styles.dividerStyle}><Divider width={2} color={theme.colors.brandLightGray} /></View>}
      <View style={styles.headerContainer}><Pressable onPress={() => onCategoryClick(category, 'category')}><Text style={styles.categoryText} key={category.categoryId}>{title}</Text></Pressable></View>
    </>
  }, []
  );

  const KeyExtractor = useCallback((item, idx) => item.subCategoryId + idx.toString(), []);

  return <View style={styles.container}>
    <View style={styles.allServices}>
      <View style={styles.backIconContainer}>
        <Pressable onPress={onBackClick}>
          <Icon style={{ paddingTop: 5, paddingBottom: 5 }} color='white' type="font-awesome" name="arrow-left" />
        </Pressable>
      </View>
      <View style={styles.serviceTextContainer}>
        <Text style={styles.allServicesText}>All Services</Text>
      </View>
    </View>
    <SectionList style={styles.sectionList} sections={categories}
      keyExtractor={KeyExtractor}
      renderItem={RenderItem}
      renderSectionHeader={RenderCategoryHeader}
    />
  </View>
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    position: 'relative',
    paddingBottom: 50
  },
  serviceTextContainer: {
    position: 'absolute',
    left: '40%'
  },
  allServicesText: {
    color: theme.colors.brandWhite,
    fontSize: 15
  },
  backIconContainer: {
    display: 'flex',
    paddingLeft: 10,
    justifyContent: 'flex-start'
  },
  allServices: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: theme.colors.brandBlueDark
  },
  categoryText: {
    color: theme.colors.brandBlue,
    fontWeight: 'bold',
    fontSize: 16
  },
  subCategoryText: {
    color: theme.colors.brandBlack,
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 3,
    marginBottom: 3
  },
  itemContainer: {
    marginLeft: 20,
  },
  headerContainer: {
    marginLeft: 5,
    backgroundColor: theme.colors.brandWhite
  },
  dividerStyle: {
    margin: 3
  },
  sectionList: {
    backgroundColor: 'white',
    position: 'relative',
    width: '100%',
  }
});
