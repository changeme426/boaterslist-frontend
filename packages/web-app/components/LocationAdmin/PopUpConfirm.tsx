import React from "react";
import theme from "common/theme";
import Button from "../Buttons/Button";

type PropsType = {
  onConfirm: () => void;
  onCancel: () => void;
  locationActive: boolean;
};

export const PopUpConfirm = ({ onConfirm, onCancel, locationActive }: PropsType) => {

  return (
    <div className="popUpConfirm">
      <div className="textContent">
        <div className="text">Do you want to make this location <b>{locationActive ? 'Inactive' : 'Active'}</b>?</div>
        <div className="note">Note: Ater <b>Confirm</b> You should <b>Save</b> your changes to make this location <b>{locationActive ? 'Inactive' : 'Active'}</b></div>
      </div>
      <div className="buttonsContainer">
        <Button
          style={{
            backgroundColor: `${theme.colors.brandOrange}`,
            color: `${theme.colors.brandWhite}`,
            marginRight: 10,
            maxWidth: 100
          }}
          title={"Cancel"}
          onClick={onCancel}
        />
        <Button
          style={{
            backgroundColor: `${theme.colors.brandBlue}`,
            color: `${theme.colors.brandWhite}`,
            margin: 0,
            maxWidth: 100
          }}
          title={"Confirm"}
          onClick={onConfirm}
        />
      </div>
      <style jsx>{`
          .popUpConfirm{
            padding: 30px;
          }
          .textContent{
            font-size: 18px;
            margin-bottom: 30px;
          }
          .text{
            margin-bottom: 10px;
          }
          .note{
            font-size: 14px;
          }
          .buttonsContainer{
            display: flex;
            justify-content: flex-end;
          }
        `}</style>
    </div>

  );
};

export default PopUpConfirm;
