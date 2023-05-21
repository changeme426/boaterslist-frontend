import React, { Fragment, useEffect, useState } from "react";
import Constants from "web-app/constants/Constants";
import PropTypes from "prop-types";
import Geocode from "react-geocode";
import { InputAutoComplete } from "../Forms/InputAutoComplete";
import { SubCategories } from "../../utils/classes/SubCategories";
import useSearch from "common/hooks/useSearch";
import { useUserCurrentLocation } from "common/hooks/useUserCurrentLocation";
import { useRouter } from "next/router";
import { InputSearchLocation } from "components/Forms/InputSearchLocation";
import { useGlobalUserLocation } from "common/hooks/useGlobalUserLocation";
import { usePreviousSearch } from "common/hooks/usePreviousSearch";

type LocationProps = {
  onSearch: (obj: any) => void;
  searchDefault: any;
  isMobileView?: boolean;
  customParams?: any;
};

const TOKENLOCATION = `${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
export function LocationSearch({
  onSearch,
  isMobileView,
  searchDefault,
  customParams,
}: LocationProps) {
  const search: any = useSearch(Constants.ApiURL);
  const useUserCurrentLocationHook = useUserCurrentLocation();
  const globalLocation = useGlobalUserLocation();
  const previousSearch = usePreviousSearch();
  let parsedProvider = "";
  if (searchDefault) {
    parsedProvider = searchDefault.provider
      ? typeof searchDefault.provider === "object"
        ? searchDefault.provider.title
        : searchDefault.provider
      : null;
  }
  const [provider, setProvider] = useState<any>(parsedProvider);
  const [location, setLocation] = useState({
    locationText: searchDefault ? searchDefault.location.locationText : "",
    lat: searchDefault ? searchDefault.location.lat : "",
    lng: searchDefault ? searchDefault.location.lng : "",
  });
  const router = useRouter();
  // const [subCategoriesData, setSubCategoriesData] = useState<any>([]);

  //set selection provider or location to callback function
  const onSubmit = (e?: any, dataOnClick?: SubCategories) => {
    search.setSuggested(null);
    e?.preventDefault();
    const dataSelection = dataOnClick || null;
    onSearch({
      provider: dataSelection || provider,
      location,
    });
  };
  //update provider state on autocomplete changes
  const onChangeAutoComplete = (
    data: any,
    isSelection?: boolean,
    searchKey?: boolean
  ) => {
    previousSearch.addSearch(data);
    setProvider(data);
    if (searchKey) {
      onSubmit(null, data as any);
    }
    if (isSelection) {
      if (data.group === "nearby") {
        router.push(`location/${data.data.id}`);
      } else {
        onSubmit(null, data as any);
      }
    }
  };
  //update location state on autocomplete changes
  const onChangeLocation = (data: any) => {
    const locationText = data.location;
    const locText = {
      locationText: locationText,
      lat: data.geoLocation[0],
      lng: data.geoLocation[1],
    };
    const addLocation = { ...locText };
    setLocation(addLocation);
  };

  const onLocationSelection = (location: any) => {
    if (location) {
      const locationData = {
        locationText: location?.formatted_address,
        lat: location?.geometry.location.lat(),
        lng: location?.geometry.location.lng(),
      };
      globalLocation.addUserGlobalLocation(locationData);
      setLocation(locationData);
    }
  };

  const onMyLocationSearch = (showMyLocation?: boolean) => {
    let locationData = null;
    let location = globalLocation.globalLocation;
    if (location && location.locationText && !showMyLocation) {
      locationData = {
        location: location.locationText,
        geoLocation: [location.lat, location.lng],
      };
      handleLocationSearch(locationData);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          let city: string;
          let state: string;
          let zipCode: string;
          let geoLocation: number[];
          Geocode.fromLatLng(latitude.toString(), longitude.toString())
            .then((res) => {
              if (res.results.length > 0) {
                let city = "";
                let state = "";
                let country = "";
                const r = res.results[0];
                r.address_components.forEach((ac: any) => {
                  ac.types.forEach((t: string) => {
                    switch (t) {
                      case "locality":
                        city = ac.short_name;
                        break;
                      case "administrative_area_level_2":
                        if (!city) {
                          city = ac.short_name;
                          break;
                        }
                        break;
                      case "administrative_area_level_1":
                        state = ac.short_name;
                        break;
                      case "country":
                        country = ac.short_name;
                        break;
                    }
                  });
                });
                if (country) {
                  let location = country;
                  if (state) {
                    location = state + ", " + location;
                  }
                  if (city) {
                    location = city + ", " + location;
                  }

                  locationData = {
                    location: location,
                    geoLocation: [
                      r.geometry.location.lat,
                      r.geometry.location.lng,
                    ],
                  };
                  handleLocationSearch(locationData);
                }
              }
            })
            .catch((error) => console.warn(error));
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  };

  const handleLocationSearch = (locationData: any) => {
    onChangeLocation(locationData);
    if (
      useUserCurrentLocationHook.userCurrentLocation.length === 0 &&
      router.pathname === "/search-results"
    ) {
      onSearch({
        provider: provider,
        location,
      });
    }
    const parseLocation = {
      locationText: locationData.location,
      lat: locationData.geoLocation[0],
      lng: locationData.geoLocation[1],
    };
    globalLocation.addUserGlobalLocation(parseLocation);
    useUserCurrentLocationHook.addUserCurrentLocation(locationData.geoLocation);
    search.setGeoLocation(locationData.geoLocation);
  };

  useEffect(() => {
    search.setQuery(parsedProvider);
    Geocode.setApiKey(TOKENLOCATION);
    if (
      (!searchDefault && !searchDefault?.location) ||
      (searchDefault && !searchDefault?.location) ||
      (searchDefault && !searchDefault?.location.locationText)
    ) {
      onMyLocationSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (customParams && customParams.provider) {
      // onChangeAutoComplete(customParams.provider, false, true)
      setProvider(customParams.provider);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customParams]);

  return (
    <Fragment>
      <form className="form" onSubmit={onSubmit} autoComplete="off">
        {!isMobileView && (
          <div className="locationSearch">
            <div className="autoCompleteInput">
              <div className="label">Find</div>
              <div className="autoCompleteContent">
                <InputAutoComplete
                  onSelect={onChangeAutoComplete}
                  name={"autoComplete"}
                  value={provider ? provider : ""}
                  onFocusData={(state) => {
                    search.setAutoSuggest(state);
                  }}
                  onValueChange={(value) => search.setQuery(value)}
                  placeholder={"Search for boats, marinas..."}
                  suggestions={search.suggested}
                />
              </div>
            </div>
            <div className="locationInput">
              <div className="label">Near</div>
              <div className="locationInputContent">
                <InputSearchLocation
                  onLocationSelect={onLocationSelection}
                  setValue={
                    globalLocation.globalLocation
                      ? globalLocation.globalLocation
                      : location
                  }
                  onLocationSearch={onMyLocationSearch}
                />
              </div>
            </div>
          </div>
        )}
        {isMobileView && (
          <div className="locationSearchMobile">
            <div className="autoCompleteInputMobile">
              <div className="label">Find</div>
              <div className="autoCompleteContent">
                <InputAutoComplete
                  onSelect={onChangeAutoComplete}
                  name={"autoComplete"}
                  value={provider ? provider : ""}
                  onFocusData={(state) => {
                    search.setAutoSuggest(state);
                  }}
                  onValueChange={(value) => search.setQuery(value)}
                  placeholder={"Search for boats, marinas..."}
                  suggestions={search.suggested}
                />
              </div>
            </div>
            <div className="locationInputMobile">
              <div className="label">In</div>
              <InputSearchLocation
                onLocationSelect={onLocationSelection}
                setValue={
                  globalLocation.globalLocation
                    ? globalLocation.globalLocation
                    : location
                }
                onLocationSearch={onMyLocationSearch}
              />
            </div>
          </div>
        )}
      </form>
      <style jsx>{`
        .locationSearch {
          display: flex;
          align-items: flex-end;
        }
        .locationInput {
          margin-left: 10px;
        }
        .autoCompleteInput,
        .locationInput {
          width: 100%;
          display: flex;
          align-items: baseline;
        }
        .label {
          font-size: 24px;
          font-weight: 600;
          padding-bottom: 10px;
          margin-right: 10px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
        }
        .buttonContainer {
          margin-left: 20px;
        }
        .locationInputContent,
        .autoCompleteContent {
          width: 100%;
        }

        .locationSearchMobile {
          display: block;
        }
        .locationInputMobile {
          margin-left: 0px;
          margin-bottom: 20px;
        }
        .buttonContainerMobile {
          margin: 0px;
        }
        .autocompleteinputmobile: {
          display: block;
        }
        .subtitle {
          margin-top: 0px;
        }
        .claimNewBusiness {
          text-align: left;
          padding-top: 10px;
        }

        @media screen and (max-width: 750px) {
          .locationSearch {
            display: block;
          }
          .locationInput {
            margin-left: 0px;
            margin-bottom: 20px;
          }
          .btn {
            width: 100%;
          }
          .buttonContainer {
            margin: 0px;
          }
          .label {
            display: none;
          }
          .autoCompleteContent {
            margin-bottom: 10px;
          }
          .subtitle {
            color: white;
          }
          .claimNewBusiness {
            padding-top: 0;
          }
        }
      `}</style>
    </Fragment>
  );
}

LocationSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
  isMobileView: PropTypes.bool,
  searchDefault: PropTypes.object,
};

LocationSearch.defaultProps = {
  isMobileView: false,
  searchDefault: null,
};
