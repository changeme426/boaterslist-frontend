import React, { useEffect, useState } from 'react'
import Button from '../Buttons/Button'
import theme from '../../../common/theme'
import { defaultCommonStyles, defaultLocationEditBtns } from '../../utils/defaultStyles';
import Modal from 'components/Common/Modal';

interface PropTypes {
  onApprove: () => void,
  onReject: () => void
}

export const Approvals = ({ onApprove, onReject }: PropTypes) => {
  const [showModal, setShowModal] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState('');

  const onConfirmClaim = () => {
    if (approveOrReject === 'Approve') {
      onApprove()
    } else {
      onReject()
    }
    setShowModal(false);
  }

  const onActionClick = (value: string) => {
    setApproveOrReject(value);
    setShowModal(true);
  }

  return (
    <div className="approvals">
      <div className="actionBtns">
        <span className='rejectBtn'>
          <Button
            type={"button"}
            title={"Reject"}
            style={{ ...defaultLocationEditBtns, backgroundColor: theme.colors.brandRedError }}
            onClick={() => onActionClick('Reject')}
          />
        </span>
        <span>
          <Button
            type={"button"}
            title={"Approve"}
            style={defaultLocationEditBtns}
            onClick={() => onActionClick('Approve')}
          />
        </span>
      </div>
      <Modal onShow={showModal} onClose={() => setShowModal(false)}>
        <div className='container'>
          <div>Are you sure you want to <b>{approveOrReject}</b> this claim?</div>
          <div className="confirmBtns">
            <span>
              <Button
                title={"No"}
                style={{ ...defaultCommonStyles.defaultButtonStyles, width: 70, padding: 8 }}
                onClick={() => setShowModal(false)}
              />
            </span>
            <span>
              <Button
                title={"Yes"}
                style={{ ...defaultCommonStyles.defaultButtonStyles, width: 70, padding: 8 }}
                onClick={onConfirmClaim}
              />
            </span>
          </div>
        </div>
      </Modal>
      <style jsx>{`
        .actionBtns span{
          display: inline-block;
        }
        .actionBtns > span{
          padding-right: 10px;
        }
        .container{
          padding: 30px;
          padding-top: 0;
        }
        .confirmBtns{
          margin-top: 10px;
          display:flex;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
};
