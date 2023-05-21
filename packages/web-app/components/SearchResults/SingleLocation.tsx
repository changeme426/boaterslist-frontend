import React from "react";
import Image from "next/image";
import theme from "../../../common/theme";
import premiereImg from "../../../common/assets/images/premium-badge.png";
import verifiedImg from "../../../common/assets/images/verified-badge.png";
import { Address } from "./Address";
import { FaBan } from "react-icons/fa";
import { useRouter } from "next/router";
import * as cat from 'common/global/categories'
import { usePreviousSearch } from "common/hooks/usePreviousSearch";

type PropsType = {
  location: any,
  onClaim?: (val: boolean) => void
}

type LCPropsType = {
  subcategories: number[],
}

function LocationCategories({ subcategories }: LCPropsType) {
  const previousSearch = usePreviousSearch();
  let subCategorySelected = "";
  let subCategoriesFilter = subcategories ? [...subcategories] : null
  ///TODO minify and improve this code block to set the searched category at the beginning
  if (previousSearch.prevSearch && previousSearch.prevSearch.title && previousSearch.prevSearch.title !== "") {
    subCategorySelected = previousSearch.prevSearch.title;
    if (subCategoriesFilter && subCategoriesFilter.length > 1) {
      const selectedCat = subCategoriesFilter?.findIndex((value: number) => {
        const category = cat.getSubCategory(value)?.subCategoryName;
        if (category) {
          if (category === subCategorySelected) {
            return true;
          }
        }
        return false;
      });
      if (selectedCat !== -1) {
        const firstElement = subCategoriesFilter.splice(selectedCat, 1);
        subCategoriesFilter.unshift(firstElement[0]);
      }
    }

  }
  let dots = false;

  const subcat: Array<string> = [];
  subCategoriesFilter?.slice(0, 5).forEach((c) => subcat.push(cat.getSubCategory(c)?.subCategoryName as string));
  if (subcategories?.length > 5) {
    dots = true;
  }
  return (subcat.length > 0) ?
    <div className="subCategories">
      <b>{subcat.join(', ')} {dots && '...'}</b>
      <style jsx>{`
        .subCategories {
          padding-top: 3px;
        }
      `}</style>
    </div>
    : null;
}

export function SingleLocation({ location, onClaim }: PropsType) {
  const ls = location.source
  const dateYear = new Date(ls?.dateCreated).getFullYear();
  const router = useRouter();

  const onLocation = (locationId: number) => {
    if (router.pathname.includes('location')) {
      router.push(`${locationId}`);
    } else {
      router.push(`/location/${locationId}`);
    }
    if (onClaim) {
      onClaim(true)
    }

  }
  return (
    <div className="singleLocation">
      <div className="locationNameTitle">
        <div>
          <span onClick={() => onLocation(location?.id)} className="locationName">
            {ls?.locationName || ls?.company?.companyName}
          </span>
          <span>
            - {ls?.dist > 1 ? `${Math.round(ls?.dist)} miles` : ls?.dist == 1 ? '1 mile' :
              `${Math.round(ls?.dist ? ls?.dist * 5280 : 0)} ft`}
          </span>
          {(ls.hasOwnProperty('active') && !ls.active) && <span className="inactiveIcon">
            <FaBan title='inactive' name="inactive" style={{ color: 'red', fontSize: "16" }} />
          </span>}
        </div>
        <div className="locationBadge">
          {ls?.premiere ? (
            <Image
              width={84}
              height={30}
              quality={100}
              src={premiereImg}
              alt="Premier badge"
            />
          ) : ls?.verified ? (
            <Image
              width={84}
              height={30}
              quality={100}
              src={verifiedImg}
              alt="Verified Badge"
            />
          ) : null}
        </div>
      </div>
      <div className="servicesSection">
        <LocationCategories subcategories={ls?.subCategories} />
      </div>
      <div className="address">
        <Address location={ls} />
      </div>
      <div className="memberSince">Member since {dateYear}</div>
      <style jsx>{`
        .inactiveIcon{
          margin-left: 5px;
        }
        .singleLocation {
          font-size: ${theme.locations.defaultSize};
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        .locationNameTitle {
          font-size: ${theme.locations.titleSize};
          display: flex;
          flex-directioon: row;
          align-items: center;
        }
        .locationName{
          color: ${theme.colors.brandBlue};
          cursor: pointer;
          font-weight: ${theme.locations.titleWeight};
          margin-right: 5px;
        }
        .locationBadge {
          margin-left: 10px;
        }
        .address {
          padding-top: 10px;
        }
        .memberSince {
          padding: 10px 0px;
        }

        @media screen and (max-width: 750px) {
        }
      `}</style>
    </div>
  );
}
