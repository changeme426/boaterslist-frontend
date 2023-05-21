import React, { useState } from "react";
import theme from "common/theme";
import { Category, getAllCategories } from "common/global/categories";
import { Input } from "components/Forms/Input";
import { EditableRow } from "./EditableRow";
import Button from "components/Buttons/Button";
import Modal from "components/Common/Modal";
import { AddCategory } from "./AddCategory";
import { FaTimes } from "react-icons/fa";
import { AddSubCategories } from "./AddSubCategories";
import { defaultCommonStyles } from '../../utils/defaultStyles';


export function TableCategories() {
  const categories = getAllCategories();
  const [fieldChanged, setFieldChanged] = useState<Category | null>(null);
  const [modalShow, setModalShow] = useState(false);
  const [viewEdit, setViewEdit] = useState("");

  const onEditFieldRow = (value: any) => {
    setFieldChanged(value);
  }

  const displayRows = () => {
    return categories.map((item, idx) => (
      <React.Fragment key={item.categoryId + idx}>
        <tr className="category">
          <td className="categoryNumber">{item.categoryNumber} ({item.categoryId})</td>
          <td>
            <EditableRow onEditRow={onEditFieldRow} type={'category'} rowData={item} />
          </td>
          <td>{
            (fieldChanged && fieldChanged.subCategories && fieldChanged.categoryId === item.categoryId) ?
              <Button
                title={"Save"}
                style={defaultCommonStyles.defaultButtonStyles}
                onClick={() => alert('Not authorized') /* TODO */}
              /> : null
          }</td>
          <td></td>
        </tr>
        {item.subCategories?.map(sub => (
          <tr key={sub.subCategoryId} className="subCategory">
            <td></td>
            <td></td>
            <td className="categoryNumber">{sub.subCategoryNumber} ({sub.subCategoryId})</td>
            <td><EditableRow onEditRow={onEditFieldRow} type={'subCategory'} rowData={sub} /></td>
            <td>
              {
                (fieldChanged && !fieldChanged.subCategories && fieldChanged.subCategoryId === sub.subCategoryId) ?
                  <Button
                    title={"Save"}
                    style={defaultCommonStyles.defaultButtonStyles}
                    onClick={() => alert('Not authorized') /* TODO */}
                  /> : null
              }</td>
          </tr>
        ))}
        <style jsx>{`
        .category {
          height: 70px;
          border-top: 2px solid ${theme.colors.brandGray};
        }
        .category td{
          font-weight: 700;
          margin-top: 20px;
        }
        .categoryNumber{
          width: 50px;
          max-width: 60px;
        }
      `}</style>
      </React.Fragment>
    ))
  }
  return (
    <div className="tableContainer">
      <div className="addBtns">
        <span>
          <Button
            disabled={viewEdit === "addCategory"}
            title={"Add new category"}
            style={{ ...defaultCommonStyles.defaultButtonStyles, width: 150, padding: 8 }}
            onClick={() => setViewEdit("addCategory")}
          />
        </span>
        <span>
          <Button
            disabled={viewEdit === "addSubCategory"}
            title={"Add new subcategory"}
            style={{ ...defaultCommonStyles.defaultButtonStyles, width: 150, padding: 8 }}
            onClick={() => setViewEdit("addSubCategory")}
          />
        </span>
      </div>
      <div className={viewEdit !== "" ? "addCategoryView" : ""}>
        {viewEdit !== "" && <FaTimes onClick={() => setViewEdit("")} size={20} style={{ position: 'absolute', right: 0, top: 0, cursor: 'pointer' }} />}
        {viewEdit === "addCategory" && <AddCategory />}
        {viewEdit === "addSubCategory" && <AddSubCategories />}
      </div>
      <table>
        <thead>
          <tr>
            <th className="categoryNumber">Category number</th>
            <th className="categoryName">Category name</th>
            <th className="categoryNumber">Sub-Category number</th>
            <th className="categoryName">Sub-Category name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{
          displayRows()
        }</tbody>
      </table>

      <style jsx>{`
        .addCategoryView{
          position: relative;
          padding: 20px;
          margin-bottom: 80px;
          margin-top: 20px;
          display: flex;
          justify-content: center;
          border: 2px solid ${theme.colors.brandBlue}
        }
        .addBtns{
          text-align: right;
          margin-bottom: 30px;
        }
        .addBtns span{
          padding: 0px 10px;
        }
        table{
          border-collapse: collapse;
        }        thead {
          font-size: 15px;
          color: ${theme.colors.brandBlack};
          border-bottom: 2px solid ${theme.colors.brandGray}
        }
        .categoryNumber{
          padding-right: 20px;
        }
        .categoryName{
          width: 50%;
        }
      `}</style>
    </div>
  );
}
