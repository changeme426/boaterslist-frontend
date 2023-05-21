import React, { useState } from "react"
import theme from "common/theme"
import { useRouter } from "next/router"
import { useInactiveLocations } from "common/hooks/useInactiveLocations"
import { FaList, FaPlus, FaTable, FaCheckSquare, FaBan } from "react-icons/fa"
import { TableCategories } from "components/TableCategories/TableCategories"
import { Dashboard } from "components/Dashboard/Dashboard"
import LocationEdit from "components/LocationDetails/LocationEdit"
import { Claims } from "components/Admin/Claims"

export default function Admin() {
  const router = useRouter()
  const inactiveLocations = useInactiveLocations()
  let defaultSelection = 'dashboard'
  if (router.query && router.query.action === 'claim') {
    defaultSelection = 'claims'
  }
  const [optionSelection, setOptionSelection] = useState(defaultSelection)
  return (
    <div className="adminContainer">
      <div className={optionSelection !== "" ? 'leftPanel' : 'leftPanel customHeight'}>
        <div onClick={() => setOptionSelection('dashboard')} className="options">
          <span><FaTable size={20} />&nbsp;</span><span>Dashboard</span>
        </div>
        <div onClick={() => setOptionSelection('categories')} className="options">
          <span><FaList size={20} /></span>&nbsp;<span>Categories</span>
        </div>
        <div onClick={() => setOptionSelection('addloc')} className="options">
          <span><FaPlus size={20} /></span>&nbsp;<span>Add Location</span>
        </div>
        <div onClick={() => setOptionSelection('claims')} className="options">
          <span><FaCheckSquare size={20} /></span>&nbsp;<span>Claims</span>
        </div>
        <div onClick={() => {
          inactiveLocations.showInactive(true)
          router.push('/search-results')
        }} className="options">
          <span><FaBan size={20} /></span>&nbsp;<span>Show Inactive</span>
        </div>
      </div>

      <div className="content">
        {optionSelection === 'addloc' && <LocationEdit />}
        {optionSelection === 'categories' && <TableCategories />}
        {optionSelection === 'dashboard' && <Dashboard />}
        {optionSelection === 'claims' && <Claims />}
      </div>

      <style jsx>{`
        .adminContainer{
          position:relative;
          display:flex;
          flex-direction: row;
          height: 100%;
          min-height: 100vh;
        }
        .leftPanel{
          width: 100%;
          max-width: 200px;
          background-color: ${theme.colors.brandBlueDark};
          color: ${theme.colors.brandWhite};
          text-align: center;
          font-size: 16px;
          padding-top: 10px;
        }
        .content{
          width: 100%;
          padding: 30px;
        }
        .options{
          cursor: pointer;
          display: flex;
          justify-content: left;
          margin-bottom: 10px;
          margin-left: 20px;
          padding: 10px;
        }
        .customHeight{
          height: 100vh;
        }
      `}</style>
    </div>
  );
}
