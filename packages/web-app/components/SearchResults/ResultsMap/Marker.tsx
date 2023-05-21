import React from "react";
import Link from "next/link";
import { MdLocationOn } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import theme from "../../../../common/theme";

type Props = {
  l: any;
  setCenter: (obj: any) => void;
};

export function Marker({ l, setCenter }: Props) {
  const [show, setShow] = React.useState(false);

  const renderDetails = () => {
    return (
      <div
        className="infoContainer"
        style={{
          position: "absolute",
          top: -100,
          left: -55,
          width: 200,
          height: 100,
          borderRadius: 20,
          backgroundColor: "white",
          boxShadow: "0 3px 6px 0 rgba(0, 0, 0, 0.16)",
          padding: 14,
          overflow: "hidden",
          overflowY: "auto",
        }}
      >
        <div
          className="infoHeader"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link href={`/location/${l.source.locationId}`} passHref>
            <span
              style={{
                cursor: "pointer",
                color: `${theme.colors.brandBlue}`,
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              {l.source.locationName}
            </span>
          </Link>
          <span onClick={() => setShow(false)}>
            <FaTimes
              name="close"
              style={{ cursor: "pointer", fontSize: "24" }}
            />
          </span>
        </div>
        <p>
          {l.source.address1}
          <br />
          {l.source.city}, {l.source.state}
        </p>
      </div>
    );
  };

  return (
    <div className="Marker">
      <span
        onClick={() => {
          setShow(true);
          // setCenter({ lat: l.source.coordinate.lat, lng: l.source.coordinate.lon });
        }}
      >
        <MdLocationOn
          name="location-on"
          style={{
            cursor: "pointer",
            fontSize: "35px",
            color: `${theme.colors.brandBlue}`,
          }}
        />
      </span>
      {show && renderDetails()}
    </div>
  );
}
