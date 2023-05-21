import React, { useEffect, useState } from "react";
import theme from "../../../common/theme";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Input } from "../Forms/Input";
import { useSignIn } from "../../../common/hooks/useSignIn";
import Button from "../Buttons/Button";
import { updateProfile } from "../../utils/Api/User";
import { SelectInput } from "../Forms/SelectInput";
import Cookies from "js-cookie";
import { getUserAgents } from "../../utils/Api/Providers";
import fetchInstance from "../../utils/fetchInstance";

interface formData {
  businessName: string;
  referredBy: string;
}

export const CreateBusinessListing = () => {
  const { handleSubmit, control, formState, reset } = useForm({
    mode: "onChange",
  });
  const [userAgents, setUserAgents] = useState([]);

  useEffect(() => {
    const getUserAgentsData = async () => {
      try {
        let response = await fetchInstance(`/users/agents`, { method: "GET" });
        setUserAgents(response && response.data);
      } catch (error) {
        console.log("ERROR TRYING TO FETCH AGENTS DATA");
      }
    };
    getUserAgentsData();
  }, []);

  const onSubmit: SubmitHandler<any> = async (formValues: formData, e: any) => {
    const payload = {
      referralId: +formValues.referredBy,
      companyData: { companyName: formValues.businessName },
    };
    try {
      let response = await fetchInstance(`/providers`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.log("ERROR TRYING TO ADD COMPANY");
    }

    e.target.reset();
  };

  return (
    <div className="editAccountContainer">
      <div className="editTitle">Create Business Listing</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="businessNameContainer">
          <Controller
            control={control}
            defaultValue={""}
            rules={{ required: true }}
            name="businessName"
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                id="businessNameInput"
                label={"Business Name"}
                onChange={onChange}
              />
            )}
          />
        </div>
        <div className="refferedByContainer">
          <Controller
            control={control}
            name="referredBy"
            defaultValue={"-1"}
            render={({ field: { value, onChange } }) => (
              <SelectInput
                value={value}
                id="referredBy"
                defaultOption={"Found By Myself"}
                label={"Referred By"}
                optionData={userAgents}
                onChange={onChange}
              />
            )}
          />
        </div>
        {/* {response === "success" && (
          <div className="responseModify">Profile Updated Successfully!</div>
        )}
        {response === "error" && (
          <div className="responseModify Error">
            Error trying to update profile!
          </div>
        )} */}
        <div className="btnContainer">
          <Button
            style={{
              backgroundColor: `${theme.colors.brandBlue}`,
              color: `${theme.colors.brandWhite}`,
              paddingLeft: 50,
              paddingRight: 50,
              width: "100%",
              margin: 0,
              paddingTop: 15,
              paddingBottom: 15,
            }}
            title={"Create Business"}
            disabled={!formState.isValid}
            type={"submit"}
          />
        </div>
      </form>
      <style jsx>{`
        .editAccountContainer {
          padding: 30px;
          max-height: 560px;
          overflow-y: auto;
        }
        .responseModify {
          text-align: center;
          font-size: 18px;
        }
        .editAccountContainer div {
          margin-bottom: 20px;
        }
        .editTitle {
          font-size: ${theme.boaterslistInfo.subtitleFontSize};
        }
      `}</style>
    </div>
  );
};
