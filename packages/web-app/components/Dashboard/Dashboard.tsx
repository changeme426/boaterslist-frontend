import React, { useEffect, useState } from "react";
import theme from "common/theme";
import { Category, getAllCategories } from "common/global/categories";
import { Input } from "components/Forms/Input";
import { Button } from "components/Buttons/Button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Constants from "constants/Constants";

export interface IUser {
  email: string
  created: number
  verified: number
}

export function Dashboard() {
  const [tableData, setTableData] = useState<any>(null)

  useEffect(() => {
    const getDashboardData = () => {
      fetch(`${Constants.ApiURL}/api/admin/dashboard`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      }).then(response => response.json())
        .then(result => {
          setTableData(result)
        }).catch(err => {
          console.log(err, "ERROR")
        })
    };
    getDashboardData();
  }, [])

  const displayRows = () => {
    if (tableData) {
      return tableData.locationsByEmail?.map((el: IUser, idx: number) => (
        <tr key={idx} className="user">
          <td>{el.email}</td>
          <td className="created">{el.created}</td>
          <td className="verified">{el.verified}</td>
          <style jsx>{`
            td{
              padding: 5px;
              border-style: solid;
              border-width: 2px;
            }
            .created,.verified{
              text-align: center;
            }
          `}</style>
        </tr>
      ))

    }
    return <></>
  }


  return (
    <div className="dashboardContent">
      <div className="numbers">
        <div>Total of Locations Created: {tableData && tableData.locations}</div>
        <div>Total of Locations Verified: {tableData && tableData.verifiedLocations}</div>
      </div>
      <div className="TableContainer">
        <table>
          <thead>
            <tr>
              <th className="headerItem">Email</th>
              <th className="headerItem created">Locations Created</th>
              <th className="headerItem verified">Locations Verified</th>
            </tr>
          </thead>
          <tbody>
            {
              displayRows()
            }
          </tbody>
        </table>
      </div>
      <style jsx>{`
        table{
          border-collapse: collapse;
          margin: auto;
          text-align: left;
          border-style: solid;
          border-width: 2px;
        }
        .numbers{
          max-width: 400px;
          margin: auto;
          font-size: 18px;
          font-weight: bold;
        }
        .numbers div{
          margin-bottom: 15px;
        }
        thead{
          text-align: left;
          font-size: 16px;
        }
        th{
          border-style: solid;
          border-width: 2px;
        }
        .headerItem{
          padding:10px;
          padding-left: 5px;
        }
        .created, .verified{
          max-width: 100px;
        }
      `}</style>
    </div>
  );
}
