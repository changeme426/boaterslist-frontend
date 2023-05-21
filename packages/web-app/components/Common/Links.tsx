import React from "react";
import Link from "next/link";
import theme from "../../../common/theme";

type LinksProps = {
  onLinkClick: (opt: string) => void;
};

export const Links = ({ onLinkClick }: LinksProps) => {
  return (
    <div className="boaterslistInfoContent">
      <div onClick={() => onLinkClick("")} className="infoLink">
        <Link href={"/terms"}>Terms</Link>
      </div>
      <div className="infoDivider">|</div>
      <div onClick={() => onLinkClick("")} className="infoLink">
        <Link href={"/privacy"}>Privacy</Link>
      </div>
      <div className="infoDivider">|</div>
      <div onClick={() => onLinkClick("")} className="infoLink">
        <Link href={"/contact-us"}>Contact Us</Link>
      </div>
      <style jsx>{`
        .boaterslistInfoContent {
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
        }
        .infoLink {
          color: ${theme.colors.brandBlue};
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
