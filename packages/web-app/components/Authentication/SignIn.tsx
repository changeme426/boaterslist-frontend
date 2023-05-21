import React from "react";
import { Input } from "../Forms/Input";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import theme from "../../../common/theme";
import Button from "../Buttons/Button";
import { SignInRequest } from "../../utils/Api/Auth";
import { useSignIn } from "../../../common/hooks/useSignIn";
import Cookies from "js-cookie";

type signInProps = {
  onLinkClick: (opt: string) => void;
  onSignInSuccess: (opt: boolean) => void;
};

export const SignIn = ({ onLinkClick, onSignInSuccess }: signInProps) => {
  const { handleSubmit, control, formState, reset } = useForm({
    mode: "onChange",
  });

  const userHook = useSignIn();

  const onSubmit: SubmitHandler<any> = async (dataEvent) => {
    const credentials: any = {
      username: dataEvent.email,
      password: dataEvent.password,
    };
    Cookies.set("user", JSON.stringify(dataEvent.email));
    userHook.addUser({email: dataEvent.email});
    onSignInSuccess(true);
    reset()
    // try {
    //   const user = await SignInRequest(credentials);
    //   const userData = await user.json();
    //   if (userData.error) {
    //     onSignInSuccess(false);
    //     return;
    //   }
    //   const expireDate = new Date();
    //   expireDate.setSeconds(expireDate.getSeconds() + userData.auth.expires_in);
    //   const cookieExpire = Math.floor(userData.auth.expires_in / (3600 * 24)) || 0;
    //   Cookies.set("user", JSON.stringify(userData), { expires: cookieExpire });
    //   Cookies.set("expireToken", expireDate);
    //   onSignInSuccess(true);

    //   userHook.addUser(userData);
    // } catch (error) {
    //   onSignInSuccess(false);
    // }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="signInContainer">
        <div className="title">Welcome</div>
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
                  id="signInEmail"
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
                  id="signInPassword"
                  inputRef={ref}
                  onBlur={onBlur}
                  name={name}
                  value={value}
                  type="password"
                  label={"Password"}
                  onChange={onChange}
                />
                {isTouched && value === "" && (
                  <span className="errorText">Your password is Required</span>
                )}
              </div>
            )}
          />
        </div>
        <div className="options">
          <span onClick={() => onLinkClick("Sign Up")}>Sign Up</span>
          <span onClick={() => onLinkClick("Forgot Password")}>Forgot Password?</span>
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
            title={"Sign In"}
            disabled={!formState.isValid}
            type={"submit"}
          />
        </div>
        <div className="bussinessOwners">
          <span onClick={() => onLinkClick("Business SignUp")}>
            Business Owners Sign up Here
          </span>
        </div>
      </div>

      <style jsx>{`
        .signInContainer {
          padding: 30px;
          max-width: 400px;
          min-width: 320px;
        }
        .title {
          font-size: 24px;
          margin-bottom: 20px;
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

export default SignIn;
