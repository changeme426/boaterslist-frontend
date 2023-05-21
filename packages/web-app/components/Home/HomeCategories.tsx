import { useRouter } from "next/router";
import React from "react";
import BoatersListIcon from "common/assets/svg/boaterslist-icon.svg"
import CanoeIcon from "common/assets/svg/canoe-icon.svg";
import FishingIcon from "common/assets/svg/fishing-icon.svg";
import GuideIcon from "common/assets/svg/guide-icon.svg";
import HatIcon from "common/assets/svg/hat-icon.svg";
import PaddlingIcon from "common/assets/svg/paddling-icon.svg";
import ShipIcon from "common/assets/svg/ship-icon.svg";
import ToolsIcon from "common/assets/svg/tools-icon.svg"
import { useUserCurrentLocation } from "common/hooks/useUserCurrentLocation";
import { useGlobalUserLocation } from 'common/hooks/useGlobalUserLocation';

type Category = {
  label: string;
  fullLabel: string
  categoryId: string;
  icon: Element | object;
};

type CategoriesProps = {
  onCategory: (redirect: object) => void,
  iconWidth: string
};

export function HomeCategories({ onCategory, iconWidth }: CategoriesProps) {
  const router = useRouter();
  // const useUserCurrentLocationHook = useUserCurrentLocation();
  const globalLocation = useGlobalUserLocation();
  const categories: Category[] = [
    {
      label: "All Categories",
      fullLabel: 'All Categories',
      categoryId: "-1",
      icon: <BoatersListIcon data-testid="allCategoriesIcon" style={{ paddingTop: 5, paddingBottom: 13 }} width={iconWidth} height={50} />,
    },
    {
      label: "Services",
      fullLabel: 'Marine Services',
      categoryId: "s-3",
      icon: <ToolsIcon data-testid="servicesIcon" width={iconWidth} height={50} />,
    },
    {
      label: "Guides",
      fullLabel: 'Fishing Guides and Fishing Charters',
      categoryId: "s-5",
      icon: <FishingIcon data-testid="guidesIcon" width={iconWidth} height={50} />,
    },
    {
      label: "Rentals",
      fullLabel: 'Rentals',
      categoryId: "s-2",
      icon: <PaddlingIcon data-testid="rentalsIcon" width={iconWidth} height={50} />,
    },
    // {
    //   label: "Transportation",
    //   categoryId: 8,
    //   icon: <SpeedBoatIcon />,
    // },
    {
      label: "Marinas",
      fullLabel: 'Marinas',
      categoryId: "s-1",
      icon: <ShipIcon data-testid="marinasIcon" width={iconWidth} height={50} />,
    },
    {
      label: "Crew for Hire",
      fullLabel: 'Charter Vessel and/or Captain/Crew',
      categoryId: "s-6",
      icon: <HatIcon data-testid="crewIcon" width={iconWidth} height={50} />,
    },
    {
      label: "Sales",
      fullLabel: 'Marine Sales',
      categoryId: "s-11",
      icon: <GuideIcon data-testid="salesIcon" width={iconWidth} height={50} />,
    },
    {
      label: "Haul Out Service",
      fullLabel: 'Haul Out Yard Services',
      categoryId: "s-4",
      icon: <CanoeIcon data-testid="haulIcon" width={iconWidth} height={50} />,
    },
  ];
  const onCategorySelect = (categoryId: string, label: string) => {
    if (categoryId) {
      if (categoryId === "-1") {
        router.push("/categories");
      } else {
        onCategory({ provider: { title: label, id: categoryId }, location: globalLocation.globalLocation });
      }
    }
  };

  return (
    <div className="categories">
      {categories.map(({ label, fullLabel, icon, categoryId }, i) => (
        <div
          key={i}
          className="iconContainer"
          onClick={() => onCategorySelect(categoryId, fullLabel)}
        >
          {icon}
          <div className="iconLabel">{label}</div>
        </div>
      ))}

      <style jsx>{`
        .categories {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-content: center;
          justify-content: center;
        }
        .iconContainer {
          cursor: pointer;
          display: flex;
          justify-content: center;
          flex-basis: 50px;
          margin-right: 25px;
          margin-left: 25px;
          align-content: baseline;
          flex-wrap: wrap;
        }
        .iconLabel {
          width: 100%;
          color: white;
          box-sizing: border-box;
          text-align: center;
          font-size: 12px;
        }
        .svg {
          width: 50px;
        }
        @media screen and (max-width: 850px) {
          .iconContainer {
            margin: 0px;
            flex-basis: 25%;
            margin-bottom: 25px;
          }
        }
      `}</style>
    </div>
  );
}
