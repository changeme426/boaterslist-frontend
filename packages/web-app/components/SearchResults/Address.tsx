import React from "react";
import PropTypes from "prop-types";

export function Address({ location }: any) {
  return <div>
    {location?.address1 ? (
      <div className="address">
        <div className="address1">
          {location.address1}
        </div>
        {location.address2 && <div className="address2">
          {location.address2}
        </div>}
        <div>{location.city}, {location.state} {location.zipCode}</div>
        <style jsx>{`
        .address {
          font-size: 14px;
        }
        div{
          margin-bottom: 2px;
        }
      `}</style>
      </div>
    ) : null}
  </div>;
}

Address.propTypes = {
  location: PropTypes.object.isRequired,
};
