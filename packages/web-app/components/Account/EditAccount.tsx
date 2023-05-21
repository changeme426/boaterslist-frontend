import React, { useState } from "react";
import theme from "../../../common/theme";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Input } from "../Forms/Input";
import { useSignIn } from "../../../common/hooks/useSignIn";
import Button from "../Buttons/Button";
import { updateProfile } from "../../utils/Api/User";
import fetchInstance from "../../utils/fetchInstance";
import { useUser } from '@auth0/nextjs-auth0'

interface formData {
  email?: string
  given_name?: string
  family_name?: string
  // TODO phone/zip
  phone_number?: string
  zip_code?: string
}

export const EditAccount = () => {
  const { user, error, isLoading } = useUser()
  const { handleSubmit, control, formState, setValue } = useForm()
  const userProfileData = (user as formData)
  return <div className="editAccountContainer">
    <div className="editTitle">Edit Account</div>
    <div className="nonEditable">
      <Input
        id="emailNotEditable"
        value={userProfileData?.email}
        disabled
        label={"Email"}
        onChange={() => { }} />
    </div>
    <form>
      <div className="firstNameContainer">
        <Controller
          control={control}
          defaultValue={userProfileData?.given_name}
          name="firstName"
          render={({ field: { value, onChange } }) => (
            <Input
              disabled
              value={value}
              id="firstNameEdit"
              label={"First Name"}
              onChange={onChange} />
          )} />
      </div>
      <div className="lastNameContainer">
        <Controller
          control={control}
          name="lastName"
          defaultValue={userProfileData?.family_name}
          render={({ field: { value, onChange } }) => (
            <Input
              disabled
              value={value}
              id="lastNameEdit"
              label={"Last Name"}
              onChange={onChange} />
          )} />
      </div>
      <div className="phoneContainer">
        <Controller
          control={control}
          defaultValue={""}
          name="phoneNumber"
          render={({ field: { value, onChange } }) => (
            <Input
              disabled
              value={value}
              id="phoneNumberEdit"
              label={"Phone Number"}
              onChange={onChange} />
          )} />
      </div>
      <div className="zipContainer">
        <Controller
          control={control}
          defaultValue={""}
          name="zipCode"
          render={({ field: { value, onChange } }) => (
            <Input
              disabled={true}
              value={value}
              id="zipCodeEdit"
              label={"Zip/Postal Code"}
              onChange={onChange} />
          )} />
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
            paddingTop: 15,
            paddingBottom: 15,
          }}
          title={"Save Profile"}
          type={"submit"}
          disabled={
            true /* TODO Object.keys(Object.keys(formState.dirtyFields)).length === 0*/
          } />
      </div>
    </form>
    {/* TODO <div className="btnContainer">
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
        title={"Show my Businesses"} />
      </div>*/}
    <style jsx>{`
        .editAccountContainer {
          padding: 30px;
          max-height: 700px;
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
        @media screen and (max-width: 750px) {
          .editAccountContainer{
            max-height: 500px;
            padding-top: 0px;
          }
        }
      `}</style>
  </div>
}
