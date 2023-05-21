import React from 'react'
import { Text, View } from 'react-native'
import { getSubCategory } from "common/global/categories"


export default function Services({ location }) {
  const displayServices = () => {
    const services: string[] = [];
    if (location.subCategories?.length > 0) {
      location.subCategories.forEach((c: any) => {
        const sc = getSubCategory(c)
        if (sc) {
          services.push(getSubCategory(c).subCategoryName)
        }
      });
    };
    return services.length > 0 ? <Text>{services.join(', ')}</Text> : ""
  }
  return <View >
    <Text>{displayServices()}</Text>
  </View>
}
