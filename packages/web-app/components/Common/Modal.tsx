import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export const Modal = (props: any) => {
  const { children, onClose, onShow } = props;

  const onCloseModal = () => {
    document.body.style.overflow = 'auto';
    onClose();
  }

  useEffect(() => {
    if (onShow === true) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
  }, [onShow])


  return (
    <>
      {onShow ? <div className={'modal'}>
        <section className="modal-main" onClick={(e) => e.stopPropagation()}>
          <span className="iconStyle"><FaTimes name="close" style={{ cursor: "pointer", fontSize: "20" }} onClick={onCloseModal} /></span>
          {children}
        </section>

        <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          z-index: 99;
        }
        .modal-main {
          position: fixed;
          background: white;
          border-radius: 20px;
          height: auto;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .display-block {
          display: block;
        }
        .display-none {
          display: none;
        }
        .iconStyle{
          display: flex;
          position: relative;
          justify-content: flex-end;
          padding: 10px;
        }
        @media screen and (max-width: 750px) {
          .modal-main {
            border-radius: 0px;
            width: 100%;
          }
        }
      `}</style>
      </div> : null}
    </>
  );
};

export default Modal;
