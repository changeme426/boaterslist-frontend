import React, { FC, ButtonHTMLAttributes } from "react";
import PropTypes from "prop-types";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  disabled?: boolean;
}

export const Button: FC<ButtonProps> = ({ title, disabled, ...rest }) => {
  const disabledBtn = disabled ? disabled : false;
  return (
    <>
      <button
        {...rest}
        disabled={disabledBtn}
        className={disabledBtn ? "btn disabledBtn" : "btn"}
      >
        {title}
      </button>

      <style jsx>{`
        .btn {
          width: 100%;
          border-radius: 40px;
          border-width: 0px;
          border-style: outset;
          cursor: pointer;
          padding: 8px 15px;
          outline: none;
          justify-content: center;
          font-size: 18px;
        }
        .disabledBtn {
          opacity: 0.5;
        }
      `}</style>
    </>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default Button;
