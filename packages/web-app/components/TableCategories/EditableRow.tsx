import React, { useState } from "react";
import theme from "common/theme";
import { Category, getAllCategories } from "common/global/categories";
import { Input } from "components/Forms/Input";

type propType = {
  rowData: Category;
  type: string;
  onEditRow: (value: any) => void
}

export function EditableRow({ rowData, type, onEditRow }: propType) {
  const [categoryField, setCategoryField] = useState(rowData);
  const typeField = type === 'category' ? 'categoryName' : 'subCategoryName';

  const onFieldChange = (value: any) => {
    console.log(value.target.value, "VALUE")
    setCategoryField({ ...categoryField, [typeField]: value.target.value });
    onEditRow({ ...categoryField, [typeField]: value.target.value });
  }

  return <div className="editableContainer">
    <Input
      style={{ padding: 5, fontSize: 14, borderRadius: 5 }}
      placeholder={''}
      defaultValue={categoryField[typeField]}
      onChange={onFieldChange} />
    <style jsx>{`
        .inputEdit{
          padding: 0px;
        }
      `}</style>
  </div>
}
