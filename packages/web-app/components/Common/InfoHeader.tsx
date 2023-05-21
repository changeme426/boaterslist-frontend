import React from "react";
import theme from "common/theme";

type typeProps = {
  title: string;
};

export const InfoHeader = ({ title }: typeProps) => {
  return (
    <div className="infoHeader">
      <div className="title">{title}</div>

      <style jsx>{`
        .title {
          font-size: ${theme.boaterslistInfo.infoHeader.titleSize}px;
          padding: ${theme.boaterslistInfo.infoHeader.padding}px;
          font-weight: ${theme.boaterslistInfo.infoHeader.fontWeight};
        }
        .infoHeader {
          background-color: ${theme.boaterslistInfo.infoHeader.backgroundColor};
          color: ${theme.boaterslistInfo.infoHeader.color};
        }
      `}</style>
    </div>
  );
};
