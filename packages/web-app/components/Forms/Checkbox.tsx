import React, { InputHTMLAttributes } from "react";
import theme from "../../../common/theme";

interface InputCheckProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: any;
}

export function Checkbox({ label, ...rest }: InputCheckProps) {
  return (
    <div className="CheckboxContainer">
      <input type="checkbox" {...rest} />
      <label>{label}</label>

      <style jsx>{`
        .CheckboxContainer {
          display: flex;
          align-items: center;
          margin: 10px 0px;
        }
        input {
          width: 20px;
          height: 20px;
          min-width: 20px;
          margin-right: 20px;
          border-radius: 5px;
          border: 2px solid ${theme.colors.brandLightGray};
          cursor: pointer;
        }
        label {
          font-size: 15px;
        }
      `}</style>
    </div>
  );
}
