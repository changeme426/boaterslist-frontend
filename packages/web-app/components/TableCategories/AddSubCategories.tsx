import React from "react";
import theme from "common/theme";
import { Category, getAllCategories } from "common/global/categories";
import { Input } from "components/Forms/Input";
import { Button } from "components/Buttons/Button";
import Select from 'react-select';
import { Controller, SubmitHandler, useForm } from "react-hook-form";

export function AddSubCategories() {
  const { handleSubmit, control, formState } = useForm({
    mode: "onChange",
  });
  const categories = getAllCategories().map((cat: Category) => ({
    label: cat.categoryName,
    value: cat.categoryId
  }));

  const onSubmit: SubmitHandler<any> = async (formValues: any) => {
    console.log(formValues)
  };

  return (
    <div className="editableContainer">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="selectCategory">
          <Controller
            control={control}
            defaultValue={""}
            rules={{
              required: true
            }}
            name="subCategories"
            render={({ field: { value, onChange } }) => (
              <>
                <div style={{ paddingBottom: 10 }}>Category</div>
                <Select
                  value={value}
                  onChange={onChange}
                  options={categories}
                  styles={{
                    control: styles => ({
                      ...styles, width: '100%', maxWidth: 300, padding: 0, borderRadius: 5, boxShadow: 'none', border: `2px solid ${theme.colors.brandLightGray} !important`, '&:hover': {
                        borderColor: 'black !important'
                      }
                    })
                  }} />
              </>
            )}
          />
        </div>
        <div className="inputNewSubCategory">
          <Controller
            control={control}
            defaultValue={""}
            rules={{
              required: true
            }}
            name="subCategoryNumber"
            render={({ field: { value, onChange } }) => (
              <Input
                type={'number'}
                value={value}
                label={'Sub-Category number'}
                style={{ padding: 5, fontSize: 14, borderRadius: 5 }}
                placeholder={''}
                onChange={onChange} />
            )}
          />
        </div>
        <div className="inputNewSubCategory">
          <Controller
            control={control}
            defaultValue={""}
            rules={{
              required: true
            }}
            name="subCategoryName"
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                label={'Sub-Category name'}
                style={{ padding: 5, fontSize: 14, borderRadius: 5 }}
                placeholder={''}
                onChange={onChange} />
            )}
          />
        </div>
        <div className="inputNewSubCategory">
          <Button
            disabled={!formState.isValid}
            title={"Add"}
            style={{ width: 60, padding: 8, color: theme.colors.brandWhite, backgroundColor: theme.colors.brandBlue }}
            type={'submit'}
            onClick={() => alert('Not authorized') /* TODO */}
          />
        </div>
      </form>


      <style jsx>{`
        .selectCategory{
          margin-bottom: 10px;
        }
        .inputNewSubCategory{
          display: inline-block;
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
}
