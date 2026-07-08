# Real-Time Chat Application

## Overview

Real-Time Chat Application is a full-stack messaging platform built with Laravel for the backend and React for the frontend.

The system supports private chat, group chat, real-time messaging, media sharing, authentication, OTP verification, Firebase push notifications, AI chat, and an admin management dashboard.

The backend provides a secure REST API using Laravel Sanctum, while the frontend consumes the API using Axios and displays a modern responsive interface using React and Bootstrap.

## Project Parts

This project contains two main applications:

```txt
chat-app/
├── backend/     Laravel API
└── frontend/    React application
```

## Main Features

### Authentication

- Register
- Login
- Logout
- OTP verification
- Resend OTP
- Forgot password
- Reset password
- Change password
- Profile management
- Profile image upload
- Delete account
- Sanctum token authentication
- Role-based access control

### Private Chat

- Private messaging between users
- Real-time message receiving
- Typing indicator
- Message seen status
- Message delivered status
- Message reactions
- Delete message for self
- Delete message for everyone
- Send text messages
- Send images
- Send videos
- Send audio files
- Send documents
- Send location messages
- Message created date and time

### Chat Settings

- Pin chat
- Unpin chat
- Archive chat
- Unarchive chat
- Mute chat
- Unmute chat
- Block user
- Unblock user
- Confirmation modal for dangerous actions

### Group Chat

- Create groups
- View groups
- View group details
- Add group members
- View group members
- Remove group members
- Promote member to group admin
- Send group messages
- Real-time group messaging
- Send group media files
- Delete group
- Delete group messages
- Group message created date and time

### Notifications

- In-app notifications
- Firebase Cloud Messaging
- Save FCM token
- Browser notification permission
- Foreground notification toast
- Background browser notifications

### Admin Dashboard

- Dashboard statistics
- Total users
- Total admins
- Online users
- Banned users
- Total groups
- Total messages
- Latest users
- Latest groups
- User management
- Ban users
- Unban users
- Delete users
- Group management
- Delete groups
- Remove group members
- Delete group messages

### AI Chat

- AI chat page
- OpenAI API integration
- AI conversation support

## Technologies Used

### Backend

- Laravel
- PHP
- MySQL
- Laravel Sanctum
- Laravel Reverb
- Laravel Broadcasting
- Firebase Admin SDK
- Twilio Verify
- OpenAI API
- Laravel Storage
- REST API

### Frontend

- React
- Vite
- Axios
- React Router
- Bootstrap
- Bootstrap Icons
- Laravel Echo
- Pusher JS
- Firebase Messaging
- Context API
- Reducers
- localStorage

### Testing

- Apidog
- REST API testing
- Bearer token authentication
- Multipart form-data testing
- JSON request testing

## Requirements

Before running the project, install:

- PHP 8.2 or higher
- Composer
- MySQL
- Node.js
- npm
- Git
- Laravel CLI
- Apidog

## Backend Installation

Go to the backend folder:

```bash
cd backend
```

Install Laravel dependencies:

```bash
composer install
```

Create the environment file:

```bash
cp .env.example .env
```

Generate app key:

```bash
php artisan key:generate
```

Create database:

```sql
CREATE DATABASE `chat-app`;
```

Update backend `.env`:

```env
APP_NAME="Chat App"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://127.0.0.1:5173

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=chat-app
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

SANCTUM_STATEFUL_DOMAINS=127.0.0.1:5173,localhost:5173

QUEUE_CONNECTION=database
CACHE_STORE=database
FILESYSTEM_DISK=public

BROADCAST_CONNECTION=reverb

REVERB_APP_ID=
REVERB_APP_KEY=
REVERB_APP_SECRET=
REVERB_HOST=127.0.0.1
REVERB_PORT=8080
REVERB_SCHEME=http

OPENAI_API_KEY=

FIREBASE_CREDENTIALS=storage/app/firebase/firebase_file.json

TWILIO_SID=
TWILIO_TOKEN=
TWILIO_VERIFY_SERVICE=
```

