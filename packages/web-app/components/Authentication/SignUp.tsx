import React, { useState } from "react";
import PropTypes from "prop-types";
import { SignInRequest, SignUpRequest } from "../../utils/Api/Auth";
import { useSignIn } from "../../../common/hooks/useSignIn";
import { Input } from "../Forms/Input";
import { Checkbox } from "../Forms/Checkbox";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { BusinessSuccessInfo } from "./BusinessSuccessInfo";
import theme from "../../../common/theme";
import Button from "../Buttons/Button";
import Link from "next/link";
import Cookies from "js-cookie";

type signUpProps = {
  type: string;
  onSignUpSuccess: (opt: boolean) => void;
  onLinkClick: (opt: string) => void;
};

export const SignUp = ({ type, onSignUpSuccess, onLinkClick }: signUpProps) => {
  const userHook = useSignIn();
  const [revealPass, setRevealPass] = useState("password");
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [businessSuccess, setBusinessSuccess] = useState(false);
  const { handleSubmit, control, formState, watch, trigger } = useForm({
    mode: "onChange",
  });
  const watchPass = watch("password");

  const onSubmit: SubmitHandler<any> = async (data) => {
    const reqSignUp = {
      email: data.email,
      familyName: data.firstName,
      givenName: data.lastName,
      password: data.password,
      role: type === "SignUp" ? "consumer" : "service_provider",
    };
    if (type === "SignUp") {
      reqSignUp.role = "consumer";
    }
    try {
      const user = await SignUpRequest(reqSignUp);
      const userData = await user.json();
      if (userData.error) {
        onSignUpSuccess(false);
        return;
      }
      const userSignIn = await SignInRequest({
        username: reqSignUp.email,
        password: reqSignUp.password,
      });
      const userSignInData = await userSignIn.json();
      Cookies.set("user", JSON.stringify(userSignInData));
      if (type === "SignUp") {
        onSignUpSuccess(true);
      } else {
        setBusinessSuccess(true);
      }
      userHook.addUser(userSignInData);
    } catch (error) {
      onSignUpSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="signUpContainer">
        <div className="signUpFormFields">
          {businessSuccess ? (
            <BusinessSuccessInfo />
          ) : (
            <div>
              <div className="title">
                {type === "SignUp" ? "Create Account" : "Provider Sign Up"}
              </div>
              <div className="emailContainer">
                <Controller
                  control={control}
                  defaultValue={""}
                  name="email"
                  rules={{
                    required: true,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email should be in correct format",
                    },
                  }}
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                    fieldState: { isTouched, error },
                  }) => (
                    <div>
                      <Input
                        id="signUpEmail"
                        inputRef={ref}
                        onBlur={onBlur}
                        name={name}
                        value={value}
                        label={"Email"}
                        onChange={onChange}
                      />
                      {isTouched && value === "" && (
                        <span className="errorText">Email is Required</span>
                      )}
                      {isTouched && error && (
                        <span className="errorText">{error.message}</span>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="firstNameContainer">
                <Controller
                  control={control}
                  defaultValue={""}
                  name="firstName"
                  rules={{ required: true }}
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                    fieldState: { isTouched },
                  }) => (
                    <div>
                      <Input
                        id="firstNameSignUp"
                        inputRef={ref}
                        onBlur={onBlur}
                        name={name}
                        value={value}
                        label={"First Name"}
                        onChange={onChange}
                      />
                      {isTouched && value === "" && (
                        <span className="errorText">
                          First name is Required
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="lastNameContainer">
                <Controller
                  control={control}
                  defaultValue={""}
                  name="lastName"
                  rules={{ required: true }}
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                    fieldState: { isTouched },
                  }) => (
                    <div>
                      <Input
                        id="lastNameSignUp"
                        inputRef={ref}
                        onBlur={onBlur}
                        name={name}
                        value={value}
                        label={"Last Name"}
                        onChange={onChange}
                      />
                      {isTouched && value === "" && (
                        <span className="errorText">Last name is Required</span>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="passwordContainer">
                <Controller
                  control={control}
                  defaultValue={""}
                  name="password"
                  rules={{ required: true }}
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                    fieldState: { isTouched },
                  }) => (
                    <div>
                      <Input
                        id="signUpPassword"
                        inputRef={ref}
                        onBlur={onBlur}
                        name={name}
                        value={value}
                        type={revealPass}
                        label={"Password"}
                        onChange={async (e: any) => {
                          await onChange(e);
                          trigger("confirmPassword");
                        }}
                      />
                      {isTouched && value === "" && (
                        <span className="errorText">
                          Your password must include: a minimum of eight
                          characters, at least one uppercase letter, one
                          lowercase letter and one number
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="revealPass">
                <Checkbox
                  label="Reveal Password"
                  onChange={(e: any) =>
                    setRevealPass(e?.target.checked ? "text" : "password")
                  }
                />
              </div>
              <div className="confirmPassContainer">
                <Controller
                  control={control}
                  defaultValue={""}
                  rules={{
                    required: true,
                    validate: (confirmPassSignUp: string) =>
                      confirmPassSignUp === watchPass,
                  }}
                  name="confirmPassword"
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                    fieldState: { isTouched, error },
                  }) => (
                    <div>
                      <Input
                        id="confirmPassSignUp"
                        inputRef={ref}
                        onBlur={onBlur}
                        name={name}
                        value={value}
                        type="password"
                        label={"Confirm Password"}
                        onChange={onChange}
                      />
                      {isTouched && value === "" && (
                        <span className="errorText">
                          Confirmation Password is required
                        </span>
                      )}
                      {error && value && (
                        <span className="errorText">
                          Confirmation Password, must match
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="agreePrivacy">
                <Checkbox
                  onChange={(e: any) => setAgreePolicy(e?.target.checked)}
                  label={
                    <label>
                      I agree to the{" "}
                      <span
                        onClick={() => onSignUpSuccess(true)}
                        className="linkFormat"
                      >
                        <Link href={"/terms"}>terms of service</Link>
                      </span>{" "}
                      and the{" "}
                      <span
                        onClick={() => onSignUpSuccess(true)}
                        className="linkFormat"
                      >
                        <Link href={"/privacy"}>privacy policy</Link>
                      </span>{" "}
                    </label>
                  }
                />
              </div>
              <div className="btnContainer">
                <Button
                  style={{
                    backgroundColor: `${theme.colors.brandBlue}`,
                    color: `${theme.colors.brandWhite}`,
                    paddingLeft: 50,
                    paddingRight: 50,
                    width: "100%",
                    margin: 0,
                    padding: "15px",
                  }}
                  title={
                    type === "SignUp"
                      ? "Create Account"
                      : "Create Provider Account"
                  }
                  disabled={!(formState.isValid && agreePolicy)}
                  type={"submit"}
                />
              </div>
              {type === "SignUp" && (
                <div className="bussinessOwners">
                  <span
                    onClick={() =>
                      onLinkClick && onLinkClick("Business SignUp")
                    }
                  >
                    Business Owners Sign up Here
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .title {
          font-size: 24px;
          margin-bottom: 20px;
        }
        .signUpContainer {
          padding: 30px;
          width: 320px;
          max-height: 500px;
          overflow: auto;
        }
        .linkFormat {
          color: ${theme.colors.brandBlue};
          font-weight: 600;
        }
        .options {
          display: flex;
          font-size: 15px;
          font-weight: 600;
          margin: 10px 0px;
          color: ${theme.colors.brandBlue};
          justify-content: space-between;
          cursor: pointer;
        }
        .btnContainer {
          margin: 20px 0px;
        }
        .bussinessOwners {
          text-align: center;
          font-weight: 600;
          cursor: pointer;
          color: ${theme.colors.brandBlue};
        }
      `}</style>
    </form>
  );
};

SignUp.propTypes = {
  type: PropTypes.string.isRequired,
};

export default SignUp;
