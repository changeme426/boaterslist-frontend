import React from "react";
import theme from "common/theme";
import { Category, getAllCategories } from "common/global/categories";
import { Input } from "components/Forms/Input";
import { Button } from "components/Buttons/Button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

export function AddCategory() {
  const { handleSubmit, control, formState } = useForm({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<any> = async (formValues: any) => {
    console.log(formValues)
  };

  return (
    <div className="editableContainer">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="inputNewCategory">
          <Controller
            control={control}
            defaultValue={""}
            rules={{
              required: true
            }}
            name="categoryNumber"
            render={({ field: { value, onChange } }) => (
              <Input
                type={'number'}
                value={value}
                label={'Category number'}
                style={{ padding: 5, fontSize: 14, borderRadius: 5 }}
                placeholder={''}
                onChange={onChange} />
            )}
          />
        </div>
        <div className="inputNewCategory">
          <Controller
            control={control}
            defaultValue={""}
            rules={{
              required: true
            }}
            name="categoryName"
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                label={'Category name'}
                style={{ padding: 5, fontSize: 14, borderRadius: 5 }}
                placeholder={''}
                onChange={onChange} />
            )}
          />
        </div>
        <div className="inputNewCategory">
          <Button
            disabled={!formState.isValid}
            title={"Add"}
            style={{ width: 60, padding: 8, color: theme.colors.brandWhite, backgroundColor: theme.colors.brandBlue }}
            onClick={() => alert('Not authorized') /* TODO */}
            type={'submit'}
          />
        </div>
      </form>


      <style jsx>{`
        .inputNewCategory{
          display: inline-block;
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
}
