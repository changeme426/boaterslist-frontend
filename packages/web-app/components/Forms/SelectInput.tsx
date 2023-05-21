import React, { SelectHTMLAttributes } from "react";
import theme from "../../../common/theme";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: any;
  defaultOption?: any;
  optionData: any;
}

export function SelectInput({ label,defaultOption, optionData, ...rest }: SelectProps) {
  return (
    <div className="SelectContainer">
      {label && <div className="label">
          <label>{label}</label>
        </div>}
      <div className="selectContent">
        <select name="select" {...rest}>
          {defaultOption && <option value={"-1"}>{defaultOption}</option>}
          {optionData.map((op: any, idx: number) => (
            <option value={op.userId} key={idx}>{op.referralCode}</option>
          ))}
        </select>
      </div>

      <style jsx>{`
        select {
          font-size: 18px;
          border: 2px solid ${theme.colors.brandLightGray};
          font-weight: 300;
          outline: none;
          padding: 14px;
          width: 100%;
          padding-right: 20px;
          border-radius: 10px;
        }
        .label {
          font-size: 15px;
          padding-bottom: 10px;
        }
      `}</style>
    </div>
  );
}
