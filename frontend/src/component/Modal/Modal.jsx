import "./style.scss";

function Modal({children,Close}) {
  return (
    <div className="modal">
    <div className="modal-close">
      <img
        className="pmodal-close"
        onClick={Close}
        src="./icones/RiCloseCircleFill.svg"
      />
    </div>
    {children}
    </div>
  );
}

export default Modal;
