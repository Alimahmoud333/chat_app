# Chat Application Frontend

## Overview

This is the React frontend for a real-time chat application. It connects to a Laravel REST API backend and provides authentication, private chat, group chat, real-time messaging, Firebase browser notifications, AI chat, profile management, and an admin dashboard.

The application uses React with Vite, Axios, React Router, Bootstrap, Laravel Echo, Reverb, and Firebase Cloud Messaging.

## Main Features

### Authentication

- Login
- Register
- OTP verification
- Resend OTP
- Forgot password
- Reset password
- Protected routes
- Guest routes
- Token-based authentication using Laravel Sanctum
- User data caching with localStorage

### Chat

- Private conversations
- Real-time message receiving
- Send text messages
- Send images
- Send videos
- Send audio files
- Send documents
- Send locations
- Message reactions
- Typing indicator
- Message seen and delivered status
- Delete message
- Delete message for everyone
- Message date and time
- Conversation list
- Conversation search

### Chat Settings

- Pin chat
- Unpin chat
- Archive chat
- Unarchive chat
- Mute chat
- Unmute chat
- Block user
- Unblock user
- Confirmation modals for critical actions

### Group Chat

- View groups
- Create group
- View group messages
- Send group messages
- Real-time group messages
- Add members
- View members
- Delete group
- Group message date and time

### Notifications

- Firebase Cloud Messaging support
- Browser notification permission request
- Save FCM token to backend
- Foreground notification toast
- Background browser notifications

### Admin Panel

- Admin layout
- Admin dashboard
- User statistics
- Group statistics
- Message statistics
- Latest users
- Latest groups
- Manage users
- Ban users
- Unban users
- Delete users
- Manage groups
- Delete groups

### AI Chat

- AI chat page
- Sends prompts to Laravel AI endpoint
- Stores local AI conversation history

## Technologies Used

- React
- Vite
- React Router
- Axios
- Bootstrap
- Bootstrap Icons
- Laravel Echo
- Pusher JS
- Firebase Messaging
- localStorage
- Context API
- Reducers

## Requirements

Make sure the following tools are installed:

- Node.js
- npm
- Git
- Laravel backend running on `http://127.0.0.1:8000`
- Reverb server running on `127.0.0.1:8080`

## Installation

Clone the project:

```bash
git clone https://github.com/your-username/chat-app-frontend.git
cd chat-app-frontend
```

Install dependencies:

```bash
npm install
```

Install required packages:

```bash
npm install axios react-router-dom bootstrap bootstrap-icons laravel-echo pusher-js firebase
```

Create the environment file:

```bash
cp .env.example .env
```

## Environment Configuration

Create or update `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
VITE_STORAGE_URL=http://127.0.0.1:8000/storage/

VITE_REVERB_APP_KEY=
VITE_REVERB_HOST=127.0.0.1
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_VAPID_KEY=
```

Important: after editing `.env`, restart the React development server.

```bash
npm run dev
```

## Start the Project

Run the development server:

```bash
npm run dev
```

Open the project using:

```txt
http://127.0.0.1:5173
```

Use `127.0.0.1` instead of `localhost` to avoid CORS issues with the Laravel backend.

## Backend Requirements

Make sure the Laravel backend is running:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

Make sure Laravel Reverb is running:

```bash
php artisan reverb:start --host=127.0.0.1 --port=8080
```

The backend API URL should be:

```txt
http://127.0.0.1:8000/api
```

The storage URL should be:

```txt
http://127.0.0.1:8000/storage
```

## Project Structure

```txt
src/
├── api/
│   └── axios.jsx
├── bootstrap/
│   ├── echo.jsx
│   └── firebase.jsx
├── components/
│   ├── groups/
│   └── shared/
├── constants/
├── context/
│   ├── AuthContext.jsx
│   ├── ChatContext.jsx
│   ├── GroupContext.jsx
│   ├── ModalContext.jsx
│   └── ToastContext.jsx
├── layouts/
│   ├── AuthLayout.jsx
│   ├── ChatLayout.jsx
│   └── AdminLayout.jsx
├── pages/
│   ├── admin/
│   ├── auth/
│   ├── chat/
│   ├── groups/
│   ├── profile/
│   └── public/
├── reducers/
│   ├── authReducer.jsx
│   ├── chatReducer.jsx
│   └── groupReducer.jsx
├── routes/
│   ├── router.jsx
│   ├── GuestRoute.jsx
│   ├── ProtectedRoute.jsx
│   └── AdminRoute.jsx
├── utils/
│   └── notificationPermission.js
├── App.jsx
└── main.jsx
```

## Axios Configuration

The application uses a central Axios instance.

Example:

```jsx
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
```

## Authentication Flow

After login or register, the backend returns a token. The frontend stores it in localStorage:

```txt
token
user
```

