import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import theme from "../../../common/theme";
import Button from "../Buttons/Button";
import { DAYS, HOURS } from "common/utils/daysAndHours";
import { formattedHours } from "common/utils/FormattedHours";
import { Locations } from "common/models/Locations";
import Select from 'react-select';
import HoursTable from "./HoursTable";

type PropsType = {
  locationDetail: Locations;
  onSaveHours: (hours: any) => void;
}

export const OperatingHours = ({ locationDetail, onSaveHours }: PropsType) => {
  let defaultHours: Array<any> = [];
  let stringHours: string = "";
  if (locationDetail.operatingDaysHoursJSON && locationDetail.operatingDaysHoursJSON[0] && !locationDetail.operatingDaysHoursJSON[0].callToCheck) {
    defaultHours = locationDetail.operatingDaysHoursJSON as any
    stringHours = formattedHours(locationDetail.operatingDaysHoursJSON)
  }
  if (defaultHours) {
    for (let i = 0; i < defaultHours.length; i++) {
      defaultHours[i].dayFrom = defaultHours[i].dayFrom ? defaultHours[i].dayFrom.trim() : ''
    }
  }
  const [operatingHours, setOperatingHours] = useState<Array<any>>(defaultHours)
  const [shouldSave, setShouldSave] = useState<boolean>(false)

  const { handleSubmit, control, formState: { isDirty, errors, isValid }, trigger, reset, getValues } = useForm({
    mode: "onChange",
  });

  const compareHoursAndDays = (array: any, values: any) => {
    const { from, to } = values;
    const fromIndex = array.indexOf(from);
    const toIndex = array.indexOf(to);
    if (from !== '' && to !== '') {
      if (fromIndex > toIndex) {
        return false;
      } else {
        return true;
      }
    }
    return true;
  }

  const validateFromDay = () => {
    const { fromDay, toDay } = getValues();
    return compareHoursAndDays(DAYS, { from: fromDay, to: toDay });
  }

  const validateHours = () => {
    const { fromTime, toTime } = getValues();
    return compareHoursAndDays(HOURS, { from: fromTime, to: toTime });
  }

  const onTableChange = (hours: Array<string>) => {
    setOperatingHours(hours);
    setShouldSave(true);
  }

  const onSubmit: SubmitHandler<any> = async (dataEvent) => {
    setShouldSave(true);
    const newData: any = {
      dayFrom: dataEvent.fromDay.value,
      dayTo: dataEvent.toDay.value,
      timeFrom: dataEvent.fromTime.value,
      timeTo: dataEvent.toTime.value
    };
    setOperatingHours(oldArray => [...oldArray, newData]);
    reset();
  };

  return <div className="OperatingHours">
    <div className="titleCompany">
      {locationDetail.locationName}
    </div>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="operatingFormContainer">
        <div className="controllerContainer">
          <Controller
            control={control}
            defaultValue={""}
            name="fromDay"
            rules={{
              required: true
            }}
            render={({
              field: { onChange, value },
              fieldState: { isTouched, error },
            }) => (
              <>
                <div style={{ paddingBottom: 10 }}>From day</div>
                <Select
                  value={value}
                  onChange={(val: any) => {
                    onChange(val)
                    if (getValues().toDay !== '') {
                      trigger('toDay')
                    }
                  }}
                  options={DAYS}
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
                  }}
                />
                { }
              </>
            )}
          />
        </div>
        <div className="controllerContainer">
          <Controller
            control={control}
            defaultValue={""}
            name="toDay"
            rules={{
              required: true,
              validate: validateFromDay
            }}
            render={({
              field: { onChange, value, },
              fieldState: { isTouched },
            }) => (
              <>
                <div style={{ paddingBottom: 10 }}>To day</div>
                <Select
                  value={value}
                  onChange={onChange}
                  options={DAYS}
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
                  }}
                />
              </>
            )}
          />
        </div>
        <div className="controllerContainer">
          <Controller
            control={control}
            defaultValue={""}
            name="fromTime"
            rules={{ required: true }}
            render={({
              field: { onChange, value, },
              fieldState: { isTouched },
            }) => (
              <>
                <div style={{ paddingBottom: 10 }}>From time</div>
                <Select
                  value={value}
                  onChange={(val: any) => {
                    onChange(val)
                    if (getValues().toTime !== '') {
                      trigger('toTime')
                    }
                  }}
                  options={HOURS}
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
                  }}
                />
              </>
            )}
          />
        </div>
        <div className="controllerContainer">
          <Controller
            control={control}
            defaultValue={""}
            name="toTime"
            rules={{ required: true, validate: validateHours }}
            render={({
              field: { onChange, value, },
              fieldState: { isTouched },
            }) => (
              <>
                <div style={{ paddingBottom: 10 }}>To time</div>
                <Select
                  value={value}
                  onChange={onChange}
                  options={HOURS}
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
                  }}
                />
              </>
            )}
          />
        </div>
        <div className="controllerBtnContainer">
          <Button
            style={{
              backgroundColor: `${theme.colors.brandBlue}`,
              color: `${theme.colors.brandWhite}`,
              margin: 0,
              maxWidth: 80
            }}
            title={"Add"}
            disabled={!isValid}
            type={"submit"}
          />
        </div>
      </div>
      <div>
        {errors.toDay && <span className="errorText">Please select a valid range of days</span>}
        {errors.toTime && <span className="errorText">Please select a valid range of time</span>}
      </div>
    </form>
    <div>
      <HoursTable
        onTableChange={(hours: Array<string>) => onTableChange(hours)}
        operatingHoursData={operatingHours} />
    </div>
    <div>
      <div className="controllerBtnContainer">
        <Button
          style={{
            backgroundColor: `${theme.colors.brandBlue}`,
            color: `${theme.colors.brandWhite}`,
            margin: 0,
            maxWidth: 80
          }}
          title={"Save"}
          onClick={() => onSaveHours(operatingHours)}
          disabled={!shouldSave}
        />
      </div>
    </div>
    <style jsx>{`
        form{
          margin-bottom: 15px;
        }
        .OperatingHours {
          padding: 30px;
        }
        .titleCompany {
          font-size: ${theme.locationsDetail.detailSubtitleSize}px;
          padding: 15px 0px;
          margin-bottom: 10px;
        }
        .btnContainer {
          margin: 20px 0px;
        }
        .controllerContainer{
          display: inline-block;
          margin-right: 15px;
        }
        .controllerBtnContainer{
          display: inline-block;
        }
      `}</style>
  </div>
}

export default OperatingHours
