import React from "react";
import theme from "../../../common/theme";

export function HomeWelcome() {
  return (
    <div className="welcomeContainer">
      <div className="welcomeHeader">Welcome Aboard!</div>
      <span className="welcomeMain">
        <p className="welcomeText">
          Thank you for visiting the site! Boaters List was started by water and
          boat enthusiasts and designed to link everyone to everything on the
          water. As a new company we are striving to enhance your experience,
          create better and faster connections and get you hooked up. Please let
          us know how we can improve your experience, ideas, suggestions and of
          course any concerns.
        </p>
        <p className="welcomeText">
          Welcome Aboard and we look forward to seeing you on the water.
        </p>
      </span>
      <style jsx>{`
        .welcomeContainer {
          color: ${theme.colors.brandWhite};
        }
        .welcomeText {
          font-size: 18px;
          line-height: 27px;
          text-align: justify;
        }
        .welcomeHeader {
          font-size: 36px;
        }
      `}</style>
    </div>
  );
}
