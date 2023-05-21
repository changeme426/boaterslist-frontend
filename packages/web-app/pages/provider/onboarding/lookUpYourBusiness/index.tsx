import React, { useEffect, useState } from "react";
// import theme from "../../lib/theme/theme";
import { useRouter } from "next/router";
import { Input } from "../../../../components/Forms/Input";
import { FaSearch } from "react-icons/fa";
import { getProviderResults } from "../../../../utils/Api/Providers";
import { ProvidersResults } from "../../../../components/Providers/ProvidersResults";
import { Companies } from "../../../../utils/classes/Companies";
import Image from "next/image";
import searchImage from "common/assets/images/BL_Search.png";
import { useDebounce } from 'use-debounce';
import theme from "../../../../../common/theme";

import Link from "next/link";
import { getProfile } from "../../../../utils/Api/User";
import { useSignIn } from "../../../../../common/hooks/useSignIn";
import Cookies from "js-cookie";

export default function LookUpYourBusiness() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bussinesResults, setBussinesResults] = useState<Companies[]>([]);
  const [providerDetails, setproviderDetails] = useState(null);
  const userHook = useSignIn();
  const [debouncedQuery] = useDebounce(searchTerm, 500, { leading: true })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userAuth = userHook.user
          ? userHook.user
          : Cookies.get("user")
          ? JSON.parse(Cookies.get("user") as string)
          : null;
        const token = userAuth && userAuth.auth.access_token;
        const user = await getProfile(token);
        const userProfile = await user.json();
        userHook.addUserProfile(userProfile);
        setproviderDetails(userProfile);
      } catch (error) {
        console.log("ERROR TRYING TO FETCH USER DATA");
      }
    };
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      const fetchProviders = async (searchString: string) => {
        try {
          let setParams = {
            offset: 0,
            limit: 10,
            where: { companyName: { like: `%${searchString}%` } },
          };
          const response = await getProviderResults(
            encodeURIComponent(JSON.stringify(setParams))
          );
          const responseJson = await response.json();
          setBussinesResults(responseJson);
        } catch (error) {
          console.log("RESPONSE ERROR4");
        }
      };
      // Make sure we have a value (user has entered something in input) and it's length is greater than 2
      if (debouncedQuery && debouncedQuery.length > 2) {
        // Set isSearching state
        fetchProviders(debouncedQuery);
      }
    },
    // This is the useEffect input array
    // Our useEffect function will only execute if this value changes ...
    // ... and thanks to our hook it will only change if the original ...
    // value (searchTerm) hasn't changed for more than 500ms.
    [debouncedQuery]
  );

  return (
    <div className="lookupForBussines">
      <div className="imageSearchContent">
        <div className="imageBackground">
          <Image
            objectFit="cover"
            layout="responsive"
            quality={100}
            height={240}
            src={searchImage}
            alt="search boaterslist image"
          />
        </div>
        <div className="searchContent">
          <div className="searchInputContainer">
            <div className="boatersListSubtitle">
              Look Up Your Business{" "}
              <Link href={"/contact-us"}>
                <a className="boatersListEmailFormat linkFont">Need Help?</a>
              </Link>
            </div>
            <div>
              <Input
                id="searchBussines"
                onChange={(value: any) => setSearchTerm(value.target.value)}
                name="location"
                placeholder={"Search Businesses"}
                icon={
                  <FaSearch
                    style={{
                      fontSize: "20px",
                      color: `${theme.colors.brandLightGray}`,
                    }}
                  />
                }
                onIconPress={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="resultsContent">
        <ProvidersResults
          providersList={bussinesResults}
          providerDetails={providerDetails}
        />
      </div>

      <style jsx>{`
        .searchContent {
          margin-top: -10px;
          position: relative;
        }
        .resultsContent {
          padding: 24px 0px;
        }
        .linkFont {
          font-size: 14px;
        }
        .searchInputContainer {
          background-color: ${theme.colors.brandWhite};
          max-width: 600px;
          margin: auto;
          box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px 0px;
          border-radius: 20px;
          padding: 40px 60px 60px 60px;
        }

        @media screen and (max-width: 750px) {
          .imageBackground {
            display: none;
          }
          .searchContent {
            margin-top: 0px;
          }
          .searchInputContainer {
            max-width: 100%;
            border-radius: 0px;
          }
        }
      `}</style>
    </div>
  );
}