Run migrations:

```bash
php artisan migrate
```

Create storage link:

```bash
php artisan storage:link
```

Clear cache:

```bash
php artisan optimize:clear
```

Start Laravel server:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

## Laravel Sanctum Setup

Install Sanctum if it is not installed:

```bash
composer require laravel/sanctum
```

Publish Sanctum files:

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

Run migrations:

```bash
php artisan migrate
```

Protected routes should use:

```php
auth:sanctum
```

Example:

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
});
```

## Laravel Reverb Setup

Install broadcasting and Reverb:

```bash
php artisan install:broadcasting
```

Make sure `.env` has:

```env
BROADCAST_CONNECTION=reverb

REVERB_APP_ID=
REVERB_APP_KEY=
REVERB_APP_SECRET=
REVERB_HOST=127.0.0.1
REVERB_PORT=8080
REVERB_SCHEME=http
```

Start Reverb:

```bash
php artisan reverb:start --host=127.0.0.1 --port=8080
```

## Laravel CORS Setup

If `config/cors.php` does not exist, create it.

```php
<?php

return [

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'broadcasting/*',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://127.0.0.1:5173',
        'http://localhost:5173',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
```

Then run:

```bash
php artisan optimize:clear
```

## Firebase Backend Setup

Create a Firebase project.

Download Firebase Admin SDK service account JSON file.

Place it here:

```txt
backend/storage/app/firebase/firebase_file.json
```

Add to backend `.env`:

```env
FIREBASE_CREDENTIALS=storage/app/firebase/firebase_file.json
```

Important:

- Do not commit Firebase service account JSON to GitHub.
- Do not expose private keys.
- Use Firebase Admin SDK only in the backend.

## Twilio Setup

Install Twilio package:

```bash
composer require twilio/sdk
```

Add Twilio values to backend `.env`:

```env
TWILIO_SID=
TWILIO_TOKEN=
TWILIO_VERIFY_SERVICE=
```

These values are used for OTP verification and resend OTP.

## OpenAI Setup

Add OpenAI key to backend `.env`:

```env
OPENAI_API_KEY=
```

This is used by the AI chat endpoint.

## Queue Setup

The project uses database queue:

```env
QUEUE_CONNECTION=database
```

Create jobs table if needed:

```bash
php artisan queue:table
php artisan migrate
```

Run queue worker:

```bash
php artisan queue:work
```

## Frontend Installation

Go to the frontend folder:

```bash
cd frontend
```

Install React dependencies:

```bash
npm install
```

Install required packages:

```bash
npm install axios react-router-dom bootstrap bootstrap-icons laravel-echo pusher-js firebase
```

Create frontend environment file:

```bash
cp .env.example .env
```

Update frontend `.env`:

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

Start React:

```bash
npm run dev
```

Open:

```txt
http://127.0.0.1:5173
```

Use `127.0.0.1`, not `localhost`, to avoid CORS issues.

## Firebase Frontend Setup

Firebase frontend values are found in:

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

The VAPID key usually starts with `B`.

It is not the measurement ID.

Create service worker file:

```txt
frontend/public/firebase-messaging-sw.js
```

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

## Running the Full Project

Open three terminals.

Terminal 1: Laravel server

```bash
cd backend
php artisan serve --host=127.0.0.1 --port=8000
```

Terminal 2: Reverb server

```bash
cd backend
php artisan reverb:start --host=127.0.0.1 --port=8080
```

Terminal 3: React server

```bash
cd frontend
npm run dev
```

Open:

```txt
http://127.0.0.1:5173
```

## Main API Routes

### Authentication

```txt
POST   /api/register
POST   /api/login
POST   /api/logout
GET    /api/profile
POST   /api/profile/update
POST   /api/change-password
POST   /api/forgot-password
POST   /api/reset-password
POST   /api/verify-otp
POST   /api/resend-otp
POST   /api/upload-avatar
POST   /api/auth/save-fcm-token
DELETE /api/delete-account
```

### Private Chat

```txt
GET    /api/chat/users
GET    /api/chat/conversations
GET    /api/chat/conversation/{userId}
POST   /api/chat/send-message
POST   /api/chat/typing
POST   /api/chat/react-message
GET    /api/chat/search-messages
DELETE /api/chat/delete-message/{id}
DELETE /api/chat/delete-for-everyone/{id}
```

### Chat Settings

```txt
POST /api/chat-settings/{userId}/pin
POST /api/chat-settings/{userId}/unpin
POST /api/chat-settings/{userId}/archive
POST /api/chat-settings/{userId}/unarchive
POST /api/chat-settings/{userId}/mute
POST /api/chat-settings/{userId}/unmute
POST /api/chat-settings/{userId}/block
POST /api/chat-settings/{userId}/unblock
```

### Groups

```txt
GET    /api/groups
POST   /api/groups
GET    /api/groups/{id}
GET    /api/groups/{id}/messages
POST   /api/groups/{id}/messages
POST   /api/groups/{id}/members
DELETE /api/groups/{groupId}/members/{userId}
DELETE /api/groups/{id}
```

### Admin

```txt
GET    /api/admin/dashboard
GET    /api/admin/users
POST   /api/admin/users/{id}/ban
POST   /api/admin/users/{id}/unban
DELETE /api/admin/users/{id}

GET    /api/admin/groups
GET    /api/admin/groups/{id}
DELETE /api/admin/groups/{id}
DELETE /api/admin/groups/{groupId}/members/{userId}
POST   /api/admin/groups/{groupId}/members/{userId}/make-admin
DELETE /api/admin/groups/{groupId}/messages
```

### AI Chat

```txt
POST /api/ai-chat
```

## Apidog API Testing Guide

Use Apidog to test all backend API routes.

### Base URL

```txt
http://127.0.0.1:8000/api
```

### Headers

For all requests:

```txt
Accept: application/json
```

For protected routes:

```txt
Authorization: Bearer YOUR_TOKEN
```

For JSON requests:

```txt
Content-Type: application/json
```

For file upload requests:

```txt
Content-Type: multipart/form-data
```

## Apidog Environment Variables

Create an Apidog environment with these variables:

```txt
base_url = http://127.0.0.1:8000/api
token = your_user_token
admin_token = your_admin_token
user_id = 2
group_id = 1
message_id = 1
```

Use variables like this:

```txt
{{base_url}}/login
{{base_url}}/chat/conversation/{{user_id}}
{{base_url}}/groups/{{group_id}}/messages
```

## Apidog Authentication Flow

### 1. Register

Method:

```txt
POST
```

URL:

```txt
{{base_url}}/register
```

Body:

```json
{
  "name": "Ali Mahmoud",
  "email": "ali@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "70123456"
}
```

### 2. Verify OTP

Method:

```txt
POST
```

URL:

```txt
{{base_url}}/verify-otp
```

Body:

```json
{
  "email": "ali@example.com",
  "otp": "123456"
}
```

### 3. Login

Method:

```txt
POST
```

URL:

```txt
{{base_url}}/login
```

Body:

```json
{
  "email": "ali@example.com",
  "password": "password123"
}
```

Save the returned token as:

```txt
token
```

### 4. Profile

Method:

```txt
GET
```

URL:

```txt
{{base_url}}/profile
```

Headers:

```txt
Authorization: Bearer {{token}}
Accept: application/json
```

## Apidog Private Chat Testing

### Get Users

```txt
GET {{base_url}}/chat/users
```

### Get Conversations

```txt
GET {{base_url}}/chat/conversations
```

### Get Conversation With User

```txt
GET {{base_url}}/chat/conversation/{{user_id}}
```

### Send Text Message

```txt
POST {{base_url}}/chat/send-message
```

Body:

```json
{
  "receiver_id": 2,
  "type": "text",
  "message": "Hello, how are you?"
}
```

### Send File Message

Use `multipart/form-data`:

```txt
receiver_id: 2
type: image
message: This is an image
file: selected file
```

Supported file message types:

```txt
image
video
audio
file
```

### React To Message

```txt
POST {{base_url}}/chat/react-message
```

Body:

```json
{
  "message_id": 1,
  "reaction": "❤️"
}
```

### Delete Message

```txt
DELETE {{base_url}}/chat/delete-message/{{message_id}}
```

### Delete Message For Everyone

```txt
DELETE {{base_url}}/chat/delete-for-everyone/{{message_id}}
```

## Apidog Chat Settings Testing

### Pin Chat

```txt
POST {{base_url}}/chat-settings/{{user_id}}/pin
```

### Unpin Chat

```txt
POST {{base_url}}/chat-settings/{{user_id}}/unpin
```

### Archive Chat

```txt
POST {{base_url}}/chat-settings/{{user_id}}/archive
```

### Unarchive Chat

```txt
POST {{base_url}}/chat-settings/{{user_id}}/unarchive
```

### Mute Chat

```txt
POST {{base_url}}/chat-settings/{{user_id}}/mute
```

### Unmute Chat

```txt
POST {{base_url}}/chat-settings/{{user_id}}/unmute
```

### Block User

```txt
POST {{base_url}}/chat-settings/{{user_id}}/block
```

### Unblock User

```txt
POST {{base_url}}/chat-settings/{{user_id}}/unblock
```

## Apidog Group Testing

### Get Groups

```txt
GET {{base_url}}/groups
```

### Create Group

Use `multipart/form-data`:

```txt
name: Developers
image: selected image
members[]: 2
members[]: 3
```

### Get Group Details

```txt
GET {{base_url}}/groups/{{group_id}}
```

### Get Group Messages

```txt
GET {{base_url}}/groups/{{group_id}}/messages
```

### Send Group Text Message

```txt
POST {{base_url}}/groups/{{group_id}}/messages
```

Body:

```json
{
  "type": "text",
  "message": "Hello group"
}
```

### Send Group File Message

Use `multipart/form-data`:

```txt
type: image
message: Group image
file: selected file
```

### Add Group Member

```txt
POST {{base_url}}/groups/{{group_id}}/members
```

Body:

```json
{
  "user_id": 4
}
```

### Remove Group Member

```txt
DELETE {{base_url}}/groups/{{group_id}}/members/{{user_id}}
```

### Delete Group

```txt
DELETE {{base_url}}/groups/{{group_id}}
```

## Apidog Admin Testing

Use admin token:

```txt
Authorization: Bearer {{admin_token}}
```

### Dashboard

```txt
GET {{base_url}}/admin/dashboard
```

Expected response:

```json
{
  "status": true,
  "statistics": {
    "users_count": 7,
    "admins_count": 2,
    "online_users": 3,
    "banned_users": 1,
    "groups_count": 2,
    "messages_count": 20
  },
  "latest_users": [],
  "latest_groups": []
}
```

### Users

```txt
GET {{base_url}}/admin/users
```

### Ban User

```txt
POST {{base_url}}/admin/users/{{user_id}}/ban
```

### Unban User

```txt
POST {{base_url}}/admin/users/{{user_id}}/unban
```

### Delete User

```txt
DELETE {{base_url}}/admin/users/{{user_id}}
```

### Admin Groups

```txt
GET {{base_url}}/admin/groups
```

### Delete Admin Group

```txt
DELETE {{base_url}}/admin/groups/{{group_id}}
```

### Remove Member From Group

```txt
DELETE {{base_url}}/admin/groups/{{group_id}}/members/{{user_id}}
```

### Make Group Admin

```txt
POST {{base_url}}/admin/groups/{{group_id}}/members/{{user_id}}/make-admin
```

### Delete Group Messages

```txt
DELETE {{base_url}}/admin/groups/{{group_id}}/messages
```

## Apidog AI Chat Testing

```txt
POST {{base_url}}/ai-chat
```

Body:

```json
{
  "message": "Explain Laravel Sanctum"
}
```

## Frontend Routes

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
/chat/conversations
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

## Backend Project Structure

```txt
backend/
├── app/
│   ├── Events/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── Admin/
│   │   │       ├── AuthController.php
│   │   │       ├── MessageController.php
│   │   │       ├── GroupController.php
│   │   │       ├── ChatSettingController.php
│   │   │       └── AiChatController.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Message.php
│   │   ├── MessageReaction.php
│   │   ├── ChatGroup.php
│   │   ├── GroupMember.php
│   │   ├── GroupMessage.php
│   │   └── ChatSetting.php
│   ├── Notifications/
│   ├── Providers/
│   └── Services/
├── config/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   ├── api.php
│   └── channels.php
└── storage/
```

## Frontend Project Structure

```txt
frontend/
├── public/
│   └── firebase-messaging-sw.js
├── src/
│   ├── api/
│   │   └── axios.jsx
│   ├── bootstrap/
│   │   ├── echo.jsx
│   │   └── firebase.jsx
│   ├── components/
│   │   └── groups/
│   ├── constants/
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ChatContext.jsx
│   │   ├── GroupContext.jsx
│   │   ├── ModalContext.jsx
│   │   └── ToastContext.jsx
│   ├── layouts/
│   │   ├── AuthLayout.jsx
│   │   ├── ChatLayout.jsx
│   │   └── AdminLayout.jsx
│   ├── pages/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── groups/
│   │   ├── profile/
│   │   └── public/
│   ├── reducers/
│   ├── routes/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
```

## Common Issues

### CORS Error

Use the same host everywhere:

```txt
http://127.0.0.1:5173
http://127.0.0.1:8000
```

Do not mix:

```txt
localhost
127.0.0.1
```

### Reverb Not Working

Make sure Reverb is running:

```bash
php artisan reverb:start --host=127.0.0.1 --port=8080
```

Make sure backend `.env` has:

```env
BROADCAST_CONNECTION=reverb
REVERB_HOST=127.0.0.1
REVERB_PORT=8080
REVERB_SCHEME=http
```

Make sure frontend `.env` has:

```env
VITE_REVERB_HOST=127.0.0.1
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```

### Firebase VAPID Error

If this error appears:

```txt
The provided applicationServerKey is not valid
```

Use the correct Web Push certificate key from Firebase Console.

The VAPID key is not:

```txt
measurementId
apiKey
appId
projectId
senderId
```

### Images Not Showing

Run:

```bash
php artisan storage:link
```

Make sure frontend `.env` has:

```env
VITE_STORAGE_URL=http://127.0.0.1:8000/storage/
```

### Unauthorized Error

Make sure the request has:

```txt
Authorization: Bearer YOUR_TOKEN
Accept: application/json
```

### Admin Routes Not Working

Make sure the logged-in user has:

```txt
role = admin
```

Make sure backend routes use admin middleware.

## Production Deployment Notes

### Backend

Before deployment:

```bash
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
php artisan storage:link
```

Use Supervisor or a process manager for:

```bash
php artisan queue:work
php artisan reverb:start
```

Production `.env`:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.your-domain.com
FRONTEND_URL=https://your-domain.com
REVERB_SCHEME=https
```

### Frontend

Build frontend:

```bash
npm run build
```

Deploy the `dist` folder.

Production frontend `.env`:

```env
VITE_API_URL=https://api.your-domain.com/api
VITE_STORAGE_URL=https://api.your-domain.com/storage/

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

## Security Notes

- Do not commit `.env` files.
- Do not commit Firebase service account JSON.
- Do not expose Twilio credentials.
- Do not expose OpenAI API keys.
- Do not expose private Reverb secrets.
- Use HTTPS in production.
- Rotate any key that was exposed publicly.
- Protect admin routes with role middleware.
- Use Bearer token authentication for protected routes.

## License

This project was developed as a professional full-stack portfolio project to demonstrate practical experience in building secure, real-time, and scalable web applications using Laravel and React.
