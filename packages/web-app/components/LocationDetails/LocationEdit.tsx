import React, { Fragment, useEffect, useState } from "react";
import theme from "common/theme";
import Constants from 'web-app/constants/Constants'
import { useRouter } from "next/router";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Input } from "components/Forms/Input";
import { getAllCategories, getSubCategory, getCategoriesForSubCategories } from 'common/global/categories'
import Select, { components, GroupHeadingProps } from 'react-select';
import { Checkbox } from "components/Forms/Checkbox";
import { FaPencilAlt } from "react-icons/fa";
import { formattedHours } from "common/utils/FormattedHours";
import OperatingHours from "components/LocationAdmin/OperatingHours";
import { Locations } from 'common/models/Locations'
import Modal from "components/Common/Modal";
import Button from "components/Buttons/Button";
import useSearch from "common/hooks/useSearch"
import hasRole from 'common/utils/hasRole'
import { defaultLocationEditBtns } from '../../utils/defaultStyles';
import { InputSearchLocation } from "components/Forms/InputSearchLocation";
import PopUpConfirm from "components/LocationAdmin/PopUpConfirm";
import { InputTextArea } from "components/Forms/InputTextArea";
import { useUser } from '@auth0/nextjs-auth0'
import { LocationsResults } from "./LocationsResults";
import { getAddressComponents } from "utils/parseLocation";
import { parseDate } from "utils/parseDate";
import { Approvals } from "components/Admin/Approvals";
import RadioGroupInterested from "./RadioGroupInterested";

function getAddressLine(a: any) {
  let line = ''
  if (a.address1) line += (line ? ', ' : "") + a.address1
  if (a.city) line += (line ? ', ' : "") + a.city
  if (a.state) line += (line ? ', ' : "") + a.state
  if (a.zipCode) line += (line ? ', ' : "") + a.zipCode
  if (a.country) line += (line ? ', ' : "") + a.country
  const r = { locationText: line } as any
  if (a.coordinate) {
    r.lat = a.coordinate.lat
    r.lng = a.coordinate.lng
  }
  return r
}

const howDidyouHearAboutUsValues = [
  { label: 'Tradeshow', value: 'tradeshow' },
  { label: 'Social Media', value: 'socialMedia' },
  { label: 'Fishing Tournament', value: 'fishingTournament' },
  { label: 'Search Engine', value: 'searchEngine' },
  { label: 'Referral', value: 'referral' },
  { label: 'Other', value: 'other' }
]

const bestFormCommunicationValues = [
  { label: 'Phone', value: 'phone' },
  { label: 'Email', value: 'email' },
  { label: 'Text', value: 'text' }
]

type PropsType = {
  id?: string,
  viewType?: string
}

