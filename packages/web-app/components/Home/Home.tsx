import React, { useEffect, useState } from "react";
import Image from "next/image";
import { HomeWelcome } from "./HomeWelcome";
import theme from "../../../common/theme";
import homeMainImg from "../../../common/assets/images/background.jpg";
import { HomeCategories } from "./HomeCategories";
import { LocationSearch } from "../LocationSearch/LocationSearch";
import { useRouter } from "next/router";
import { Advertising } from "../Ads/Advertising";
import { renderMetaTags } from "react-datocms";
import { useGlobalUserLocation } from "common/hooks/useGlobalUserLocation";
import { usePreviousSearch } from "common/hooks/usePreviousSearch";
import Head from "next/head";
import { useMediaQuery } from "usehooks-ts";
import LogoStacked from "common/assets/svg/logos/boasters list - stacked - color white.svg";
// TODO cleanup ads
import ad1Img1 from "common/assets/images/ads/D-Dey-AD062821-1200x180.png";
import ad1Img2 from "common/assets/images/ads/D-Dey-AD062821-1000x200.png";
import ad2Img1 from "common/assets/images/ads/GCYG-ad1-1200x180.png";
import ad2Img2 from "common/assets/images/ads/GCYG-ad1-1000x200.png";
// import ad3Img1 from "common/assets/images/ads/mongo_webbanners_1200x180-web.jpg";
// import ad3Img2 from "common/assets/images/ads/mongo_webbanners_1000x200-web.jpg";
import ad3Img1 from "common/assets/images/ads/dillweeds-1200x180.png";
import ad3Img2 from "common/assets/images/ads/dillweeds-1000x200.png";
import ad4Img1 from "common/assets/images/ads/TBF-1200x180-boaters-list.jpg";
import ad4Img2 from "common/assets/images/ads/TBF-1000x200-boaters-list.jpg";
import ad5Img1 from "common/assets/images/ads/bisbee-1200x180.png";
import ad5Img2 from "common/assets/images/ads/bisbee-1000x200.png";

const ads = [
  {
    img1: ad1Img1,
    img2: ad1Img2,
    url: "https://www.d-dey.com/",
  },
  {
    img1: ad2Img1,
    img2: ad2Img2,
    url: "https://www.gulfcoastyachtgroup.com/",
  },
  {
    img1: ad3Img1,
    img2: ad3Img2,
    url: "https://dillweedscustomwood.com/",
  },
  {
    img1: ad5Img1,
    img2: ad5Img2,
    url: "https://www.bisbees.com/",
  },
  {
    img1: ad4Img1,
    img2: ad4Img2,
    url: "https://billfish.org/become-a-member/",
  },
];

