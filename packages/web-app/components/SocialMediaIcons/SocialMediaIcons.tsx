import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import theme from "../../../common/theme";

export function SocialMediaIcons() {
  return (
    <div className="socialMediaIcons">
      <span className="sicons facebook">
        <FaFacebookF
          onClick={() => window.open(theme.iconsUrl.facebook, "_blank")}
        />
      </span>
      <span className="sicons instagram">
        <FaInstagram
          onClick={() => window.open(theme.iconsUrl.instagram, "_blank")}
        />
      </span>
      <span className="sicons youtube">
        <FaYoutube
          onClick={() => window.open(theme.iconsUrl.youtube, "_blank")}
          style={{ paddingTop: "5px", fontSize: "25" }}
        />
      </span>

      <style jsx>{`
        .sicons {
          cursor: pointer;
          margin-right: 10px;
          font-size: 20px;
          color: ${theme.colors.brandBlue};
        }
      `}</style>
    </div>
  );
}
