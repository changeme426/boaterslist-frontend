import { Locations } from "common/models/Locations"
import { SearchResultsMap } from "components/SearchResults/ResultsMap/SearchResultsMap"
import { Address } from "native-app/components/Address"
import { FaAnchor } from "react-icons/fa"
import theme from "common/theme"
import { UserRatings } from "web-app/components/LocationDetails/UserRatings"
import { getSubCategory } from "common/global/categories"
import { ClaimBusiness } from "./ClaimBusiness"

type PropsType = {
  locationDetail: Locations;
  operatingHoursFormat: string;
}

export function InfoTab({ locationDetail, operatingHoursFormat }: PropsType) {
  const ratings = 4.3;
  const displayServices = () => {
    const services: string[] = [];
    if (locationDetail.subCategories?.length) {
      locationDetail.subCategories.forEach((c: any) => {
        const subCategoryName = getSubCategory(c)?.subCategoryName;
        services.push(subCategoryName as string);
      });
    };
    return services.length > 0 && <div>{services.join(', ')}</div>
  };

  const showRatings = () => {
    const ratingIcons = [1, 2, 3, 4, 5];
    const ratingTrunc = Math.trunc(ratings);
    return ratingIcons.map((r: any, idx: number) => <span key={idx}>
      <FaAnchor style={{
        fontSize: "25px", color: ((idx + 1) <= ratingTrunc) ? `${theme.colors.brandBlue}` : `${theme.colors.brandGray}`
      }} />
    </span>);
  }

  return (
    <div className="infoTab">
      <div className="infoContent">
        <div className="addressMap">
          <div className="address">
            <div className="section">ADDRESS</div>
            <Address location={locationDetail} />
            <div>Hours:</div>
            <div>{operatingHoursFormat}</div>
          </div>
          <div className="detailsMap">
            {locationDetail.coordinate && locationDetail.coordinate.lon !== 0 ? (
              <SearchResultsMap showDirections locationsCoord={[{ source: locationDetail }] as any} />
            ) : null}
          </div>
        </div>
        <div className="services">
          <div className="section">SERVICES</div>
          {displayServices()}
        </div>
        <ClaimBusiness locationDetail={locationDetail} />
        {/*<div className="rating">
          <div className="section">RATINGS</div>
          <div className="numIconRating">
            <span className="ratingNum">{ratings}</span>
            <span>{showRatings()}</span>
            <span className="ratingText">5 ratings</span>
          </div>
        </div>
        <div className="userRatings">
          <UserRatings location={locationDetail} />
            </div>*/}
      </div>
      <div className="detailsMapResponsive">
        <div className="detailsMapDesk">
          {locationDetail.coordinate && locationDetail.coordinate.lon !== 0 ? (
            <SearchResultsMap showDirections locationsCoord={[{ source: locationDetail }] as any} />
          ) : null}
        </div>
      </div>

      <style jsx>{`
                .infoTab{
                    font-size: 16px;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
                .infoTab > div {
                    margin-bottom: 10px;
                }
                .ratingNum{
                    font-size: 20px;
                }
                .addressMap, .services{
                    margin-bottom: 20px;
                }
                .addressMap{
                    display:flex;
                    flex-direction: row;
                }
                .address{
                    width: 100%;
                    flex: 1;
                }
                .ratingText{
                    font-size: 18px;
                    color: ${theme.colors.brandGray};
                    margin-left: 10px;
                }
                .section{
                    color: ${theme.colors.brandGray};
                    font-size: 18px;
                    margin-bottom: 10px;
                }
                .detailsMap {
                    flex:1;
                    height: 200px;
                }
                .numIconRating{
                    display:flex;
                    align-items:center;
                }
                .ratingNum{
                    margin-right: 10px;
                    font-size: 25px;
                }
                .detailsMapDesk{
                    display:none;
                }
                @media screen and (min-width: 750px) {
                    .infoTab{
                        display:flex;
                    }
                    .infoContent, .detailsMapResponsive{
                        flex: 1;
                        padding: 10px;
                    }
                    .detailsMapDesk{
                        display:block;
                        height: 300px;
                    }
                    .detailsMap{
                        display:none;
                    }
                }
            `}</style>
    </div>
  )
}
