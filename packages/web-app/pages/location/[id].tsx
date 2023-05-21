import React, { useEffect, useState } from "react";
import Head from "next/head";
import theme from "common/theme";
import Constants from 'web-app/constants/Constants'
import hasRole from 'common/utils/hasRole'
import { LocationDetails } from "../../components/LocationDetails/LocationDetails";
import { Locations } from "../../utils/classes/Locations";
import { CompanyCarousel } from "components/LocationDetails/CompanyCarousel";
import useSearch from "common/hooks/useSearch"
import { FaPencilAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import { useUser } from '@auth0/nextjs-auth0'

export default function Location() {
  const router = useRouter();
  const { id } = router.query;
  //const [details, setDetails] = useState<any>(null);
  const search = useSearch(Constants.ApiURL)
  const { user } = useUser()
  const isAdmin = hasRole(user, 'admin')
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!id) {
      return;
    }
    search.getLocationDetail(id as string)

    if (typeof window !== 'undefined') {
      setUrl(window.location.toString())
   }
  }, [id])

  const validateWebsite = (website: string) => {
    const VALIDEMAIL =
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+/gm;
    const websiteExtract = website.match(VALIDEMAIL);
    return websiteExtract ? websiteExtract : null;
  };

  const onOpenWebsite = (website: any) => {
    if (website && website.redirect) {
      window.open(website.parsed, "_blank");
    }
  };

  const getMemberDate = (detail: Locations) => {
    return new Date(detail.dateCreated).getFullYear() || "";
  }

  const details = search.locationDetail

  return details ? (
    <>
      <Head>
        <title>{details.locationName}</title>
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1"/>
        <meta name="description" content={details.description ? details.description : details.locationName} />
        <meta property="og:title" content={details.locationName} />
        <meta property="og:description" content={details.description ? details.description : details.locationName} />
        <meta property="og:image" content="https://www.datocms-assets.com/51196/1628362858-favicon.ico?auto=format&fit=max&w=1200"/>
        <meta property="og:image:alt" content="boater icon"/>
        <meta property="og:url" content={url}/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content={details.locationName}/>
        <meta property="og:locale" content="en"/>
        <meta name="twitter:title" content={details.locationName} />
        <meta name="twitter:description" content={details.description ? details.description : details.locationName} />
        <meta name="twitter:image" content="https://www.datocms-assets.com/51196/1628362858-favicon.ico?auto=format&fit=max&w=1200"/>
        <meta name="twitter:image:alt" content="boater icon"/>
        <meta name="twitter:card" content="summary" />
        <meta name="referrer" content="origin" />
      </Head>
      <div className="LocationDetail">
        <div className="locationNameEdit">
          <div style={{ cursor: details.website ? 'pointer' : 'initial' }}
            onClick={() => onOpenWebsite(details.website)}
            className="companyName">
            {details.locationName}
          </div>{isAdmin &&
            <div className="editIcon">
              <FaPencilAlt name="edit" style={{ cursor: "pointer", fontSize: "20" }} onClick={() => router.push(`/admin/location/${id}`)} />
            </div>}
        </div>
        <div>
          {details.premiere ? <CompanyCarousel locationDetail={details} /> : null}
        </div>
        <LocationDetails locationDetail={details} />
        <style jsx>{`
          .locationNameEdit{
            display: flex;
            justify-content: space-between;
            background-color: ${theme.colors.brandBlueDark};
          }
          .editIcon{
            color: ${theme.colors.brandWhite};
            padding: 10px;
            display: flex;
            align-items: center;
          }
          .companyName{
            color: ${theme.colors.brandWhite};
            font-size: ${theme.locationsDetail.titleSize}px;
            padding: 10px;
          }
          .LocationDetail {
            padding-bottom: 30px;
          }
          .locationName {
            font-size: ${theme.locationsDetail.titleSize}px;
            margin-top: 30px;
          }
          .redirect {
            color: ${theme.colors.brandBlue};
            cursor: pointer;
          }
          .memberSince {
            padding: 10px 0px;
            font-size: 14px;
          }
          @media screen and (max-width: 750px) {
            .LocationDetail{
              margin: 0px;
            }
          }
        `}</style>
      </div>
    </>
  ) : null;
}
