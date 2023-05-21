import React, { useEffect } from "react";
import Constants from 'web-app/constants/Constants'
import { SingleLocation } from "./SingleLocation";
import { useUserCurrentLocation } from "common/hooks/useUserCurrentLocation";
import { useInactiveLocations } from "common/hooks/useInactiveLocations"
import useSearch from 'common/hooks/useSearch';
import { useRouter } from "next/router";


type PropsType = {
  searchCriteria: any;
  resultsPerPage?: number;
};

export function SearchResultsList({
  searchCriteria,
  resultsPerPage,
}: PropsType) {
  const useUserCurrentLocationHook = useUserCurrentLocation()
  const inactiveLocations = useInactiveLocations()
  const search = useSearch(Constants.ApiURL)
  const MAXSIZE = 50
  const router = useRouter()

  useEffect(() => {
    doSearch(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCriteria])

  function doSearch(more: boolean, offset?: number) {
    let query: string;
    let category = 0
    let subCategory = 0
    const inactiveLoc = inactiveLocations.isInactive
    if (searchCriteria.provider === null) {
      query = "";
    } else if (typeof searchCriteria.provider === 'object') {
      if (searchCriteria.provider.id && searchCriteria.provider.id.includes('s-')) {
        const idParse = searchCriteria.provider.id;
        const sa = idParse.split('-')
        if (sa.length == 3) {
          subCategory = parseInt(sa[2])
        } else if (sa.length == 2) {
          category = parseInt(sa[1])
        }
      }
      query = searchCriteria.provider.title;
    } else {
      query = searchCriteria.provider;
    }
    let geo: number[] = []
    if (searchCriteria.location) {
      geo = [searchCriteria?.location.lat, searchCriteria?.location.lng]
    }
    const currentUserLocation = useUserCurrentLocationHook.userCurrentLocation;
    search.doSearch(query, geo, category, subCategory, offset ? offset : 0, 50, undefined,
      currentUserLocation.length > 0 ? currentUserLocation : undefined, more, inactiveLoc)
  }

  const displayLocations = () => {
    // TODO use first group for now
    const locs = (search.result && search.result.length) ? search.result[0].data : []
    let total: number = 0
    let offset: number = 0
    if (search.result && search.result.length) {
      total = search.result[0].total
      offset = search.result[0].offset
    }
    return <div className="Locations">
      {locs.map((loc: any, iloc: number) => {
        return <div key={iloc} className="locationItem">
          <SingleLocation location={loc} />
          <hr />
        </div>
      })}
      {(!search.result || search.result.length == 0 || (offset == 0 && locs.length < MAXSIZE)) ?
        <div>Want more results? Try a different search or<br />click <a className="boatersListEmailFormat" href="#"
          onClick={() => doSearch(true)}>here</a> to expand your search area.</div>
        : (search.result && search.result.length && search.result[0].offset + locs.length < total) ?
          <div>Click <a className="boatersListEmailFormat" href="#"
            onClick={() => doSearch(search.result ? search.result[0].more : false,
              search.result ? search.result[0].offset + 50 : 0)}>here</a> to see more results.</div>
          : null
      }
      <style jsx>{`
        .claim {
          text-align: right;
        }
      `}</style>
    </div>
  }

  function getTotal(searchResult: any): any {
    // TODO use first group for now
    return searchResult ? searchResult[0].total : null
  }

  return <div className="SearchResultsContainer">
    <div className="title">Search Results</div>
    {search.result && displayLocations()}
    <style jsx>{`
        .SearchResultsContainer {
          width: 100%;
        }
        .title {
          font-size: 24px;
          padding-bottom: 30px;
        }
      `}</style>
  </div>
}
