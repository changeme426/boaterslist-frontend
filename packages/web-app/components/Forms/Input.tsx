import React, { FC, InputHTMLAttributes } from "react";
import theme from "../../../common/theme";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: any;
  onChange: any;
  onFocus?: any;
  onIconPress?: any;
  isRequiredField?: boolean;
  label?: string;
  inputType?: string;
  inputRef?: any;
}

export const Input: FC<InputProps> = ({
  icon,
  inputType,
  isRequiredField,
  onChange,
  onIconPress,
  onFocus,
  inputRef,
  label,
  ...rest
}) => {
  return (
    <div className="inputContainer">
      {
        inputType && inputType === "radio" ?
          <>
            <input
              {...rest}
              className={'radioBtn'}
              type='radio'
              ref={inputRef || null}
              onChange={onChange}
            />
            {label && <span className={isRequiredField ? "required" : ""}>{label}</span>}
          </> :
          <>
            {label && <span className={isRequiredField ? "label required" : "label"}>{label}</span>}
            <input
              {...rest}
              ref={inputRef || null}
              autoComplete="off"
              onFocus={(e) => { if (onFocus) onFocus(true, e) }}
              onBlur={(e) => { if (onFocus) onFocus(false, e) }}
              onChange={onChange}
            />
            {icon && (
              <span data-testid="iconInput" style={{ top: label ? '40%' : '15%' }} className="icon" onClick={() => onIconPress()}>
                {icon}
              </span>
            )}
          </>
      }


      <style jsx>{`
        .label {
          display: block;
          padding-bottom: 10px;
        }
        .radioBtn{
          width: auto;
          cursor: pointer;
        }
        .required:after{
          content:" *";
          color: red;
        }
        .inputContainer {
          position: relative;
        }
        input {
          font-size: 18px;
          border: 2px solid ${theme.colors.brandLightGray};
          font-weight: 300;
          outline: none;
          padding: 14px;
          width: 100%;
          padding-right: 30px;
          border-radius: 10px;
        }
        .icon {
          cursor: pointer;
          text-align: center;
          position: absolute;
          right: 0;
          padding: 8px;
          font-size: 20px;
        }
        input:focus {
          border: 2px solid ${theme.colors.brandBlack};
        }
      `}</style>
    </div>
  );
};
