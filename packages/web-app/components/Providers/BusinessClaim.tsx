import React, { useState } from "react";
import theme from "../../../common/theme";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Input } from "../Forms/Input";
import { useSignIn } from "../../../common/hooks/useSignIn";
import Button from "../Buttons/Button";
import { updateProfile } from "../../utils/Api/User";
import fetchInstance from "../../utils/fetchInstance";

interface formData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

type PropsType = {
  providerDetails: any;
  claimedCompany: any;
};

export const BusinessClaim = ({
  providerDetails,
  claimedCompany,
}: PropsType) => {
  const userHook = useSignIn();
  const { handleSubmit, control, formState, setValue } = useForm();
  const userProfileData = providerDetails;

  const onSubmit: SubmitHandler<any> = async (formValues: formData) => {
    try {
      let response = await fetchInstance(
        `/providers/${claimedCompany.companyId}/claim`,
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.log("ERROR TRYING TO CLAIM COMPANY");
    }
  };
  return (
    <div className="editAccountContainer">
      <div className="editTitle">Business Claim</div>
      <div className="nonEditable">
        <Input
          id="emailNotEditable"
          value={userProfileData?.email || ""}
          disabled
          label={"Email(non-editable)"}
          onChange={() => {}}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="firstNameContainer">
          <Controller
            control={control}
            defaultValue={userProfileData?.given_name || ""}
            name="firstNameBusiness"
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                id="firstNameBusiness"
                label={"First Name"}
                onChange={onChange}
              />
            )}
          />
        </div>
        <div className="lastNameContainer">
          <Controller
            control={control}
            name="lastNameBusiness"
            defaultValue={userProfileData?.family_name || ""}
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                id="lastNameBusiness"
                label={"Last Name"}
                onChange={onChange}
              />
            )}
          />
        </div>
        <div className="phoneContainer">
          <Controller
            control={control}
            defaultValue={userProfileData?.user_metadata.phone_number || ""}
            name="phoneNumberBusiness"
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                id="phoneNumberBusiness"
                label={"Phone Number"}
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
            title={"Create Claim"}
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
        .nonEditable {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};
