import React, { useState } from "react";
import { Input } from "../Forms/Input";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import theme from "../../../common/theme";
import Button from "../Buttons/Button";
import { ForgotPasswordRequest } from "../../utils/Api/Auth";

export const ForgotPassword = () => {
  const [response, setResponse] = useState("");
  const { handleSubmit, control, formState } = useForm({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<any> = async (dataEvent) => {
    const payload: any = {
      email: dataEvent.emailForgot,
    };
    try {
      const forgot = await ForgotPasswordRequest(payload);
      const forgotJson = await forgot.json();
      setResponse("success")
    } catch (error) {
      console.log("ERROR TRYING TO SEND RECOVER EMAIL");
      setResponse("error")
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="ForgotPasswordContainer">
        <div className="title">Forgot Password</div>
        <div className="emailContainer">
          <Controller
            control={control}
            defaultValue={""}
            name="emailForgot"
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
                  id="emailForgot"
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
        <div className="btnContainer">
          <Button
            style={{
              backgroundColor: `${theme.colors.brandBlue}`,
              color: `${theme.colors.brandWhite}`,
              paddingLeft: 50,
              paddingRight: 50,
              width: "100%",
              margin: 0,
              paddingTop: 20,
              paddingBottom: 20,
            }}
            title={"Forgot Password"}
            disabled={!formState.isValid}
            type={"submit"}
          />
        </div>
        {response === "success" && (
          <div className="responseModify">Please check your email!</div>
        )}
        {response === "error" && (
          <div className="responseModify Error">
            Error trying to send email!
          </div>
        )}
      </div>

      <style jsx>{`
        .ForgotPasswordContainer {
          padding: 30px;
          max-width: 400px;
          min-width: 320px;
        }
        .title {
          font-size: 24px;
          margin-bottom: 20px;
        }
        .btnContainer {
          margin: 20px 0px;
        }
        .responseModify {
          text-align: center;
          font-size: 18px;
        }
      `}</style>
    </form>
  );
};

export default ForgotPassword;
