import React, { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import theme from "../../../common/theme";
import { formattedHours } from "../../utils/FormattedHours";
import { Locations } from "common/models/Locations";
import { InfoTab } from "./InfoTab";
import { AboutTab } from "./AboutTab";
import { FaBan } from "react-icons/fa";
import badgePremium from "common/assets/images/premium-badge.png";
import badgeVerified from "common/assets/images/verified-badge.png";

type PropsType = {
  locationDetail: Locations;
};

export function LocationDetails({ locationDetail }: PropsType) {
  const [tab, setTab] = useState(0);
  let operatingHours;
  if (locationDetail.operatingDaysHoursJSON?.length) {
    if (locationDetail.operatingDaysHoursJSON[0].callToCheck) {
      operatingHours = locationDetail.operatingDaysHoursJSON[0].callToCheck
    } else {
      operatingHours = formattedHours(locationDetail.operatingDaysHoursJSON)
    }
  }

  const onWebsiteClick = (website: any) => {
    if (website.redirect) {
      window.open(website.parsed, "_blank");
    }
  };

  const displayServices = () => {
    if (locationDetail.subCategories?.length) {
      return locationDetail.subCategories.map((c: any) => {
        return <div key={c.subCategoryId}>- {c.subCategoryName}</div>;
      });
    }
  };

  return (
    <div className="Details">
      <div className="DetailsMobile">
        <div className="tabs">
          <div className="tabsSection">
            <div className={tab === 0 ? "aboutTab active" : "aboutTab"}
              onClick={() => setTab(0)}>
              <span>Info</span>
            </div>
            <div className={tab === 1 ? "servicesTab active" : "servicesTab"}
              onClick={() => setTab(1)}>
              <span>About</span>
            </div>
            {(locationDetail.hasOwnProperty('active') && !locationDetail.active) && <span className="inactiveIcon"><FaBan title='inactive' name="inactive" style={{ color: 'red', fontSize: "20" }} /></span>}
          </div>
          <div className="verifiedSection">
            {locationDetail.premiere ? <Image src={badgePremium} height={40} width={100} alt="verified badge" /> : locationDetail.verified ? <Image src={badgeVerified} height={40} width={100} alt="verified badge" /> : null}
          </div>
        </div>
        {tab === 0 &&
          <div className="info">
            <InfoTab locationDetail={locationDetail} operatingHoursFormat={operatingHours || ''} />
          </div>
        }
        {
          tab === 1 &&
          <AboutTab locationDetail={locationDetail} />
        }
      </div>

      {/* <div className="DetailsDesktop">
        <div className="detailsInfo">
          <div
            className={tab === 0 ? "aboutTab active" : "aboutTab"}
            onClick={() => setTab(0)}
          >
            <span>About</span>
          </div>
          <div
            className={tab === 1 ? "servicesTab active" : "servicesTab"}
            onClick={() => setTab(1)}
          >
            <span>Services</span>
          </div>
          <hr className="dividerTab" />
          {tab === 0 && (
            <div className="about">
              <div className="headerSection">
                <div className="subtitle" style={{ flex: 1 }}>
                  Hours Of Operations {operatingHours ? null : "Not Available"}
                </div>
              </div>
              {operatingHours ? (
                <>
                  <div>
                    <span>{operatingHours}</span>
                  </div>
                </>
              ) : null}
              <hr />
              <div className="subtitle">{locationDetail.locationName}</div>
              <p>{locationDetail.description}</p>
              <hr />
              <div className="headerSection">
                <span className="subtitle">Contact</span>
              </div>
              <div className="contactPerson">{locationDetail.contactPerson}</div>
              <div className="contactEmail">
                {locationDetail.contactEmail ? (
                  <Link href={`mailto:${locationDetail.contactEmail}`}>
                    {locationDetail.contactEmail}
                  </Link>
                ) : null}
              </div>
              <div className="contactPhone">
                {locationDetail.phoneNumber ? (
                  <Link href={`tel:${locationDetail.phoneNumber}`}>
                    {locationDetail.phoneNumber}
                  </Link>
                ) : null}
              </div>
              {locationDetail.bestFormOfCommunication ? (
                <div>
                  <hr />
                  <div className="subtitle">Best form of communication</div>
                  <div>{locationDetail.bestFormOfCommunication}</div>
                </div>
              ) : null}
              {locationDetail.website ? (
                <div>
                  <hr />
                  <div className="subtitle">Website</div>
                  <div
                    className="website"
                    onClick={() => onWebsiteClick(locationDetail.website)}
                  >
                    {locationDetail.website?.original[0]}
                  </div>
                </div>
              ) : null}
              {locationDetail.priceRangeString ? (
                <div>
                  <hr />
                  <div className="subtitle">Price range</div>
                  <div>{locationDetail.priceRangeString}</div>
                </div>
              ) : null}
              {locationDetail.peopleServiceMaxCount ? (
                <div>
                  <hr />
                  <div className="subtitle"># of people serviceable</div>
                  <div>{locationDetail.peopleServiceMaxCount}</div>
                </div>
              ) : null}
              {locationDetail.slips ? (
                <div>
                  <hr />
                  <div className="subtitle">Wet/Dry slips</div>
                  <div>{locationDetail.slips}</div>
                </div>
              ) : null}
              {locationDetail.boatSize ? (
                <div>
                  <hr />
                  <div className="subtitle">Boat size</div>
                  <div>{locationDetail.boatSize}</div>
                </div>
              ) : null}
              {locationDetail.fuel ? (
                <div>
                  <hr />
                  <div className="subtitle">Fuel service</div>
                  <div>{locationDetail.fuel}</div>
                </div>
              ) : null}
            </div>
          )}

          {tab === 1 ? (
            <>
              <div>
                <div className="subtitle">Services</div>
              </div>
              {displayServices()}
            </>
          ) : null}
        </div>
        <div className="detailsMap">
          {locationDetail.coordinate && locationDetail.coordinate.x !== 0 ? (
            <SearchResultsMap locationsCoord={[locationDetail]} />
          ) : null}
        </div>
      </div> */}
      <style jsx>{`
        .aboutTab,
        .servicesTab {
          display: inline-block;
          width: 100px;
          text-align: center;
          font-size: 18px;
          padding: 8px 16px;
          cursor: pointer;
        }
        .inactiveIcon{
          vertical-align: middle;
        }
        .aboutTab span:active {
          opacity: 0.5;
        }
        .servicesTab span:active {
          opacity: 0.5;
        }
        .active {
          border-bottom: 4px solid ${theme.colors.brandBlack};
        }
        hr {
          margin-top: 25px;
          margin-bottom: 25px;
        }
        p {
          margin: 0px;
        }
        .dividerTab {
          margin-top: 0px;
        }
        .info{
          margin: 20px;
        }
        .tabs{
          background-color: ${theme.colors.brandBlueDark};
          color: ${theme.colors.brandWhite};
          display:flex;
          justify-content: space-between;
        }
        .active {
          border-bottom: 4px solid ${theme.colors.brandWhite};
        }
        .aboutTab,
        .servicesTab {
          width: 80px;
        }
        @media screen and (max-width: 750px) {

        }
      `}</style>
    </div>

  );
}

LocationDetails.propTypes = {
  locationDetail: PropTypes.object.isRequired,
};
