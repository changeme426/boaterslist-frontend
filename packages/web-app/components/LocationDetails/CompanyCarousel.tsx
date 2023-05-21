import React, { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import theme from "common/theme";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Locations } from "common/models/Locations";

type PropsType = {
  locationDetail: Locations;
};

export function CompanyCarousel({locationDetail}: PropsType) {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 3
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  const picURL = (locid: number, type: string): string => {
    return `https://bluserimgs.s3.us-east-2.amazonaws.com/loc-${locid}-${type}.jpg`
  }

  return (
    <div className="carouselContainer">
      <Carousel removeArrowOnDeviceType={["tablet", "mobile"]} containerClass={'carouselContainer'} responsive={responsive} showDots draggable slidesToSlide={1} swipeable>
        <div className="imgSection"><Image
          src={picURL(locationDetail.locationId, "logo")}
          alt="Logo carousel"
          height={300}
          width={300}
        /></div>
        <div className="imgSection"><Image
          src={picURL(locationDetail.locationId, "pic1")}
          alt="picture 1 carousel"
          height={300}
          width={300}
        /></div>
        <div className="imgSection"><Image
          src={picURL(locationDetail.locationId, "pic2")}
          alt="picture 2 carousel"
          height={300}
          width={300}
        /></div>
      </Carousel>
      <style jsx>{`
        .imgSection{
          text-align:center;
        }
        .carouselContainer{
          background-color: ${theme.colors.brandBlueDark};
        }
      `}</style>
    </div>
  );
}