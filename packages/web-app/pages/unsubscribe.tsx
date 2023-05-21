import React from "react";
import Link from "next/link";
import { InfoHeader } from "components/Common/InfoHeader";
import theme from "common/theme";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { SingleContact } from "components/ContactInfo.tsx/SingleContact";

export default function ContactUs() {
  return (
    <>
      <InfoHeader title='Boaters List Email Unsubscribe' />
      <div className="boaterslistContainer contactInfo">
        <div className="corporate">
          <div>Please contact us at the email address below to unsubscribe from our mailing list:</div>
          <div className="contactIcons">
            <span><MdOutlineEmail size={20} color={`${theme.colors.brandBlue}`} />
            </span>
            <Link href="mailto:better@boaterslist.com">
              <a className="boatersListEmailFormat contactEmail">better@boaterslist.com</a>
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        .contactInfo{
          font-size: 16px;
        }
        .corporate{
          margin-bottom: 40px;
        }
        .corporate > div:not(.contactSubtitle){
          margin-bottom: 7px;
        }
        .contactSubtitle {
          font-size: ${theme.boaterslistInfo.subtitleFontSize}px;
          font-weight: ${theme.boaterslistInfo.subtitleFontWeight};
          margin-bottom: 20px;
        }
        .contactIcons{
          display: flex;
        }
        .contactIcons > span{
          margin-right: 5px;
        }
        .location {
          font-weight: ${theme.boaterslistInfo.subtitleFontWeight};
          margin-bottom: 7px;
        }
        .section {
          margin-bottom: 20px;
        }
      `}</style>
    </>
  );
}
