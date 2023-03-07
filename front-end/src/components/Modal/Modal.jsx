import React from "react";
import "./Modal.scss";

const Modal = ({ setIsOpen, children, headerTitle }) => {
  return (
    <div className="modal">
      <div className="modal__content">
        <div className="modal__header">
          <div className="modal_title">{headerTitle}</div>
          <div
            className="modal__close"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <i data-visualcompletion="css-img" className={"icon-2 close"}></i>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
