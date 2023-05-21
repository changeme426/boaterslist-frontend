import React from "react";
import Link from "next/link";
import Image from "next/image";

type adsProps = {
  link: string;
  img: any;
  width: number;
  height: number;
};

export const Advertising = ({link, img, width, height}: adsProps) => {
  return (
    <div className="adsContainer">
      <Link href={link}>
        <a target="_blank">
          <Image layout="fixed"  quality={100} width={width} height={height} src={img} alt="image for advertising" />
        </a>
      </Link>
    </div>
  );
};
