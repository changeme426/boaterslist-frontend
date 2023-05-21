import Button from '../Buttons/Button'
import hasRole from 'common/utils/hasRole'
import React from 'react'
import router from 'next/router'
import theme from '../../../common/theme'
import { useUser } from '@auth0/nextjs-auth0'
import { useGlobalUserLocation } from 'common/hooks/useGlobalUserLocation'

type UserDetailsProps = {
  onUserChange: (opt: string) => void;
};

export const UserDetails = ({ onUserChange }: UserDetailsProps) => {
  const { user, error, isLoading } = useUser()
  const globalLocation = useGlobalUserLocation();
  const isAdmin = hasRole(user, 'admin')

  const onSelect = (value: string) => {
    onUserChange(value);
  };

  const outsideClick = (e: any) => {
    if (e?.target.className.includes("userDetailsContainer")) {
      onSelect("");
    }
  };

  return (
    <div className="userDetailsContainer" onClick={outsideClick}>
      <div className="userDetailsSection">
        <div>Signed in as {user && user.email}</div>
        <div>&nbsp;</div>
        <div className="btnDetails">
          <Button
            style={{
              padding: 15,
              backgroundColor: `${theme.colors.brandBlue}`,
              color: `${theme.colors.brandWhite}`,
            }}
            title={"My Profile"}
            onClick={() => {
              onSelect("Edit")
            }} />
        </div>
        <div className="btnDetails">
          <Button
            style={{
              padding: 15,
              backgroundColor: `${theme.colors.brandBlue}`,
              color: `${theme.colors.brandWhite}`,
            }}
            title={"Add Your Business"}
            onClick={() => {
              router.push("/claim/newClaim");
              onSelect("")
            }} />
        </div>
        <div className="btnDetails">
          <Button
            style={{
              padding: 15,
              backgroundColor: `${theme.colors.brandBlue}`,
              color: `${theme.colors.brandWhite}`,
            }}
            title={"Claimed Businesses"}
            onClick={() => {
              router.push(
                {
                  pathname: "/search-results",
                  query: {
                    provider: "Claimed Businesses",
                    location: JSON.stringify(globalLocation.globalLocation),
                    claimedBusiness: true
                  },
                },
                "/search-results",
              );
              onSelect("")
            }} />
        </div>
        {isAdmin && <>
          <div className="btnDetails">
            <Button
              style={{
                padding: 15,
                backgroundColor: `${theme.colors.brandBlue}`,
                color: `${theme.colors.brandWhite}`,
              }}
              title={"Admin"}
              onClick={() => {
                onSelect("")
                router.push('/admin')
              }} />
          </div>
          <div className="btnDetails">
            <Button
              style={{
                padding: 15,
                backgroundColor: `${theme.colors.brandBlue}`,
                color: `${theme.colors.brandWhite}`,
              }}
              title={"Dashboard"}
              onClick={() => { window.location.href = 'https://search-boaterslist-prod-zt6xih7pbbmvpxoysdt4lef744.us-west-2.es.amazonaws.com/_dashboards' }} />
          </div>
        </>}
        <div className="btnDetails">
          <Button
            style={{
              padding: 15,
              backgroundColor: `${theme.colors.brandBlue}`,
              color: `${theme.colors.brandWhite}`,
            }}
            title={"Contact Us"}
            onClick={() => {
              onSelect("");
              router.push('/contact-us');
            }}
          />
        </div>
        <div className="btnDetails">
          <Button
            style={{
              padding: 15,
              backgroundColor: `${theme.colors.brandBlue}`,
              color: `${theme.colors.brandWhite}`,
            }}
            title={"Logout"}
            onClick={() => window.location.href = '/api/auth/logout'}
          />
        </div>
      </div>
      <style jsx>{`
        .userInfo {
          display: flex;
          margin: 10px 0px;
        }
        .userDataIcon {
          margin-left: 10px;
        }
        .progressBar {
          width: 100%;
          display: flex;
          flex-direction: row;
          margin: 15px 0px;
          border-radius: 20px;
          background-color: ${theme.colors.brandLightGray};
        }
        .percentage,
        .pending {
          height: 10px;
        }
        .percentage {
          border-radius: 20px;
          background-color: ${theme.colors.brandBlack};
        }
        .pending {
          border-radius: 20px;
          background-color: ${theme.colors.brandLightGray};
        }
        .percentageText {
          font-weight: bold;
        }
        .percent,
        .finishProfile {
          margin: 15px 0px;
        }
        .userDetailsContainer {
          background-color: rgba(52, 52, 52, 0.5);
          height: 100%;
          display: flex;
          justify-content: right;
        }
        .userDetailsSection {
          width: 330px;
          background-color: ${theme.colors.brandWhite};
          padding: 15px;
        }
        .btnDetails {
          padding: 10px;
        }
        @media screen and (max-width: 750px) {
          .userDetailsSection {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
