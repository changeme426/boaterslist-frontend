import React, { useEffect, useState } from "react";
import theme from "common/theme";
import { useRouter } from "next/router";
import homeMainImg from "common/assets/images/background.jpg";
import Image from "next/image";
import { FaSearch, FaLayerGroup } from "react-icons/fa";
import { SubCategories } from "../../utils/classes/SubCategories";
import { subCategories } from "../../utils/Api/Categories";
import { LocationSearch } from "../../components/LocationSearch/LocationSearch";
import { getAllCategories } from "common/global/categories";
import { useUserCurrentLocation } from "common/hooks/useUserCurrentLocation";
interface Category {
  categoryId: string
  categoryNumber?: string
  categoryName?: string
  subCategoryId?: string
  subCategoryNumber?: string
  subCategoryName?: string
  subCategories?: Category[]
}

export default function AllCategories() {
  const router = useRouter();
  const useUserCurrentLocationHook = useUserCurrentLocation();
  const allCategories: Category[] = getAllCategories();
  const onCategoriesClick = (catOrSub: Category, type: string) => {
    const provider: any = {
      id: '',
      title: ''
    }
    if(type === 'category'){
      provider.id = `s-${catOrSub.categoryId}`;
      provider.title = catOrSub.categoryName;
    }else{
      provider.id = `s-${catOrSub.categoryId}-${catOrSub.subCategoryId}`;
      provider.title = catOrSub.subCategoryName;
    }
    let location: string | object = "";
    if(useUserCurrentLocationHook.userCurrentLocation.length > 0){
      location = {
        lat: useUserCurrentLocationHook.userCurrentLocation[0],
        lng: useUserCurrentLocationHook.userCurrentLocation[1]
      }
    }

    sendDataToResults(provider, location);
  };

  const sendDataToResults = (provider: any, location: any) => {
    router.push(
      {
        pathname: "/search-results",
        query: {
          provider: JSON.stringify(provider),
          location: JSON.stringify(location),
        },
      },
      "/search-results",
      { shallow: true }
    );
  }

  const handleSearch = (data: any) => {
    sendDataToResults(data.provider, data.location);
  };

  return (
    <div className="allCategories">
      <div className="allServicesSection">
        <div>All Services</div>
        <div onClick={()=> router.push('search-results')} className="iconSearchCat">
          <FaSearch
            style={{ fontSize: "20px", color: `${theme.colors.brandWhite}` }}
          />
        </div>
      </div>
      <div className="mainSection">
        {/* <div className='mobileImage'>
                    <Image className='imgBackground' width={360} height={170} objectFit='cover' layout='responsive' quality={100} src={homeMainImg} alt='Logo boaterlist header' />
                </div> */}
        <div className="categoriesSection">
          {allCategories?.map((c: any, ci: number) => (
            <div key={ci}>
              <div className="category">
                <div
                  className="categoryName">
                  <span className="categoryText" onClick={() => onCategoriesClick(c, 'category')}><FaLayerGroup style={{ fontSize: 14, marginRight: 5}}/>{c.categoryName}</span>
                </div>
                <div className="subCategories">
                  {c.subCategories?.map((sc: any, si: number) => (
                    <div
                      key={si}
                      className="subCategory"
                    >
                      <span className="categoryText" onClick={() => onCategoriesClick(sc, 'subcategory')}>{sc.subCategoryName}</span>
                    </div>
                  ))}
                </div>
              </div>
              <hr />
            </div>
          ))}
        </div>
        <div className="imageContainer">
          <Image
            className="imgBackground"
            width={360}
            height={900}
            objectFit="cover"
            layout="fill"
            quality={100}
            src={homeMainImg}
            alt="Logo boaterlist header"
          />
          <div className="searchContainer">
            <div className="search">
              <LocationSearch isMobileView={true} onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .mainSection {
          display: flex;
          flex-direction: row;
        }
        .imageContainer {
          position: relative;
          margin-left: auto;
          width: 360px;
          height: 900px;
          flex-basis: 360px;
          flex-grow: 0;
          flex-shrink: 0;
        }
        .searchContainer {
          position: absolute;
          top: 0;
          width: 360px;
        }
        .search {
          background-color: ${theme.colors.brandWhite};
          border-radius: 20px;
          padding: 25px;
          margin: 20px;
        }
        .allServicesSection {
          display: flex;
          justify-content: space-between;
          background-color: ${theme.colors.brandBlue};
          padding: 5px 15px;
          font-size: 14px;
          color: ${theme.colors.brandWhite};
          font-weight: 600;
        }
        .categoriesSection {
          flex: 1;
          padding: 25px;
        }
        .sectionLocationSearch {
          width: 360px;
        }
        .category {
          display: flex;
          flex-direction: row;
        }
        .categoryName,
        .subCategories {
          flex: 1;
          font-weight: 600;
        }
        .categoryName {
          color: ${theme.colors.brandBlue};
          flex-basis: 300px;
        }
        .subCategories {
          display: flex;
          flex-direction: row;
          flex-basis: 100%;
          flex-shrink: 1;
          flex-wrap: wrap;
        }
        .subCategory {
          flex-basis: 300px;
          padding: 5px 0;
        }
        .iconSearchCat {
          display: none;
          cursor: pointer;
        }
        .categoryText{
          cursor: pointer;
        }
        @media screen and (max-width: 900px) {
          .imageContainer {
            display: none;
          }
          .iconSearchCat {
            display: block;
          }
          .category {
            display: block;
          }
          .subCategories{
            margin-left: 10px;
          }
        }
      `}</style>
    </div>
  );
}
