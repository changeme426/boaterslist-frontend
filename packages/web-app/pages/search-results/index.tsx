import React, { useEffect, useState } from "react";
import theme from "../../../common/theme";
import { LocationSearch } from "web-app/components/LocationSearch/LocationSearch";
import Button from "../../components/Buttons/Button";
import { SearchResultsList } from "web-app/components/SearchResults/SearchResultsList";
import { useRouter } from "next/router";
import { ISearchData } from "web-app/utils/interfaces/ISearchData";
import { SearchResultsMap } from "web-app/components/SearchResults/ResultsMap/SearchResultsMap";
import { useRecoilValue } from "recoil";
import { locationsCoordinates } from "common/atoms/locationsState";
import { useMediaQuery } from 'usehooks-ts';
import { NextPageContext } from "next";

export const getServerSideProps: any = async (context: NextPageContext) => {
  {
    const { query } = context;
    return { props: { query } };
  }
}

export default function SearchResults({ query }: any) {
  const router = useRouter();
  const [claimedParameters, setClaimedParameters] = useState(null)
  const matches = useMediaQuery('(max-width: 992px)');

  //function to validate if the string passed is an object stringified or string
  const isStringified = (str: string) => {
    try {
      return JSON.parse(str);
    } catch (err) {
      return str;
    }
  };
  let searchCriteriaProvider = null;
  let searchCriteriaLocation = {
    city: "",
    state: "",
    zipCode: "",
    locationTerms: "",
  };
  let isSearchDefault = null;
  if (router.query && (router.query.provider || router.query.location)) {
    const parsedProvider = isStringified(router.query.provider as any);
    searchCriteriaProvider = parsedProvider;
    searchCriteriaLocation = JSON.parse(router.query.location as string);
    isSearchDefault = {
      provider: searchCriteriaProvider,
      location: searchCriteriaLocation,
    };
  }

  const [tab, setTab] = useState(1);
  const [searchCriteria, setSearchCriteria] = useState<ISearchData>({
    provider: searchCriteriaProvider,
    location: searchCriteriaLocation,
  });

  const handleSearch = (data: ISearchData | any) => {
    setSearchCriteria({ ...data });
  };
  const locationsCoord = useRecoilValue(locationsCoordinates);

  const onModifySearch = () => {
    router.push(
      {
        pathname: "/",
        query: {
          provider: JSON.stringify(searchCriteria.provider),
          location: JSON.stringify(searchCriteria.location),
        },
      }
    );
  }

  useEffect(() => {
    if (query.claimedBusiness) {
      setClaimedParameters({ provider: query.provider } as any)
      handleSearch({ provider: query.provider, location: JSON.parse(query.location) })
    }
  }, [query])


  return (
    <div className="searchResults">
      <div className="searchLocationResults">
        {matches ? <div className="locationButton">
          <Button
            style={{
              backgroundColor: `${theme.colors.brandBlue}`,
              color: `${theme.colors.brandWhite}`,
            }}
            onClick={onModifySearch}
            title="Modify Search" />
        </div> :
          <div className="locationForm">
            <LocationSearch
              customParams={claimedParameters}
              searchDefault={isSearchDefault ? isSearchDefault : null}
              onSearch={handleSearch} />
          </div>}
      </div>

      {matches ?
        <div className="searchResultsMobile">
          <div className="tabSelection">
            <span
              className={tab === 0 ? "map active" : "map"}
              onClick={() => setTab(0)}>
              Map
            </span>
            <span
              className={tab === 1 ? "list active" : "list"}
              onClick={() => setTab(1)}>
              List
            </span>
          </div>
          {tab === 0 ? (
            <div className="searchResultsMap">
              <SearchResultsMap locationsCoord={locationsCoord} />
            </div>
          ) : null}
          {tab === 1 ? (
            <div className="searchResultsLists">
              <SearchResultsList searchCriteria={searchCriteria} />
            </div>
          ) : null}
        </div> :
        <div className="searchResultsDesktop">
          <div className="searchResultsContent">
            <div className="searchResultsLists">
              <SearchResultsList searchCriteria={searchCriteria} />
            </div>
            <div className="searchResultsMap">
              <SearchResultsMap locationsCoord={locationsCoord} />
            </div>
          </div>
        </div>
      }

      <style jsx>{`
        .searchResultsContent {
          display: flex;
          flex-direction: row;
          max-width: 900px;
          margin: auto;
        }
        .searchResultsLists,
        .searchResultsMap {
          display: flex;
          padding: 15px;
          flex: 1;
        }
        .searchResultsMap {
          height: ${theme.searchResults.resultsMapHeight}px;
        }
        .searchLocationResults {
          padding: 20px 20px 10px 20px;
          box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px 0px;
          margin-bottom: 15px;
        }
        .locationButton {
          width: 150px;
        }
        .tabSelection {
          text-align: center;
          margin: auto;
          margin-top: 50px;
        }
        .map,
        .list {
          background-color: ${theme.colors.brandLightGray};
          width: 100%;
          padding: 10px 50px 10px 50px;
          cursor: pointer;
        }
        .map {
          border-radius: 20px 0 0 20px;
        }
        .list {
          border-radius: 0 20px 20px 0;
        }
        .active {
          background-color: ${theme.colors.brandBlack};
          color: ${theme.colors.brandWhite};
        }
      `}</style>
    </div>
  );
}
