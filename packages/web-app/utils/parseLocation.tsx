export function getAddressComponents(aca: any) {
  let address1 = ""
  let city = ""
  let state = ""
  let country = ""
  let zipCode = ""
  if (aca) {
    aca.forEach((ac: any) => {
      ac.types.forEach((t: string) => {
        switch (t) {
          case 'street_number':
            address1 = ac.short_name
            break
          case 'route':
            address1 += (address1 ? ' ' : '') + ac.short_name
            break
          case 'locality':
            city = ac.short_name
            break
          case 'administrative_area_level_2':
            if (!city) {
              city = ac.short_name
              break
            }
            break
          case 'administrative_area_level_1':
            state = ac.short_name
            break
          case 'country':
            country = ac.short_name
            break
          case 'postal_code':
            zipCode = ac.short_name
            break
        }
      })
    })
  }
  return { address1, city, state, country, zipCode }
}
