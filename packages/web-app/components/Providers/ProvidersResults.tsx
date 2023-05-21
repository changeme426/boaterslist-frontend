import React, { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import theme from "../../../common/theme";
import Button from "../Buttons/Button";
import { Companies } from "../../utils/classes/Companies";
import Modal from "../Common/Modal";
import { BusinessClaim } from "./BusinessClaim";
import { CreateBusinessListing } from "./CreateBusinessListing";

type PropsType = {
  providersList: Companies[];
  providerDetails: any;
};

export function ProvidersResults({
  providersList,
  providerDetails,
}: PropsType) {
  const [modalShow, setModalShow] = useState(false);
  const [modalView, setModalView] = useState("");
  const [selectedComapany, setSelectedComapany] = useState(null);
  const onCloseModal = () => {
    setModalShow(false);
  };

  const onProviderClaim = (company: any) => {
    setSelectedComapany(company);
    setModalShow(true);
    setModalView("Claim");
  };

  return (
    <div className="providersResults">
      <div className="providersContainer">
        {providersList.length > 0 && (
          <div className="provider">
            <div className="companyName">Can&apos;t find your business?</div>
            <div className="claimButton">
              <Button
                title={"Create New Listing"}
                style={{
                  color: `${theme.colors.brandWhite}`,
                  backgroundColor: `${theme.colors.brandBlue}`,
                }}
                onClick={() => {
                  setModalShow(true);
                  setModalView("CreateListing");
                }}
              />
            </div>
          </div>
        )}
        <div className="boatersListSubtitle resultsTitle">Results</div>
        <>
          {providersList.length > 0 ? (
            providersList.map((prov: any, index: number) => (
              <div key={index} className="provider">
                <div className="providerName">
                  <div className="companyName">{prov.companyName}</div>
                  <div className="companyCity">
                    {prov.city},{prov.state}
                  </div>
                </div>
                <div className="claimButton">
                  <Button
                    title={"Claim this Business"}
                    style={{
                      color: `${theme.colors.brandWhite}`,
                      backgroundColor: `${theme.colors.brandOrange}`,
                    }}
                    onClick={() => {
                      onProviderClaim(providersList[index]);
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="resultsTitle">Start searching Above</div>
          )}
        </>
      </div>

      <Modal onShow={modalShow} onClose={onCloseModal}>
        {modalView === "Claim" && (
          <BusinessClaim
            providerDetails={providerDetails}
            claimedCompany={selectedComapany}
          />
        )}
        {modalView === "CreateListing" && <CreateBusinessListing />}
      </Modal>

      <style jsx>{`
        .providersContainer {
          max-width: 500px;
          max-height: 450px;
          margin: auto;
          overflow: auto;
        }
        .provider {
          display: flex;
          justify-content: space-between;
          font-size: 18px;
          padding: 40px 20px;
          margin: auto;
          border-bottom: 1px solid ${theme.colors.brandLightGray};
        }
        .companyName {
          font-weight: 600;
        }
        .providerName {
          max-width: 230px;
        }
        .companyCity {
          font-size: 15px;
        }
        .resultsTitle {
          text-align: left;
          max-width: 500px;
          padding: 20px;
          margin: auto;
        }
        @media screen and (max-width: 550px) {
          .provider {
            display: block;
            text-align: center;
          }
          .providerName {
            margin-bottom: 10px;
            max-width: 100%;
          }
          .claimButton {
            width: 80%;
            margin: auto;
          }
        }
      `}</style>
    </div>
  );
}

// LocationDetails.propTypes = {
//   locationDetail: PropTypes.object.isRequired,
// };
