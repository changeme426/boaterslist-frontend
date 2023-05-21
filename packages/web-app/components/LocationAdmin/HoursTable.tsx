import React, { useEffect, useState } from "react";
import theme from "../../../common/theme";
import Button from "../Buttons/Button";
import { DAYMAP } from "common/utils/daysAndHours";

type PropsType = {
  operatingHoursData: Array<string>;
  onTableChange: (val: Array<string>) => void;
};

export const HoursTable = ({ operatingHoursData, onTableChange }: PropsType) => {
  const headerData = ['From day', 'To day', 'From time', 'To time', "action"];

  const [operatingHours, setOperatingHours] = useState(operatingHoursData);
  useEffect(() => {
    if (operatingHoursData) {
      setOperatingHours(operatingHoursData);
    }
  }, [operatingHoursData])

  const onDelete = (value: number) => {
    let deleteHour: Array<string> = [];
    if (operatingHours.length > 1) {
      deleteHour = operatingHours.filter((val: string, idx: number) => idx === value);
      onTableChange(deleteHour);
    } else {
      onTableChange(deleteHour);
    }
  }

  const tableHeader = () => {
    return headerData.map((data, idx) => {
      return (
        <td key={idx}>{data}</td>
      )
    })
  }

  const returnTableData = () => {
    return operatingHours.map((hour: any, idx: number) => {
      return (
        <tr key={idx}>
          <td>{DAYMAP.get(hour.dayFrom)}</td>
          <td>{DAYMAP.get(hour.dayTo)}</td>
          <td>{hour.timeFrom}</td>
          <td>{hour.timeTo}</td>
          <td className="btnDelete"><Button
            style={{
              backgroundColor: `${theme.colors.brandRedError}`,
              color: `${theme.colors.brandWhite}`,
              width: 80,
              margin: 0,
              fontSize: 14,
              padding: '5px 0px'
            }}
            onClick={() => onDelete(idx)}
            title={"Delete"}
          /></td>
          <style jsx>{`
          td {
            width: 100px;
            padding: 5px;
          }
          .btnDelete{
            padding-left: 0;
          }
        `}</style>
        </tr>
      )
    });
  }

  return (
    <div className="HoursTable">
      <>
        <table>
          <thead style={{ borderBottom: `1px solid ${theme.colors.brandGray}` }}>
            <tr>
              {tableHeader()}
            </tr>
          </thead>
          <tbody>
            {returnTableData()}
          </tbody>
        </table>
      </>
      <style jsx>{`
          .HoursTable{
            width: 100%;
            overflow: auto;
            padding-bottom: 10px;
            min-height: 150px;
          }
          table{
            margin-top: 20px;
            font-size: 16px;
            border-collapse: collapse;
            min-width: 500px;
            width: 100%;
          }
          thead {
            font-weight: bold;
          }
        `}</style>
    </div>

  );
};

export default HoursTable;
