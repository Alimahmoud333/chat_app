import React from "react";
import ReactDOM from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./assets/css/app.css";
import "./assets/css/auth.css";
import "./assets/css/chat.css";
import "./assets/css/admin.css";

import App from "./App";

import AuthProvider from "./context/AuthContext";
import ChatProvider from "./context/ChatContext";
import GroupProvider from "./context/GroupContext";
import ToastProvider from "./context/ToastContext";
import ModalProvider from "./context/ModalContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <ModalProvider>
        <AuthProvider>
          <ChatProvider>
            <GroupProvider>
              <App />
            </GroupProvider>
          </ChatProvider>
        </AuthProvider>
      </ModalProvider>
    </ToastProvider>
  </React.StrictMode>,
);
