import { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export default function ModalProvider({ children }) {
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    type: "primary",
    onConfirm: null,
  });

  function showModal({
    title = "Are you sure?",
    message = "Please confirm this action.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "primary",
    onConfirm = null,
  }) {
    setModal({
      show: true,
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm,
    });
  }

  function closeModal() {
    setModal({
      show: false,
      title: "",
      message: "",
      confirmText: "Confirm",
      cancelText: "Cancel",
      type: "primary",
      onConfirm: null,
    });
  }

  async function handleConfirm() {
    if (modal.onConfirm) {
      await modal.onConfirm();
    }

    closeModal();
  }

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}

      {modal.show && (
        <div className="modal fade show d-block custom-confirm-backdrop">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-body p-4 text-center">
                <div className={`confirm-icon confirm-${modal.type}`}>
                  {modal.type === "danger" ? (
                    <i className="bi bi-exclamation-triangle-fill"></i>
                  ) : modal.type === "warning" ? (
                    <i className="bi bi-exclamation-circle-fill"></i>
                  ) : (
                    <i className="bi bi-question-circle-fill"></i>
                  )}
                </div>

                <h5 className="fw-bold mt-3 mb-2">{modal.title}</h5>

                <p className="text-muted mb-4">{modal.message}</p>

                <div className="d-flex justify-content-center gap-2">
                  <button
                    type="button"
                    className="btn btn-light rounded-3 px-4"
                    onClick={closeModal}>
                    {modal.cancelText}
                  </button>

                  <button
                    type="button"
                    className={`btn btn-${modal.type} rounded-3 px-4`}
                    onClick={handleConfirm}>
                    {modal.confirmText}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
