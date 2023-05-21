import Link from "next/link";
import React from "react";
import theme from "../../../common/theme";
import { SocialMediaIcons } from "../SocialMediaIcons/SocialMediaIcons";

export default function Footer() {
  return (
    <div className="footer">
      <div className="leftSide">
        <SocialMediaIcons />
      </div>
      <div className="rightSide">
        <div>
          <Link href={"/about-us"}>
            <a className="about">About</a>
          </Link>
        </div>
        <div>
          <Link href={"/contact-us"}>
            <a className="contact">Contact</a>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .footer {
          display: flex;
          flex-direction: row;
          padding: 60px;
          height: 140px;
          color: ${theme.colors.brandBlue};
          background-color: ${theme.colors.brandBlack};
          position: absolute;
          width: 100%;
          left: 0;
          bottom: 0;
          width: 100%;
          overflow: hidden;
        }
        .leftSide {
          display: flex;
          align-self: center;
          justify-content: flex-start;
        }
        .rightSide {
          display: flex;
          align-self: center;
          flex-direction: row;
          align-content: center;
          justify-content: flex-end;
          flex: 1;
          font-weight: 600;
          font-size: 15px;
        }
        .rightSide > div {
          padding-right: 20px;
        }

        @media screen and (max-width: 750px) {
          .footer {
            display: block;
            text-align: center;
            padding: 30px;
          }
          .leftSide,
          .rightSide {
            display: block;
          }
          .rightSide > div {
            display: inline-block;
          }
        }
      `}</style>
    </div>
  );
}
