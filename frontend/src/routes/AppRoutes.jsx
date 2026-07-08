import { createBrowserRouter } from "react-router-dom";

import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import LandingPage from "../pages/public/LandingPage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

import ChatLayout from "../layouts/ChatLayout";
import ChatPage from "../pages/chat/ChatPage";
import UsersPage from "../pages/chat/UsersPage";
import PrivateChatPage from "../pages/chat/PrivateChatPage";
import ConversationsPage from "../pages/chat/ConversationsPage";
import AiChatPage from "../pages/chat/AiChatPage";
import SearchMessagesPage from "../pages/chat/SearchMessagesPage";

import ProfilePage from "../pages/profile/ProfilePage";
import ChangePasswordPage from "../pages/profile/ChangePasswordPage";

import GroupsPage from "../pages/groups/GroupsPage";
import GroupChatPage from "../pages/groups/GroupChatPage";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminGroupsPage from "../pages/admin/AdminGroupsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    element: <GuestRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOtpPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <ChatLayout />,
        children: [
          {
            path: "/chat",
            element: <ChatPage />,
          },
          {
            path: "/chat/conversations",
            element: <ConversationsPage />,
          },
          {
            path: "/chat/users",
            element: <UsersPage />,
          },
          {
            path: "/chat/private/:userId",
            element: <PrivateChatPage />,
          },
          {
            path: "/chat/groups",
            element: <GroupsPage />,
          },
          {
            path: "/chat/groups/:groupId",
            element: <GroupChatPage />,
          },
          {
            path: "/chat/ai",
            element: <AiChatPage />,
          },
          {
            path: "/chat/search",
            element: <SearchMessagesPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/change-password",
            element: <ChangePasswordPage />,
          },
        ],
      },
    ],
  },

  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/admin/dashboard",
            element: <AdminDashboardPage />,
          },
          {
            path: "/admin/users",
            element: <AdminUsersPage />,
          },
          {
            path: "/admin/groups",
            element: <AdminGroupsPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