export default function LocationEdit({ id, viewType }: PropsType) {
  const router = useRouter()
  const { user } = useUser()
  const isAdmin = hasRole(user, 'admin')
  const [modalDisplay, setModalDisplay] = useState({ show: false, type: '' });
  const [isPremiere, setIsPremiere] = useState(false);
  const [noSimilarLocations, setNoSimilarLocations] = useState(false);
  const [callToCheck, setCallToCheck] = useState<any>(false);
  const [hasBeenSaved, setHasbeenSaved] = useState(true);
  const [approveRejectAction, setApproveRejectAction] = useState('');
  const isClaim = viewType === 'claim';
  const requiredCustom: any = {
    location: true,
    categories: true,
  }
  if (isClaim) {
    // if (!id) {
    //   requiredCustom['hasSearchClaim'] = false;
    // }
    requiredCustom['interested'] = false;
  }
  const [validateCustomFields, setValidateCustomFields] = useState(requiredCustom);
  const [locationActive, setLocationActive] = useState(true)
  const { handleSubmit, control, formState: { isDirty, errors, isValid }, setValue, getValues, unregister, register } = useForm({
    mode: "onChange",
  })
  const search = useSearch(Constants.ApiURL)

  const categories = getAllCategories().map((cat: any) => ({
    label: cat.categoryName,
    options: cat.subCategories.map((sub: any) => ({ label: sub.subCategoryName, value: parseInt(sub.subCategoryId) }))
  }));
  useEffect(() => {
    if (!id) {
      // new location
      requiredCustom.location = false;
      requiredCustom.categories = false;
      setValidateCustomFields(requiredCustom);
      setHasbeenSaved(false);
      setValue('dateCreated', new Date().toISOString())
      search.setLocationDetail({} as Locations)
      if (isClaim) {
        setValue('claimedBy2', user?.email);
        setValue('claimedOn2', new Date().toISOString())
      }
    } else {
      search.getLocationDetail(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const onCloseModal = () => {
    setModalDisplay(prevState => ({ ...prevState, show: false }))
  }

  const onClaimError = () => {
    return <div className="errorClaim">
      <div>Error trying to {id ? 'edit' : 'create'} claim</div>
      <style jsx>{`
        .errorClaim {
          padding: 20px;
          padding-top: 0px;
        }
      `}</style>
    </div>
  }

  const onAdminErrorApprove = () => {
    return <div className="errorAdmin">
      <div>Error trying to {approveRejectAction} this claim</div>
      <style jsx>{`
        .errorAdmin {
          padding: 20px;
          padding-top: 0px;
        }
      `}</style>
    </div>
  }

  const groupStyles = {
    color: 'white',
    background: theme.colors.brandBlueDark,
    padding: '5px 0px',
    display: 'flex',
  }

  const GroupHeading = (
    props: GroupHeadingProps<any>
  ) => (
    <div style={groupStyles}>
      <components.GroupHeading {...props} />
    </div>
  )

  const onConfirmActiveInactive = () => {
    setValue('active', !locationActive, { shouldDirty: true });
    setLocationActive(!locationActive);
    setModalDisplay(prevState => ({ ...prevState, show: false }))
  }

  const handleOperatingHours = (value: any) => {
    if (value && value !== "") {
      if (value.length > 0) {
        if (value[0].callToCheck) {
          return ""
        }
        return formattedHours(value);
      }
    }
    return ""
  }
  const onApprove = async () => {
    setApproveRejectAction('approve')
    const formToSave = onFormToSave();
    if (id) {
      const saveEdit = await onClaimUpdate(id, formToSave);
      setHasbeenSaved(true);
      if (saveEdit.status === 200) {
        const response = await fetch(`/api/admin/claim/${id}/approve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formToSave)
        });
        if (response?.status !== 200) {
          setModalDisplay({ show: true, type: 'approveRejectError' })
          return;
        }
        const jsonData = await response.json();
        router.push('/admin')
      } else {
        setModalDisplay({ show: true, type: 'approveRejectError' })
        return;
      }
    }



  }

  const onCancelSave = () => {
    if (id) {
      if (isClaim) {
        router.push(`/location/${details?.claimedFromId2}`);
      } else {
        router.push(`/location/${id}`);
      }
    } else {
      (isClaim) ? router.push('/') :
        router.push('/admin')
    }
  }

  const onReject = async () => {
    setApproveRejectAction('reject');
    const response = await fetch(`/api/admin/claim/${id}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response?.status !== 200) {
      setModalDisplay({ show: true, type: 'approveRejectError' })
      return;
    }
    const jsonData = await response.json();
    router.push('/admin')
  }

  const onUploadImage = async (e: any, name: string) => {
    const filename = encodeURIComponent(`loc-${id}-${name}.jpg`)
    const res = await fetch(`${Constants.ApiURL}/api/admin/location/${id}/uploadurl?file=${filename}`)
    const { url, fields } = await res.json()
    const formData = new FormData()
    const file = e.target.files[0]
    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value as any)
    })
    const upload = await fetch(url, { method: 'POST', body: formData })
    if (upload.ok) {
      console.log('Uploaded successfully')
    } else {
      console.log('Upload failed', upload)
    }
    return
  }

  const details = search.locationDetail

  useEffect(() => {
    if (details && Object.keys(details).length !== 0) {
      setIsPremiere(details?.premiere as any)
      !isClaim && setLocationActive(details.active)
      if (details?.operatingDaysHoursJSON && details?.operatingDaysHoursJSON[0] && details?.operatingDaysHoursJSON[0].callToCheck) {
        setCallToCheck(true)
      }
      setValue('address1', details?.address1)
      setValue('state', details?.state)
      setValue('city', details?.city)
      setValue('country', details?.country)
      if (details.interestedIn2 && details.interestedIn2 !== "") {
        setValidateCustomFields((prevState: any) => ({ ...prevState, interested: true }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details])

  useEffect(() => {
    if (search.result) {
      if (search.result.length > 0 && search.result[0].data.length > 0) {
        setNoSimilarLocations(false)
        setModalDisplay({ show: true, type: 'locationResultsView' })
      } else {
        setNoSimilarLocations(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.result])

  const onLocationSearch = () => {
    // if (!id) {
    //   setValidateCustomFields((prevState: any) => ({ ...prevState, hasSearchClaim: true }))
    // }
    const locationName = getValues().locationName
    if (locationName && getValues().coordinate) {
      search.doSearch(locationName, [getValues().coordinate.lat, getValues().coordinate.lon], undefined, undefined,
        undefined, undefined, id)
    }
  }

  const modalSuccess = () => {
    return <div className="modalSuccess">
      <div className="textTitle">New claim/update submitted</div>
      <div className="buttonContent">
        <Button
          onClick={() => router.push('/')}
          style={{
            backgroundColor: `${theme.colors.brandBlue}`,
            color: `${theme.colors.brandWhite}`,
            margin: 0,
            maxWidth: 60
          }}
          title={"Ok"}
          type={'button'}
        />
      </div>

      <style jsx>{`
        .textTitle{
          margin-bottom: 10px;
        }
        .modalSuccess{
          padding: 20px;
          padding-top: 0;
        }
        .buttonContent{
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  }
  const onFormToSave = () => {
    let values = getValues()
    let formToSave: any = id ? { ...search.locationDetail } : {}
    for (const field in values) {
      switch (field) {
        case 'promotedKeywords':
          let pk: string[] = []
          if (values[field]) {
            values[field].split(' ').forEach((v: string) => {
              let tv = v.trim()
              if (tv) {
                pk.push(tv)
              }
            })
          }
          formToSave[field] = pk
          break
        case 'promotedSubCategories':
          formToSave[field] = values[field].map((v: any) => parseInt(v.value))
          break
        case 'subCategories':
          formToSave[field] = values[field].map((v: any) => parseInt(v.value))
          formToSave.categories = getCategoriesForSubCategories(formToSave[field])
          break
        case 'claimedOn2':
          formToSave[field] = formToSave[field]
          break;
        default:
          formToSave[field] = values[field]
      }
    }
    return formToSave
  }

  const onClaimUpdate = async (id: string, formToSave: any) => {
    const response = await fetch(`/api/location/${id}/claim`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formToSave)
    });
    return response;
  }

  const onSubmit: SubmitHandler<any> = async (formValues: any) => {
    if (Object.values(validateCustomFields).every(
      value => value === true
    )) {
      const formToSave = onFormToSave();
      if (callToCheck) {
        formToSave.operatingDaysHoursJSON = [{ callToCheck: 'Call to check availability or schedule' }];
      }

      let openId = id
      if (openId) {
        if (isClaim) {
          const response = await onClaimUpdate(openId, formToSave);
          if (response?.status !== 200) {
            setModalDisplay({ show: true, type: 'claimError' })
            return;
          }
          setModalDisplay({ show: true, type: 'saveSucess' })
        } else {
          formToSave.active = locationActive;
          await search.saveLocationDetail(formToSave)
          setHasbeenSaved(true);
          router.push(`/location/${openId}`)
        }
      } else {
        let r = null;
        // new location
        if (isClaim) {
          r = await fetch(`/api/location/claim`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formToSave)
          });
          if (r?.status !== 200) {
            setModalDisplay({ show: true, type: 'claimError' })
            return;
          }
          r = await r.json();
          setModalDisplay({ show: true, type: 'saveSucess' })
        } else {
          formToSave.active = locationActive;
          r = await search.newLocationDetail(formToSave)
          setHasbeenSaved(true);
          const newId = r ? r.id : null
          router.push(newId ? `/location/${newId}` : `/`)
        }
      }
      return
    }
    return false;
  }

  return details ? (
    <div className="LocationDetail">
      {viewType === "claim" &&
        <div className="claimBusinessTitle formFieldContent">
          Claim This Business
        </div>}
      <div className="formContainer">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="formFieldContent">
            <div className="internalContent">
              <div className="formBlock">
                <div className="controllerContainer locationName">
                  <Controller
                    control={control}
                    defaultValue={details.locationName || ""}
                    rules={{
                      required: true
                    }}
                    name="locationName"
                    render={({ field: { value, onChange }, fieldState: { isDirty }, },) => (
                      <>
                        <Input
                          value={value}
                          isRequiredField
                          id="locationNameInput"
                          label={"Location Name"}
                          onChange={onChange} />
                        {errors.locationName && (
                          <span className="errorText">Location Name is Required</span>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="formBlock locationSection">
                <div className="controllerContainer locationSection">
                  <Controller
                    control={control}
                    defaultValue={details ? {
                      address1: details.address1,
                      city: details.city,
                      state: details.state,
                      zipCode: details.zipCode,
                      country: details.country
                    } : null}
                    name="address"
                    render={({ field: { value, onChange } }) => <>
                      <div className="requiredLabel" style={{ paddingBottom: 10 }}>
                        Address (address line1, city, state, zip, country)
                      </div>
                      <InputSearchLocation startValue={getAddressLine(details)} onLocationSelect={(value) => {
                        let ac = getAddressComponents(value.address_components)
                        const acObject = {
                          address1: ac.address1,
                          city: ac.city,
                          state: ac.state,
                          zipCode: ac.zipCode,
                          country: ac.country
                        }
                        Object.entries(acObject).forEach((item: any) => {
                          setValue(item[0], item[1])
                        })
                        setValue("coordinate.lat", value?.geometry?.location?.lat())
                        setValue("coordinate.lon", value?.geometry?.location?.lng())
                        if (ac.country) {
                          setValidateCustomFields((prevState: any) => ({ ...prevState, location: true }))
                        } else {
                          setValidateCustomFields((prevState: any) => ({ ...prevState, location: false }))
                        }
                      }
                      } />
                      {!validateCustomFields.location && <div className="errorText multipleError">Verify your address and country</div>}
                      {/* {(!id && !validateCustomFields.hasSearchClaim) && <div className="errorText multipleError">Search for an existing listing to claim</div>} */}
                    </>
                    } />
                  {noSimilarLocations && <div className="similarLocation">No similar locations found.</div>}
                </div>
                <div className="controllerContainer searchBtn">
                  <Button
                    onClick={onLocationSearch}
                    style={{
                      backgroundColor: `${theme.colors.brandBlue}`,
                      color: `${theme.colors.brandWhite}`,
                      margin: 0,
                      maxWidth: 100
                    }}
                    title={"Search"}
                    type={'button'}
                  />
                </div>
              </div>
              <div className="formBlock">
                <div className="controllerContainer addressSection">
                  <Controller
                    control={control}
                    name="address2"
                    defaultValue={details.address2 || ""}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        value={value}
                        id="address2Input"
                        label={"Address Line 2"}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="formBlock">
                <div className="controllerContainer">
                  <Controller
                    control={control}
                    defaultValue={details.coordinate?.lat || ""}
                    name="coordinate.lat"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        readOnly
                        value={value}
                        id="latitudeInput"
                        label={"Latitude"}
                        onChange={onChange} />
                    )}
                  />
                </div>
                <div className="controllerContainer">
                  <Controller
                    control={control}
                    defaultValue={details.coordinate?.lon || ""}
                    name="coordinate.lon"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        readOnly
                        value={value}
                        id="longitudeInput"
                        label={"Longitude"}
                        onChange={onChange} />
                    )}
                  />
                </div>
                <div className="controllerContainer mapBtn">
                  <Button
                    onClick={() => {
                      const latitude = getValues('coordinate.lat');
                      const longitude = getValues('coordinate.lon');
                      if (latitude && longitude) {
                        window.open("https://maps.google.com?q=" + latitude + "," + longitude, '_blank')
                      }
                    }}
                    style={{
                      backgroundColor: `${theme.colors.brandBlue}`,
                      color: `${theme.colors.brandWhite}`,
                      margin: 0,
                      maxWidth: 80
                    }}
                    title={"Map"}
                    type={'button'}
                  />
                </div>
              </div>
              <div className="formBlock">
                <div className="controllerContainer descriptionArea">
                  <Controller
                    control={control}
                    defaultValue={details.description || ""}
                    rules={{
                      required: true
                    }}
                    name="description"
                    render={({ field: { value, onChange } }) => (
                      <>
                        <InputTextArea
                          label={"Description"}
                          isRequiredField
                          id="descriptionInput"
                          onChange={onChange}
                          value={value}
                          rows={5} />
                        {errors.description && (
                          <span className="errorText">Description is Required</span>
                        )}
                      </>

                    )}
                  />
                </div>
              </div>
              <div className="formBlock">
                <div className="controllerContainer categoriesSelect">
                  <Controller
                    control={control}
                    defaultValue={getFieldSubCategories(details?.subCategories)}
                    name="subCategories"
                    render={({ field: { value, onChange } }) => <>
                      <div className="requiredLabel" style={{ paddingBottom: 10 }}>Categories</div>
                      <Select
                        components={{ GroupHeading }}
                        closeMenuOnSelect={false}
                        isMulti
                        value={value}
                        onChange={(val) => {
                          onChange(val)
                          const validation = (val.length > 0 && val.length > 0)
                          setValidateCustomFields((prevState: any) => ({ ...prevState, categories: validation }))
                        }}
                        options={categories}
                        styles={{
                          groupHeading: (base) => ({
                            ...base,
                            flex: '1 1',
                            color: 'white',
                            margin: 0,
                          }),
                          control: styles => ({
                            ...styles, padding: 5, borderRadius: 10, boxShadow: 'none',
                            border: `2px solid ${theme.colors.brandLightGray} !important`, '&:hover': {
                              borderColor: 'black !important'
                            }
                          })
                        }} />
                      {!validateCustomFields.categories && <span className="errorText">Select one or more categories</span>}
                    </>
                    } />
                </div>
              </div>
              <div className="formBlock">
                <div className="controllerContainer">
                  <Controller
                    control={control}
                    defaultValue={details.contactPerson || ""}
                    name="contactPerson"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        value={value}
                        id="contactPersonInput"
                        label={"Contact person"}
                        onChange={onChange} />
                    )}
                  />
                </div>
                <div className="controllerContainer">
                  <Controller
                    control={control}
                    defaultValue={details.contactEmail || ""}
                    rules={{
                      pattern: {
                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "invalid email address"
                      }
                    }}
                    name="contactEmail"
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Input
                          value={value}
                          id="contactEmailInput"
                          label={"Contact email"}
                          onChange={onChange} />
                        {errors.contactEmail && value !== "" && (
                          <span className="errorText">{errors.contactEmail.message}</span>
                        )}
                      </>

                    )}
                  />
                </div>
                <div className="controllerContainer">
                  <Controller
                    control={control}
                    defaultValue={details.contactPhone || details.phoneNumber || ""}
                    rules={{
                      pattern: {
                        value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
                        message: "invalid phone number"
                      }
                    }}
                    name="contactPhone"
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Input
                          value={value}
                          id="contactPhoneInput"
                          label={"Phone number"}
                          onChange={onChange} />
                        {errors.phoneNumber && value !== "" && (
                          <span className="errorText">{errors.phoneNumber.message}</span>
                        )}
                      </>

                    )}
                  />
                </div>
              </div>
              <div className="formBlock twoColumn">
                <div className="controllerContainer">
                  <Controller
                    control={control}
                    name="bestFormOfCommunication"
                    defaultValue={details.bestFormOfCommunication}
                    render={({ field: { value, onChange } }) => <>
                      <div style={{ paddingBottom: 10 }}>Best form of communication</div>
                      <Select
                        onChange={(selectedOption: any) => {
                          onChange(selectedOption.value);
                        }}
                        options={bestFormCommunicationValues}
                        value={bestFormCommunicationValues.find((c) => c.value === value)}
                        styles={{
                          groupHeading: (base) => ({
                            ...base,
                            flex: '1 1',
                            color: 'white',
                            margin: 0,
                          }),
                          control: styles => ({
                            ...styles, padding: 5, borderRadius: 10, boxShadow: 'none', border: `2px solid ${theme.colors.brandLightGray} !important`, '&:hover': {
                              borderColor: 'black !important'
                            }
                          })
                        }} />
                    </>} />
                </div>
                <div className="controllerContainer website">
                  <Controller
                    control={control}
                    defaultValue={details.website || ""}
                    rules={{
                      pattern: {
                        value: /^((?:https?:\/\/)?[^./]+(?:\.[^./]+)+(?:\/.*)?)$/,
                        message: "invalid website"
                      }
                    }}
                    name="website"
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Input
                          value={value}
                          id="websiteInput"
                          label={"Website"}
                          onChange={onChange} />
                        {errors.website && value !== "" && (
                          <span className="errorText">{errors.website.message}</span>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="formBlock">
                <div className="controllerContainer">
                  <Controller
                    control={control}
                    defaultValue={details.priceRangeLow || 0.00}
                    rules={{
                      pattern: {
                        value: /^[0-9]+(\.[0-9]{1,2})?$/,
                        message: "invalid price"
                      }
                    }}
                    name="priceRangeLow"
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Input
                          value={value}
                          type={"number"}
                          step="0.01"
                          placeholder={'0.00'}
                          id="priceRangeLowInput"
                          label={"Price range (low)"}
                          onChange={(e: any) => onChange(e.target.value !== "" ? parseFloat(e.target.value) : e.target.value)} />
                        {errors.priceRangeLow && value !== "" && (
                          <span className="errorText">{errors.priceRangeLow.message}</span>
                        )}
                      </>

                    )}
                  />
                </div>
                <div className="controllerContainer">
                  <Controller
                    control={control}
                    defaultValue={details.priceRangeHigh || 0.00}
                    name="priceRangeHigh"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        type={"number"}
                        step="0.01"
                        value={value}
                        placeholder={'0.00'}
                        id="priceRangeHighInput"
                        label={"Price range (high)"}
                        onChange={(e: any) => onChange(e.target.value !== "" ? parseFloat(e.target.value) : e.target.value)} />
                    )}
                  />
                </div>
                <div className="controllerContainer">
                  <Controller
                    control={control}
                    defaultValue={details.priceRangeString || ""}
                    name="priceRangeString"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        value={value}
                        id="priceRangeTextInput"
                        label={"Price range (text)"}
                        onChange={onChange} />
                    )}
                  />
                </div>
              </div>
              <div className="formBlock">
                <div className="controllerContainer">
                  <Controller
                    control={control}
                    defaultValue={details.peopleServiceMaxCount || 0}
                    name="peopleServiceMaxCount"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        value={value}
                        type="number"
                        id="numberOfPeopleInput"
                        label={"# of people serviceable"}
                        onChange={(e: any) => onChange(e.target.value !== "" ? parseInt(e.target.value, 10) : e.target.value)} />
                    )}
                  />
                </div>
                <div className="controllerContainer">
                  <Controller
                    control={control}
                    defaultValue={details.slips || ""}
                    name="slips"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        value={value}
                        id="wetDrySlipsInput"
                        label={"Wet/Dry Slips"}
                        onChange={onChange} />
                    )}
                  />
                </div>
                <div className="controllerContainer">
                  <Controller
                    control={control}
                    defaultValue={details.boatSize || ""}
                    name="boatSize"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        value={value}
                        id="boatSizeInput"
                        label={"Boat size"}
                        onChange={onChange} />
                    )}
                  />
                </div>
              </div>
              <div className="formBlock">
                <div className="controllerContainer">
                  <Controller
                    control={control}
                    defaultValue={details.fuel || ""}
                    name="fuel"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        value={value}
                        id="fuelServiceInput"
                        label={"Fuel service"}
                        onChange={onChange} />
                    )}
                  />
                </div>
                <div className="controllerContainer">
                  <Controller
                    control={control}
                    defaultValue={details.sponsoredBy || ""}
                    name="sponsoredBy"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        value={value}
                        id="sponsoredByInput"
                        label={"Sponsored by"}
                        onChange={onChange} />
                    )}
                  />
                </div>
                <div className="controllerContainer">
                  <Controller
                    control={control}
                    defaultValue={details.electricShorePower || ""}
                    name="electricShorePower"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        value={value}
                        id="electricPowerInput"
                        label={"Electric/Shore power?"}
                        onChange={onChange} />
                    )}
                  />
                </div>
              </div>
              <div className="formBlock twoColumn">
                <div className="controllerContainer">
                  <Controller
                    control={control}
                    defaultValue={details.privacyMembershipString || ""}
                    name="privacyMembershipString"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        value={value}
                        id="privacyMembershipInput"
                        label={"Privacy/Membership?"}
                        onChange={onChange} />
                    )}
                  />
                </div>
                <div className="controllerContainer operatingHours">
                  <div>
                    <Controller
                      control={control}
                      defaultValue={details.operatingDaysHoursJSON}
                      name="operatingDaysHoursJSON"
                      render={({ field: { value, onChange } }) => (
                        <Input
                          value={handleOperatingHours(value)}
                          readOnly
                          id="hoursInput"
                          label={"Hours"}
                          onChange={onChange}
                          icon={
                            <FaPencilAlt
                              name="edit"
                              style={{ top: '40%' }} />}
                          onIconPress={() => { setModalDisplay({ show: true, type: "operatingHours" }) }} />
                      )} />
                  </div>
                  <div>
                    <Checkbox
                      checked={callToCheck}
                      id="privateInput"
                      label="Call to check availability or schedule"
                      onChange={(val: any) => {
                        const check = val.target.checked;
                        setValue('operatingDaysHoursJSON', [])
                        setCallToCheck(check)
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="formBlock">
                <div className="controllerContainer">
                  <Controller
                    control={control}
                    defaultValue={details.claimedBy2 || ""}
                    name="claimedBy2"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        value={value}
                        readOnly
                        id="claimedBy2"
                        label={"Claimed By"}
                        onChange={onChange} />
                    )} />
                </div>
                <div className="controllerContainer">
                  <Controller
                    control={control}
                    defaultValue={details.claimedOn2 ? parseDate(details.claimedOn2) : null}
                    name="claimedOn2"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        value={value ? parseDate(value) : value}
                        readOnly
                        id="claimedOn2"
                        label={"Claimed On"}
                        onChange={onChange} />
                    )} />
                </div>
              </div>
              {
                viewType === 'claim' &&
                <>
                  <div className="formBlock">
                    <div className="controllerCheckbox">
                      <>
                        <div className="requiredLabel claimFields">I&apos;m interested in a premium verified listing</div>
                        <div className="controllerContainer radioInputs">
                          <Controller
                            control={control}
                            name="interestedIn2"
                            defaultValue={details.interestedIn2}
                            render={({ field: { value, onChange } }) => (
                              <RadioGroupInterested valueInput={value} name="interested" onChange={(val: any) => {
                                onChange(val)
                                setValidateCustomFields((prevState: any) => ({ ...prevState, interested: true }))
                              }} />
                            )} />
                        </div>
                      </>
                    </div>
                  </div>
                  <div className="formBlock">
                    <div className="controllerContainer">
                      <Controller
                        control={control}
                        rules={{
                          required: true
                        }}
                        name="howYouHearAboutUs2"
                        defaultValue={details.howYouHearAboutUs2 || ''}
                        render={({ field: { value, onChange } }) => <>
                          <div className="requiredLabel claimFields">How did you hear about us?</div>
                          <Select
                            onChange={(selectedOption: any) => {
                              onChange(selectedOption.value);
                            }}
                            value={howDidyouHearAboutUsValues.find((c) => c.value === value)}
                            options={howDidyouHearAboutUsValues}
                            styles={{
                              control: styles => ({
                                ...styles, padding: 5, borderRadius: 10, boxShadow: 'none', border: `2px solid ${theme.colors.brandLightGray} !important`, '&:hover': {
                                  borderColor: 'black !important'
                                }
                              })
                            }} />
                        </>} />
                    </div>
                  </div>
                </>
              }
              <div className="formBlock">
                <div className="controllerCheckbox">
                  <Controller
                    control={control}
                    defaultValue={details.isPrivate || false}
                    name="isPrivate"
                    render={({ field: { value, onChange } }) => (
                      <Checkbox
                        checked={value}
                        id="privateInput"
                        label="Private"
                        onChange={onChange} />
                    )}
                  />
                </div>
                <div className="separator">|</div>
                <div className="controllerCheckbox">
                  <Controller
                    control={control}
                    defaultValue={details.membershipNeeded || false}
                    name="membershipNeeded"
                    render={({ field: { value, onChange } }) => (
                      <Checkbox
                        checked={value}
                        id="membershipInput"
                        label="Membership needed"
                        onChange={onChange} />
                    )} />
                </div>
              </div>
              <div className="formBlock">
                <div className="controllerCheckbox">
                  <Controller
                    control={control}
                    defaultValue={details.listed || false}
                    name="listed"
                    render={({ field: { value, onChange } }) => (
                      <Checkbox
                        checked={value}
                        id="listedInput"
                        label="Listed"
                        disabled={viewType === 'claim'}
                        onChange={onChange} />
                    )} />
                </div>
                <div className="separator">|</div>
                <div className="controllerCheckbox">
                  <Controller
                    control={control}
                    defaultValue={details.verified || false}
                    name="verified"
                    render={({ field: { value, onChange } }) => (
                      <Checkbox
                        checked={value}
                        id="verifiedInput"
                        label="Verified"
                        disabled={viewType === 'claim'}
                        onChange={(val) => {
                          if (val.target.checked) {
                            register('verifiedByEmail')
                            register('verifiedByUserId')
                            setValue('verifiedByEmail', user?.email)
                          } else {
                            unregister('verifiedByEmail')
                            unregister('verifiedByUserId')
                          }

                          onChange(val)
                        }} />
                    )} />
                </div>
                <div className="separator">|</div>
                <div className="controllerCheckbox">
                  <Controller
                    control={control}
                    defaultValue={details.premiere || false}
                    name="premiere"
                    render={({ field: { value, onChange } }) => (
                      <Checkbox
                        disabled={!hasBeenSaved || viewType === 'claim'}
                        checked={value}
                        id="premierInput"
                        label="Premiere"
                        onChange={(val) => {
                          onChange(val);
                          setIsPremiere(val.target.checked)
                        }} />
                    )} />
                </div>
                <div className="separator">|</div>
                <div className="controllerCheckbox">
                  <Controller
                    control={control}
                    defaultValue={details.gold || false}
                    name="gold"
                    render={({ field: { value, onChange } }) => (
                      <Checkbox
                        disabled={!hasBeenSaved || viewType === 'claim'}
                        checked={value}
                        id="goldInput"
                        label="Gold"
                        onChange={onChange} />
                    )} />
                </div>
                <div className="separator">|</div>
                <div className="controllerCheckbox">
                  <Controller
                    control={control}
                    defaultValue={details.platinum || false}
                    name="platinum"
                    render={({ field: { value, onChange } }) => (
                      <Checkbox
                        disabled={!hasBeenSaved || viewType === 'claim'}
                        checked={value}
                        id="platinumInput"
                        label="Platinum"
                        onChange={onChange} />
                    )} />
                </div>
              </div>
              {(isPremiere && isAdmin) &&
                <>
                  <div className="formBlock">
                    <div className="controllerContainer promotedCategoriesSelect">
                      <Controller
                        control={control}
                        defaultValue={getFieldSubCategories(details?.promotedSubCategories)}
                        name="promotedSubCategories"
                        render={({ field: { value, onChange } }) => (
                          <>
                            <div style={{ paddingBottom: 10 }}>Promoted categories</div>
                            <Select
                              components={{ GroupHeading }}
                              closeMenuOnSelect={false}
                              isMulti
                              value={value}
                              onChange={(val) => {
                                onChange(val);
                              }}
                              options={categories}
                              styles={{
                                groupHeading: (base) => ({
                                  ...base,
                                  flex: '1 1',
                                  color: 'white',
                                  margin: 0,
                                }),
                                control: styles => ({
                                  ...styles, padding: 5, borderRadius: 10, boxShadow: 'none',
                                  border: `2px solid ${theme.colors.brandLightGray} !important`, '&:hover': {
                                    borderColor: 'black !important'
                                  }
                                })
                              }} />
                          </>
                        )} />
                    </div>
                  </div>
                  <div className="formBlock">
                    <div className="controllerContainer promotedKeywords">
                      <Controller
                        control={control}
                        defaultValue={details.promotedKeywords ? details.promotedKeywords.join(' ') : ''}
                        name="promotedKeywords"
                        render={({ field: { value, onChange } }) => (
                          <Input
                            value={value}
                            id="promotedKeywordsInput"
                            label={"Promoted keywords"}
                            onChange={onChange} />
                        )} />
                    </div>
                  </div>
                </>
              }
              {(isPremiere && id && isAdmin) && <Fragment>
                <div className="formBlock">
                  <div className="controllerUploadImage">
                    <span>Profile logo image (240x120 pixels recommended)</span>
                    <input id="logoImageInput" type="file" onChange={(e) => onUploadImage(e, 'logo')} accept="image/png, image/jpeg" />
                  </div>
                </div>
                <div className="formBlock">
                  <div className="controllerUploadImage">
                    <span>Profile image #1 (600x600 pixels recommended)</span>
                    <input id="profileImage1Input" type="file" onChange={(e) => onUploadImage(e, 'pic1')} accept="image/png, image/jpeg" />
                  </div>
                </div>
                <div className="formBlock">
                  <div className="controllerUploadImage">
                    <span>Profile image #2 (600x600 pixels recommended)</span>
                    <input id="profileImage2Input" type="file" onChange={(e) => onUploadImage(e, 'pic2')} accept="image/png, image/jpeg" />
                  </div>
                </div>
              </Fragment>}
              {(!isClaim && id) && <div className="activeInactiveBtn">
                <Button
                  style={{
                    backgroundColor: `${theme.colors.brandOrange}`,
                    color: `${theme.colors.brandWhite}`,
                    margin: 0,
                    maxWidth: 250
                  }}
                  onClick={() => { setModalDisplay({ show: true, type: "confirmationActiveInactive" }) }}
                  title={`Make Location ${locationActive ? 'Inactive' : 'Active'}`}
                  type={'button'} />
              </div>}
            </div>
          </div>

          <div className="btnContainer">
            <span className="btnContent">
              <Button
                style={defaultLocationEditBtns}
                onClick={onCancelSave}
                title={"Cancel"}
                type={"reset"}
                disabled={false} />
            </span>
            <span className="btnContent">
              <Button
                style={defaultLocationEditBtns}
                title={"Save"}
                type={"submit"}
                disabled={!(isValid && Object.values(validateCustomFields).every(
                  value => value === true
                ))} />
            </span>
            {(isAdmin && id && isClaim) && <span className="btnContent approvalbtns"><Approvals onReject={onReject} onApprove={onApprove} /></span>}
          </div>
        </form>
      </div>

      <Modal onShow={modalDisplay.show} onClose={onCloseModal}>
        {modalDisplay.type === "operatingHours" &&
          <OperatingHours onSaveHours={(hours: any) => {
            setValue('operatingDaysHoursJSON', hours)
            setCallToCheck(false)
            onCloseModal()
          }} locationDetail={getValues() as any} />}
        {modalDisplay.type === "confirmationActiveInactive" &&
          <PopUpConfirm locationActive={locationActive} onConfirm={() => onConfirmActiveInactive()} onCancel={() => setModalDisplay(prevState => ({ ...prevState, show: false }))} />}
        {modalDisplay.type === "locationResultsView" &&
          <div className="locationResults">
            <LocationsResults label={'Similar locations'} locations={(search.result && search.result.length > 0 &&
              search.result[0].data) ? search.result[0].data as any : []} />
          </div>
        }
        {modalDisplay.type === "claimError" && onClaimError()}
        {modalDisplay.type === 'approveRejectError' && onAdminErrorApprove()}
        {modalDisplay.type === "saveSucess" && modalSuccess()}
      </Modal>
      <style jsx>{`
        .claimBusinessTitle{
          font-size: ${theme.boaterslistInfo.titleFontSize}px;
          margin: auto;
        }
        .claimFields{
          margin-bottom: 10px;
        }
        .errorText {
          position: absolute;
          margin: 2px;
        }
        .multipleError{
          position: relative;
        }
        .similarLocation{
          display: flex;
          justify-content: flex-end;
          font-weight: bold;
        }
        .requiredLabel:after{
          content:" *";
          color: red;
        }
        .locationSection{
          display: flex;
        }
        .internalContent{
          max-width: 980px;
        }
        .formFieldContent{
          margin: auto;
          max-width: 80%;
          padding-top: 20px;
          padding-left: 10%;
        }
        .uploadButton{
          display: inline-block;
          text-align: right;
        }
        .btnContainer{
          text-align: center;
          margin-top: 30px;
        }
        .btnContent{
          margin-right: 10px;
          display: inline-block;
        }
        .formRight, .formLeft,.formMiddle{
          padding: 20px;
          max-width: 320px;
        }
        .LocationDetail {
          padding-bottom: 30px;
        }
        .controllerContainer{
          margin-bottom: 15px;
          max-width: 310px;
          min-width: 310px;
          display: inline-block;
          margin-right: 15px;
        }
        .radioInputs{
          padding-bottom: 10px;
        }
        .searchBtn{
          width: 100px;
          max-width: 100px;
          min-width: 100px;
          align-self: center;
          margin: 0;
        }
        .mapBtn{
          min-width: 100px;
        }
        .callToActionLink, .website, .operatingHours{
          width: 100%;
          max-width: 100%;
        }
        .twoColumn{
          display:flex;
        }
        .locationResults{
          max-height: 700px;
          overflow-y: auto;
        }
        .descriptionArea,.locationSection,.addressSection,.locationName,.categoriesSelect,.promotedCategoriesSelect,.promotedKeywords{
          width: 100%;
          max-width: 98%;
        }
        .controllerCheckbox, .separator{
          display:inline-block;
        }
        .controllerUploadImage{
          padding: 15px 0px;
        }
        .controllerUploadImage span {
          margin-right: 15px;
        }
        .separator{
          vertical-align: super;
          padding: 10px 20px;
        }
        @media screen and (max-width: 944px) {
          .twoColumn{
            display: block;
          }
        }
        @media screen and (max-width: 565px) {
          .approvalbtns{
            margin-top: 20px;
          }
          .locationSection{
            flex-wrap: wrap;
            margin-bottom: 10px;
          }
        }
        @media screen and (max-width: 500px) {
          .formFieldContent{
            padding-left: 0;
          }
          .controllerContainer{
            margin-left: 0;
          }
          .uploadButton{
            display: block;
          }
        }
        @media screen and (max-width: 430px) {
          .btnContent{
            display: block;
            margin-right: 0px;
            margin-bottom: 15px;
          }
        }
      `}</style>
    </div>
  ) : null
}

LocationEdit.defaultProps = {
  viewType: 'admin'
}

function getFieldSubCategories(sca?: number[]): any {
  let fsc: any[] = []
  if (sca) {
    sca.forEach(v => {
      const sc = getSubCategory(v)
      if (sc) {
        fsc.push({ label: sc.subCategoryName, value: parseInt(sc.subCategoryId as string) })
      }
    })
  }
  return fsc
}
