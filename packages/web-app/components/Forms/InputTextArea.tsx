import React, { FC, InputHTMLAttributes } from "react";
import theme from "../../../common/theme";

interface InputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  onChange: any;
  onFocus?: any;
  label?: string;
  isRequiredField: boolean;
  inputRef?: any;
  rows?: number;
}

export const InputTextArea: FC<InputProps> = ({
  onChange,
  onFocus,
  isRequiredField,
  inputRef,
  label,
  ...rest
}) => {
  return (
    <div className="inputTextAreaContainer">
      {label && <span className={isRequiredField ? "label required": "label"}>{label}</span>}
      <textarea
        {...rest}
        ref={inputRef || null}
        autoComplete="off"
        onFocus={(e) => { if (onFocus) onFocus(true, e) }}
        onBlur={(e) => { if (onFocus) onFocus(false, e) }}
        onChange={onChange}
      />

      <style jsx>{`
        .label {
          display: block;
          padding-bottom: 10px;
        }
        .required:after{
          content:" *";
          color: red;
        }
        .inputTextAreaContainer {
          position: relative;
        }
        textarea {
          font-size: 18px;
          border: 2px solid ${theme.colors.brandLightGray};
          font-weight: 300;
          outline: none;
          padding: 14px;
          width: 100%;
          padding-right: 30px;
          border-radius: 10px;
        }
        textarea:focus {
          border: 2px solid ${theme.colors.brandBlack};
        }
      `}</style>
    </div>
  );
};
