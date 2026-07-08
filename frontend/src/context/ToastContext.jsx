import { createContext, useContext, useState } from "react";

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export default function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  function showToast(message, type = "success") {
    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        show: false,
      }));
    }, 3000);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div
        className="position-fixed top-0 end-0 p-3"
        style={{
          zIndex: 9999,
        }}
      >
        <div
          className={`toast show text-bg-${toast.type}`}
          role="alert"
          style={{
            minWidth: "300px",
            display: toast.show ? "block" : "none",
          }}
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>

            <button
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() =>
                setToast((prev) => ({
                  ...prev,
                  show: false,
                }))
              }
            />
          </div>
        </div>
      </div>
    </ToastContext.Provider>
  );
}