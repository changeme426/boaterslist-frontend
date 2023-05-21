import log from 'common/global/log'
import React from 'react'
import * as categories from 'common/global/categories'
import { useDebounce } from 'use-debounce'
import { useLocations } from './useLocations'
import { Locations } from 'common/models/Locations'
import { useUserCurrentLocation } from './useUserCurrentLocation'

export enum Mode {
  Home = 0,
  Search,
  Results,
  AllCategories,
}

interface ResultItem {
}

interface ResultGroup {
  id: string
  title: string
  data: ResultItem[]
  offset: number
  total: number
  more: boolean
}

function getParams(query: string, geo: number[], category?: number, subCategory?: number,
  skip?: number, top?: number, userLocation?: number[], more?: boolean, inactive?: boolean): URLSearchParams {
  let q = new URLSearchParams()
  if (!category && !subCategory) {
    q.append('q', query)
  }
  if (geo[0]) {
    q.append('lat', `${geo[0]}`)
  }
  if (geo[1]) {
    q.append('lon', `${geo[1]}`)
  }
  if (userLocation) {
    if (userLocation[0]) {
      q.append('ulat', `${userLocation[0]}`)
    }
    if (userLocation[1]) {
      q.append('ulon', `${userLocation[1]}`)
    }
  }
  if (category && !subCategory) {
    q.append('c', `${category}`)
  }
  if (subCategory) {
    q.append('sc', `${subCategory}`)
  }
  if (skip) {
    q.append('$skip', `${skip}`)
  }
  if (top) {
    q.append('$top', `${top}`)
  }
  if (more) {
    q.append('$wide', '1')
  }
  if (inactive) {
    q.append('inactive', '1')
  }
  // TODO NOW q.append('$wide', '0')
  return q
}

export default function useSearch(url: string) {
  const CURRENT_LOCATION_TEXT = 'Current location'
  const [controller, setController] = React.useState<AbortController>()
  const [autoSuggest, setAutoSuggest] = React.useState(false)
  const [mode, setMode] = React.useState(Mode.Home)
  const [location, setLocation] = React.useState<string>(CURRENT_LOCATION_TEXT)
  const [geoLocation, setGeoLocation] = React.useState<Array<number>>([])
  const [requestDoSearch, setRequestDoSearch] = React.useState<any>(null);
  const [query, setQuery] = React.useState("")
  const [debouncedQuery] = useDebounce(query, 1000, { leading: true })
  const [result, setResult] = React.useState<ResultGroup[]>()
  const [suggested, setSuggested] = React.useState<ResultGroup[]>()
  const [locationDetail, setLocationDetail] = React.useState<Locations>();
  const locationsHook = useLocations();
  const useUserCurrentLocationHook = useUserCurrentLocation()

  React.useEffect(() => {
    if (autoSuggest) {
      if (controller) {
        controller.abort()
      }
      const c = new AbortController()
      setController(c)
      fetch(`${url}/api/suggest?${getParams(query, geoLocation, 0, 0)}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
        signal: c.signal,
      }).then(response => response.json())
        .then(result => {
          setSuggested(result)
        }).catch(err => {
          if (err.name != 'AbortError') {
            log.error(err)
          }
        })
    }
  }, [debouncedQuery, location, autoSuggest, geoLocation])

  React.useEffect(() => {
    if (requestDoSearch) {
      doSearch(requestDoSearch.query || "", requestDoSearch.geo.length > 0 ? requestDoSearch.geo : geoLocation,
        requestDoSearch.category || null, requestDoSearch.subCategory || null);
      setRequestDoSearch(null);
    }
  }, [geoLocation])


  let doSearch = function (query: string, geo: number[], category?: number, subCategory?: number,
    skip?: number, top?: number, filterId?: string, userLocation?: number[], more?: boolean, inactive?: boolean): any {
    setQuery(query)
    if (query) {
      const qq = categories.getCategoryByName(query)
      if (qq) {
        if (qq.subCategoryId) {
          category = undefined
          subCategory = parseInt(qq.subCategoryId)
          query = ""
        } else if (qq.categoryId) {
          category = parseInt(qq.categoryId)
          subCategory = undefined
          query = ""
        }
      }
    }
    if (controller) {
      controller.abort()
    }
    const c = new AbortController()
    if (geoLocation.length > 0 || geo.length > 0) {
      const q = getParams(query, geo, category, subCategory, skip, top, userLocation, more, inactive)
      fetch(`${url}/api/search?${q}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
        signal: c.signal,
      }).then(response => response.json())
        .then(result => {
          let r = result
          if (filterId) {
            r = doFilter(result, filterId)
          }
          if (r && r.length > 0) {
            r[0].more = more
          }
          setResult(r);
          locationsHook.addLocations(r);
        }).catch(err => {
          if (err.name != 'AbortError') {
            log.error(err)
          }
        })
    } else {
      // TODO improve this logic
      setRequestDoSearch({ query, geo, category: category || null, subCategory: subCategory || null })
    }
  }

  let getLocationDetail = function (id: string) {
    fetch(`${url}/api/location/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    }).then(response => response.json())
      .then(result => {
        setLocationDetail(result)
      }).catch(err => {
        if (err.name != 'AbortError') {
          log.error(err)
        }
      })
  }

  let saveLocationDetail = async function (loc: any) {
    if (locationDetail == null) {
      return
    }
    const options = {
      method: 'PUT',
      body: JSON.stringify(loc),
      headers: { 'Content-Type': 'application/json' },
    }
    let fr = await fetch(`/api/admin/location/${locationDetail.locationId}`, options)
    let r = await fr.json()
    console.log(r)
  }

  let newLocationDetail = async function (loc: any) {
    const options = {
      method: 'POST',
      body: JSON.stringify(loc),
      headers: { 'Content-Type': 'application/json' },
    }
    let fr = await fetch(`/api/admin/location`, options)
    let r = await fr.json()
    return r
  }


  return {
    autoSuggest: autoSuggest,
    setAutoSuggest: setAutoSuggest,
    mode: mode,
    setMode: setMode,
    location: location,
    setLocation: setLocation,
    requestDoSearch: requestDoSearch,
    setRequestDoSearch: setRequestDoSearch,
    geoLocation: geoLocation,
    setGeoLocation: setGeoLocation,
    locationDetail: locationDetail,
    setLocationDetail: setLocationDetail,
    query: query,
    setQuery: setQuery,
    result: result,
    setResult: setResult,
    suggested: suggested,
    setSuggested: setSuggested,
    getLocationDetail: getLocationDetail,
    saveLocationDetail: saveLocationDetail,
    newLocationDetail: newLocationDetail,
    doSearch: doSearch,
  }
}

function doFilter(r: any, id: string): any {
  if (r.length == 0 || r[0].data.length == 0) {
    return r
  }
  let newData: string[] = []
  r[0].data.forEach((loc: any) => {
    if (loc.id != id) {
      newData.push(loc)
    }
  })
  // TODO warning rebuilds a simpler one group result
  const newr = [{
    data: newData,
    id: r[0].id,
    title: r[0].title,
    total: r[0].total,
  }] as any
  return newr
}