The token is added automatically to all protected API requests.

Protected routes require an authenticated user.

Admin routes require:

```txt
role = admin
```

## Reverb and Echo Setup

The frontend uses Laravel Echo with Reverb.

Example `src/bootstrap/echo.jsx`:

```jsx
import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const baseUrl = apiUrl.replace("/api", "");

const EchoInstance = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  cluster: "mt1",
  wsHost: import.meta.env.VITE_REVERB_HOST || "127.0.0.1",
  wsPort: Number(import.meta.env.VITE_REVERB_PORT) || 8080,
  wssPort: Number(import.meta.env.VITE_REVERB_PORT) || 8080,
  forceTLS: import.meta.env.VITE_REVERB_SCHEME === "https",
  encrypted: import.meta.env.VITE_REVERB_SCHEME === "https",
  enabledTransports: ["ws", "wss"],
  disableStats: true,
  authEndpoint: `${baseUrl}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  },
});

export default EchoInstance;
```

## Firebase Setup

Install Firebase:

```bash
npm install firebase
```

Create `src/bootstrap/firebase.jsx` and configure Firebase using values from `.env`.

Firebase configuration values are found in:

```txt
Firebase Console
Project Settings
General
Your Apps
SDK setup and configuration
```

The VAPID key is found in:

```txt
Firebase Console
Project Settings
Cloud Messaging
Web Push certificates
```

The VAPID key is not the measurement ID. It usually starts with `B`.

## Firebase Service Worker

Create this file:

```txt
public/firebase-messaging-sw.js
```

The Firebase service worker must contain the Firebase configuration directly because `import.meta.env` cannot be used inside the public service worker file.

Example:

```js
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "New Message";

  const options = {
    body: payload.notification?.body || "You received a new message",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    data: payload.data || {},
  };

  self.registration.showNotification(title, options);
});
```

## Enable Notifications

The frontend requests notification permission, receives an FCM token, and sends it to the backend.

Expected backend route:

```txt
POST /api/auth/save-fcm-token
```

Request body:

```json
{
  "fcm_token": "firebase-token-value"
}
```

## Available Pages

### Public

```txt
/
```

### Authentication

```txt
/login
/register
/verify-otp
/forgot-password
/reset-password
```

### Chat

```txt
/chat
/chat/users
/chat/private/:userId
/chat/groups
/chat/groups/:groupId
/chat/ai
/chat/search
```

### Profile

```txt
/profile
/change-password
```

### Admin

```txt
/admin/dashboard
/admin/users
/admin/groups
```

## Route Protection

The application uses three route guards:

```txt
GuestRoute
ProtectedRoute
AdminRoute
```

`GuestRoute` allows only unauthenticated users.

`ProtectedRoute` allows only authenticated users.

`AdminRoute` allows only authenticated admin users.

## LocalStorage Keys

The application stores selected data in localStorage for faster loading:

```txt
token
user
chat_users
chat_conversations
chat_selected_user
chat_ai_messages
fcm_token
```

## Build for Production

Create production build:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

The production files will be generated inside:

```txt
dist/
```

## Deployment Notes

Before deployment:

- Set production API URL in `.env`
- Set production storage URL in `.env`
- Use HTTPS
- Update Firebase authorized domains
- Update backend CORS allowed origins
- Update Reverb host, port, and scheme
- Make sure browser notifications use HTTPS
- Do not expose private backend secrets in the frontend

Production `.env` example:

```env
VITE_API_URL=https://api.your-domain.com/api
VITE_STORAGE_URL=https://api.your-domain.com/storage

VITE_REVERB_APP_KEY=
VITE_REVERB_HOST=api.your-domain.com
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_VAPID_KEY=
```

## Common Issues

### Reverb CORS Error

Use the same host in frontend and backend:

```txt
http://127.0.0.1:5173
http://127.0.0.1:8000
```

Do not mix:

```txt
localhost
127.0.0.1
```

### Firebase VAPID Error

If this error appears:

```txt
The provided applicationServerKey is not valid
```

The VAPID key is wrong. Get the correct key from:

```txt
Firebase Console
Project Settings
Cloud Messaging
Web Push certificates
```

### Images Not Showing

Run this in Laravel:

```bash
php artisan storage:link
```

Make sure React has:

```env
VITE_STORAGE_URL=http://127.0.0.1:8000/storage/
```

### Unauthorized API Requests

Make sure the token exists in localStorage and Axios sends:

```txt
Authorization: Bearer YOUR_TOKEN
```

## Security Notes

- Do not store private backend secrets in React.
- Do not put service account JSON in the frontend.
- Do not expose OpenAI private keys in React.
- Do not expose Twilio credentials in React.
- Firebase frontend config is public, but Firebase Admin SDK credentials are private.
- Use HTTPS in production.
