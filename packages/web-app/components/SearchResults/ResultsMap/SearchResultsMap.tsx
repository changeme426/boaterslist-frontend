import React, { useEffect } from "react";
import GoogleMapReact from "google-map-react";
import PropTypes from "prop-types";
import theme from "common/theme";
import { Marker } from "./Marker";
import { Locations } from "../../../utils/classes/Locations";
import { FaLocationArrow } from "react-icons/fa";

type Props = {
  locationsCoord: Locations[];
  showDirections?: boolean;
};

export function SearchResultsMap({ locationsCoord, showDirections }: Props) {
  let locations: any[] = [];

  if (locationsCoord) {
    locations = [...locationsCoord];
  }

  const [center, setCenter] = React.useState({
    lat: 39.8283459,
    lng: -98.5816684,
  });

  const NodeMarker: React.FC = (props: any) => {
    return <div style={props.style}>{props.children}</div>;
  };

  function displayLocations() {
    if (locations.length > 0) {
      return locations
        // .sort((a: any, b: any) => a.source.coordinate?.lon - b.source.coordinate?.lon)
        .map((l: any, i: number) => {
          if (typeof l.source.coordinate === "object" && l.source.coordinate) {
            return (
              <NodeMarker // Have to ignore this because lat and lng are applied by GoogleMapReact
                // @ts-ignore
                lat={l.source.coordinate.lat}
                lng={l.source.coordinate.lon}
                // @ts-ignore
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translate(-50%, -100%)",
                  // only works if info box up shows up on top. (lower pins box shows above higher pins)
                  zIndex: 0,
                }}
                className="markerIDClass"
                key={l.source.locationId}
              >
                <Marker {...{ l, setCenter }} />
              </NodeMarker>
            );
          }
        });
    }
  }

  const onDirectionsClick = () => {
      window.open("https://maps.google.com?q="+center.lat+","+center.lng, '_blank');
  };

  useEffect(() => {
    if (locations.length > 0) {
      const locationsWithCord = locations.filter(
        (l: any) => l.source.coordinate && l.source.coordinate.lon !== 0
      );
      if (locationsWithCord.length) {
        setCenter({
          lat: locationsWithCord[0].source.coordinate.lat,
          lng: locationsWithCord[0].source.coordinate.lon,
        });
      }
    }
    // TODO should this be disabled?
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationsCoord]);

  if (locations.length > 0) {
    return (
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <GoogleMapReact
          defaultCenter={{ lat: 30, lng: 30 }}
          center={center}
          defaultZoom={11}
        >
          {displayLocations()}
        </GoogleMapReact>
        {showDirections && <div onClick={onDirectionsClick} className="directions"><FaLocationArrow
          style={{
            fontSize: "10px",
            color: `${theme.colors.brandWhite}`,
          }}
        /> Directions</div>}

        <style jsx>
          {`
              .directions{
                position: absolute;
                bottom: 20px;
                right: 60px;
                background-color: ${theme.colors.brandBlue};
                color:${theme.colors.brandWhite};
                padding:5px;
                border-radius: 20px;
                cursor:pointer;
              }
              @media screen and (max-width: 450px) {
                .directions{
                  right: 20px
                }
              }
          `}
        </style>
      </div>
    );
  }
  return null;
}