export default function Home(props: any) {
  const router = useRouter();
  const globalLocation = useGlobalUserLocation();
  const previousSearch = usePreviousSearch();

  const dataDatoCMS = props.data.homepage.seoSettings;
  const matches = useMediaQuery("(max-width: 1200px)");
  const [adsElements, setAdsElements] = useState<any[]>([]);
  let modifySearch = null;
  if (router.query && (router.query.provider || router.query.location)) {
    const defaultSearch = {
      provider: JSON.parse(router.query.provider as string),
      location: JSON.parse(router.query.location as string),
    };
    modifySearch = defaultSearch;
  } else {
    if (previousSearch.prevSearch && globalLocation.globalLocation) {
      const defaultSearch = {
        provider: previousSearch.prevSearch,
        location: globalLocation.globalLocation.locationText,
      };
      modifySearch = defaultSearch;
    }
  }
  useEffect(() => {
    setAds();
  }, []);

  const setAds = () => {
    const divider = ads.length;
    const i = new Date().getHours() % divider;
    const adsArray = [];
    adsArray[0] = ads[i];
    adsArray[1] = ads[(i + 1) % divider];
    adsArray[2] = ads.length >= 3 ? ads[(i + 2) % divider] : null;
    adsArray[3] = ads.length >= 4 ? ads[(i + 3) % divider] : null;
    setAdsElements([...adsArray]);
  };

  const handleSearch = (data: any, categoryId?: number) => {
    const parseProvider =
      data.provider && typeof data.provider === "object"
        ? JSON.stringify(data.provider)
        : data.provider;
        console.log('home search data - ', data)
    router.push(
      {
        pathname: "/search-results",
        query: {
          provider: parseProvider,
          location: JSON.stringify(data.location),
        },
      },
      "/search-results"
    );
  };

  return (
    <div className="home">
      <Head>{renderMetaTags(dataDatoCMS)}</Head>
      <Image
        className="imageLoader"
        priority
        layout="fill"
        objectFit="cover"
        quality={100}
        src={homeMainImg}
        alt="Logo boaterlist header"
      />
      <div className="gradient"></div>
      <div className="boatersListLogo">
        <LogoStacked width={"500"} height={"400"} />
      </div>
      <div className="boatersListLogoMobile">
        <LogoStacked width={"300"} height={"250"} />
      </div>
      <div className="searchHome">
        <div className="locationSearchHome">
          <LocationSearch
            searchDefault={modifySearch ? modifySearch : null}
            onSearch={handleSearch}
          />
        </div>
        <div className="homeCategories">
          <HomeCategories onCategory={handleSearch} iconWidth={"50"} />
        </div>
      </div>
      <div className="homeWelcome">
        <>
          {adsElements.length > 0 && (
            <div className="advLeft">
              {matches ? (
                <div className="adsMobile">
                  <div>
                    <Advertising
                      link={adsElements[0].url}
                      img={adsElements[0].img2}
                      width={300}
                      height={100}
                    />
                  </div>
                  {adsElements[2] && (
                    <div>
                      <Advertising
                        link={adsElements[2].url}
                        img={adsElements[2].img2}
                        width={300}
                        height={100}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="adsDesktop">
                  <div>
                    <Advertising
                      link={adsElements[0].url}
                      img={adsElements[0].img1}
                      width={400}
                      height={100}
                    />
                  </div>
                  {adsElements[2] && (
                    <div>
                      <Advertising
                        link={adsElements[2].url}
                        img={adsElements[2].img1}
                        width={400}
                        height={100}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="welcome">
            <HomeWelcome />
          </div>
          {adsElements.length > 0 && (
            <div className="advRight">
              {matches ? (
                <div className="adsMobile">
                  <div>
                    <Advertising
                      link={adsElements[1].url}
                      img={adsElements[1].img2}
                      width={300}
                      height={100}
                    />
                  </div>
                  {adsElements[3] && (
                    <div>
                      <Advertising
                        link={adsElements[3].url}
                        img={adsElements[3].img2}
                        width={300}
                        height={100}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="adsDesktop">
                  <div>
                    <Advertising
                      link={adsElements[1].url}
                      img={adsElements[1].img1}
                      width={400}
                      height={100}
                    />
                  </div>
                  {adsElements[3] && (
                    <div>
                      <Advertising
                        link={adsElements[3].url}
                        img={adsElements[3].img1}
                        width={400}
                        height={100}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      </div>

      <style jsx>{`
        .home {
          position: relative;
          background-color: ${theme.colors.brandBlueDark};
        }
        div :global(.imageLoader) {
          filter: brightness(50%);
        }
        .gradient {
          height: 100%;
          width: 100%;
          position: absolute;
          background: linear-gradient(
            to bottom,
            transparent 35%,
            transparent 20%,
            #0d213d 60%,
            #0d213d 100%
          );
        }
        .boatersListLogo {
          position: relative;
          text-align: center;
          max-height: 400px;
        }
        .boatersListLogoMobile {
          display: none;
        }
        .searchHome {
          position: relative;
        }
        .mainImgHomeContainer {
          position: relative;
          width: 100%;
          height: 500px;
          z-index: -1;
        }
        .locationSearchHome {
          width: 100%;
          max-width: 800px;
          margin: auto;
          background-color: ${theme.colors.brandWhite};
          border-radius: 20px;
          top: 100px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .homeWelcome {
          display: flex;
          flex-direction: row;
          position: relative;
          text-align: center;
          padding: 40px 0px;
          align-items: center;
        }
        .welcome {
          flex: 2;
          text-align: center;
          padding: 0 10px;
        }
        .advLeft,
        .advRight {
          flex: 1;
        }
        .advLeft div {
          margin-bottom: 15px;
        }
        .advRight div {
          margin-bottom: 15px;
        }
        .homeCategories {
          display: flex;
          justify-content: center;
        }
        @media screen and (max-width: 580px) {
          .boatersListLogoMobile {
            display: block;
            position: relative;
            text-align: center;
            padding-top: 20px;
          }
          .boatersListLogo {
            display: none;
          }
        }

        @media screen and (max-width: 750px) {
          .locationSearchHome {
            top: 0px;
            border-radius: 0px;
            display: block;
            background-color: transparent;
          }
        }
        @media screen and (max-width: 1200px) {
          .homeWelcome {
            flex-direction: column;
          }
          .homeWelcome {
            padding: 20px 40px;
          }
          .welcome {
            order: 2;
          }
          .advLeft {
            order: 1;
          }
          .advRight {
            order: 3;
          }
        }
      `}</style>
    </div>
  );
}
