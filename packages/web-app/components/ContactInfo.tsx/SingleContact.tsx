import React from "react";
import Link from "next/link";
import theme from "common/theme";
import { MdOutlineEmail } from "react-icons/md";

type typeProps = {
  name: string;
  email: string;
};

export const SingleContact = ({ name, email }: typeProps) => {
  return (
    <div className="singleContact">
      <div className="name">{name}</div>
      <div className="contactEmailIcon">
        <span>
          <MdOutlineEmail size={20} color={`${theme.colors.brandBlue}`} />
        </span>
        <Link href={`mailto:${email}`}>
          <a className="boatersListEmailFormat contactEmail">{email}</a>
        </Link>
      </div>
      <style jsx>{`
        .name{
          margin-bottom: 7px;
        }
        .contactEmailIcon{
          display: flex;
        }
        .contactEmailIcon > span{
          margin-right: 5px;
        }
      `}</style>
    </div>
  );
};
