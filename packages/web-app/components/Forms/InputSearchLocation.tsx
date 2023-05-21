import theme from "common/theme";
import React, { useState, useEffect, useRef } from "react";
import { FaLocationArrow } from "react-icons/fa";
import { Input } from "./Input";

let autoComplete: any;

const loadScript = (url: string, callback: any) => {
  let script: any = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(
  updateQuery: any,
  autoCompleteRef: any,
  onLocationSelect: any
) {
  autoComplete = new (window as any).google.maps.places.Autocomplete(
    autoCompleteRef.current
  );
  autoComplete.setFields([
    "address_components",
    "formatted_address",
    "geometry",
  ]);
  autoComplete.addListener("place_changed", () => {
    handlePlaceSelect(updateQuery, onLocationSelect);
  });
}

async function handlePlaceSelect(updateQuery: any, onLocationSelect: any) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.formatted_address;
  if (query) {
    updateQuery(query);
    onLocationSelect(addressObject);
  } else {
    onLocationSelect("");
  }
}

type inputSearchProps = {
  onLocationSelect: (obj: any) => void;
  onLocationSearch?: (obj: any) => void;
  setValue?: any;
  startValue?: any;
  resetField?: boolean;
};

export function InputSearchLocation({
  onLocationSearch,
  startValue,
  setValue,
  onLocationSelect,
  resetField,
}: inputSearchProps) {
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      handleScriptLoad(setQuery, autoCompleteRef, onLocationSelect);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setQuery("");
  }, [resetField]);

  useEffect(() => {
    if (setValue) {
      setQuery(setValue.locationText || "");
    }
  }, [setValue]);

  //TODO FIX default value passed by parameter
  useEffect(() => {
    if (startValue) {
      setQuery(startValue.locationText || "");
    }
  }, []);

  const onFocusInputLocation = (focused: boolean, e: any) => {
    if (focused) {
      e.target.select();
    }
  };

  return (
    <div className="search-location-input">
      <Input
        value={query}
        placeholder={"Enter location"}
        inputRef={autoCompleteRef}
        onFocus={onFocusInputLocation}
        onChange={(event: any) => setQuery(event.target.value)}
        icon={
          onLocationSearch ? (
            <FaLocationArrow
              style={{
                fontSize: "20px",
                color: `${theme.colors.brandBlue}`,
              }}
            />
          ) : null
        }
        onIconPress={
          onLocationSearch
            ? () => {
                onLocationSearch({ showMyLocation: true });
              }
            : () => {}
        }
      />
    </div>
  );
}
