import React from "react";
import Link from "next/link";
import theme from "common/theme";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

export const SharedContactInfo = () => {
  return (
    <div className="sharedContactdInfo">
      <div>
        Boaters List welcomes your questions or comments regarding this
        Statement of Privacy. If you believe that Boaters List has not adhered
        to this Statement, please contact Boaters List at:
      </div>
      <div className="infoContent">
        <div>Boaters List LLC</div>
        <div>111 W Olmos Drive</div>
        <div>San Antonio, Texas 78212</div>
      </div>
      <div className="infoContent">
        Email Address:
        <div className="contact">
          <span className="icon">
            <MdOutlineEmail size={20} color={`${theme.colors.brandBlue}`} />
          </span>
          <Link href={`mailto:better@boaterslist.com`}>
            <a className="boatersListEmailFormat">better@boaterslist.com</a>
          </Link>
        </div>
      </div>
      <div className="infoContent">
        Telephone number:
        <br />
        <div className="contact">
          <span className="icon"><FaPhoneAlt size={20} color={`${theme.colors.brandBlue}`} />
          </span>
          <Link href={`tel:2106206412`}>
            <a>+1-210-620-6412</a>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .contact{
          display:flex;
          margin-top: 5px;
        }
        .contact > span{
          margin-right: 5px;
        }
        .infoContent{
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
};
