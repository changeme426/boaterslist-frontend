import React, { useCallback, useEffect, useRef, useState } from "react";
import Constants from 'web-app/constants/Constants'
import { SingleLocation } from "./SingleLocation";
import useSearch from 'common/hooks/useSearch';
import { VariableSizeList as List } from "react-window";
import { useDebouncedCallback } from 'use-debounce'
import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";
import { useWindowResize } from "web-app/lib/useWindowResize";
/// <reference path="../../lib/react-window-scroller.d.ts" />
import { ReactWindowScroller } from 'react-window-scroller';
import { useUserCurrentLocation } from "common/hooks/useUserCurrentLocation";
import { useRouter } from "next/router";

type PropsType = {
  searchCriteria: any;
  resultsPerPage?: number;
};

const RowResult = ({ data, index, setSize, windowWidth, settingResults }: any) => {
  const rowRef: any = useRef();
  const router = useRouter()

  React.useEffect(() => {
    if (settingResults) {
      setSize(index, rowRef.current.getBoundingClientRect().height);
    }
  }, [setSize, windowWidth, settingResults]);

  return (
    <div ref={rowRef}>
      {data[index] ?
        <>
          <SingleLocation location={data[index].source} />
        </> :
        <ReactPlaceholder showLoadingAnimation ready={false} type="text" rows={4}>
        </ReactPlaceholder>
      }
      <hr />
    </div>
  )
}

export function SearchResultsListV({
  searchCriteria,
  resultsPerPage,
}: PropsType) {
  const useUserCurrentLocationHook = useUserCurrentLocation();
  const search = useSearch(Constants.ApiURL);
  const maxArraylength = 499;
  const [virtualResults, setVirtualResults] = useState<any>(new Array(maxArraylength));
  const [totalResults, setTotalResults] = useState(0)
  const [isSettingResults, setIsSettingResults] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [position, setPosition] = useState({ offset: 0, limit: 25 });
  const debounced = useDebouncedCallback((value) => { setPosition(value) }, 800);
  const [height, setHeight] = useState(0);

  const listRef: any = useRef();

  useEffect(() => {
    if (search.result && search.result[0]['data'] && search.result[0]['data'].length > 0) {
      console.log(search.result, "RES")
      updateVirtualizedList(search.result[0]['data']);
    }
  }, [search.result]);

  useEffect(() => {
    setHeight(window.innerHeight)
  });

  useEffect(() => {
    let query: string;
    let category = 0
    let subCategory = 0
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
    search.doSearch(query, geo, category, subCategory, position.offset, position.limit, undefined, currentUserLocation.length > 0 ? currentUserLocation : undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCriteria, position])

  const updateVirtualizedList = (data: any) => {
    setIsSettingResults(false);
    const virtualList = [...virtualResults];
    const positionOffset = position.offset;
    for (let index = 0, indx = positionOffset; index < data.length; index++, indx++) {
      if (!virtualList[indx]) {
        virtualList[indx] = data[index];
      }
    }
    setVirtualResults(virtualList);
    setIsSettingResults(true);
  }

  const sizeMap: any = useRef({});
  const setSize = useCallback((index, size) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current.resetAfterIndex(index);
  }, []);

  const getSize = (index: number) => sizeMap.current[index] || 50;
  const [windowWidth] = useWindowResize();

  const refHandler = (mainRef: any, ref1: any, ref2: any) => {
    ref1.current = mainRef;
    ref2.current = mainRef;
  }

  const displayLocations = () => {
    // TODO use first group for now
    return <div style={{ maxWidth: 300 }}>
      <ReactWindowScroller>
        {({ ref, outerRef, style, onScroll }: any) => (
          <List
            ref={(el: any) => refHandler(el, ref, listRef)}
            height={height}
            outerRef={outerRef}
            style={style}
            width={300}
            itemCount={virtualResults.length}
            itemSize={getSize}
            itemData={virtualResults}
            onItemsRendered={({ overscanStartIndex, overscanStopIndex }: any) => {
              let overScanStop = overscanStopIndex;
              if ((overscanStopIndex + 1) === totalResults) {
                overScanStop++;
              }
              debounced({ offset: overscanStartIndex, limit: overScanStop })
            }}
            onScroll={onScroll}
          >
            {({ data, index, style }: any) => (
              <div style={style}>
                <RowResult
                  data={data}
                  index={index}
                  setSize={setSize}
                  settingResults={isSettingResults}
                  windowWidth={windowWidth}
                />
              </div>
            )}
          </List>
        )}
      </ReactWindowScroller>
    </div>
  }

  return (
    <div className="SearchResultsContainer">
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
  );
}
