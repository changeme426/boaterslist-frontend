import React, { useEffect, useState } from 'react'
import theme from '../../../common/theme'
import { useRouter } from "next/router"
import { parseDate } from 'utils/parseDate';


export const Claims = () => {
  const [claims, setClaims] = useState<any>([])
  const router = useRouter()

  const onApiCall = async (url: string) => {
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
  }

  const fetchClaims = async () => {
    const response = await onApiCall(`/api/admin/claim`)
    setClaims(response);
  }

  useEffect(() => {
    fetchClaims();
  }, [])

  const displayRows = () => {
    return claims.map((claim: any, idx: number) => (
      <tr key={idx} className="claim">
        <td className='boatersListEmailFormat' onClick={() => router.push(`/claim/${claim.locationId}`)}>{claim.locationName}</td>
        <td>{claim.address1}</td>
        <td>{claim.claimedBy2}</td>
        <td>{parseDate(claim.claimedOn2)}</td>
        <style jsx>{`
        .rejectBtn{
          margin-right: 3px;
        }
        .claim {
          height: 30px;
          border: 2px solid ${theme.colors.brandGray}
        }
        .claim td{
          border: 2px solid ${theme.colors.brandGray};
          padding: 10px;
          margin-top: 20px;
        }
      `}</style>
      </tr>
    ))
  }

  return (
    <div className="claims">
      <table>
        <thead>
          <tr>
            <th>Location name</th>
            <th>Address</th>
            <th>Requested by</th>
            <th>Requested on</th>
          </tr>
        </thead>
        <tbody>
          {displayRows()}
        </tbody>
      </table>
      <style jsx>{`
        table{
          border-collapse: collapse;
          margin: auto;
        }
        thead {
          font-size: 15px;
          color: ${theme.colors.brandBlack};
          border: 2px solid ${theme.colors.brandGray};
        }
        th{
          border: 2px solid ${theme.colors.brandGray};
          text-align:left;
          padding: 10px;
        }
      `}</style>
    </div>
  );
};
