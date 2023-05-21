import React from "react";
import theme from "../../../common/theme";
import Button from "../Buttons/Button";

export const BusinessSuccessInfo = () => {
  return (
    <div className="businessSuccess">
      <div className="title">Business Owner Sign Up</div>
      <div className="businessSignUpText">
        <p>
          Boaters List is an exciting new interactive FREE platform to connect
          everyone to everything on the Water. It is specifically created for
          all Service Providers in the Marine and Water Activities business.
        </p>
        <p>
          Please be on the lookout for an email inviting you to build your
          business profile. You will able to input your Logo, pictures and a
          description of your business services, best contacts and hours of
          operation.
        </p>
        <p>
          Boaters List takes great pride in its unique Service Provider platform
          which focuses on highlighting your business to potential customers.
          This platform has been designed to be user friendly allowing you to
          control and edit the content customers encounter when searching for
          services.
        </p>
      </div>
      <div className="boaterlistText">
        See if your business is already on Boaters List.
      </div>
      <Button
        style={{
          backgroundColor: `${theme.colors.brandBlue}`,
          color: `${theme.colors.brandWhite}`,
          paddingLeft: 50,
          paddingRight: 50,
          paddingTop: 16,
          paddingBottom: 16,
        }}
        title="Search"
        type="button"
        onClick={() => console.log("SEARCH")}
      />
      <style jsx>{`
        .title {
          font-size: 24px;
          margin-bottom: 20px;
        }
        .businessSignUpText {
          word-break: break-word;
          text-align: left;
          white-space: break-spaces;
        }
        .boaterlistText {
          font-weight: bold;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
};
