# Chat Application Backend API

## Overview

This is the backend API for a real-time chat application built with Laravel. The system supports secure authentication, private messaging, group messaging, real-time broadcasting, file sharing, OTP verification, Firebase push notifications, AI chat integration, and an admin management panel.

The backend is designed as a RESTful API and is consumed by a React frontend.

## Main Features

### Authentication

- User registration
- User login
- Logout
- Profile management
- Profile image upload
- Change password
- Forgot password
- Reset password
- OTP verification
- Resend OTP
- Account deletion
- Laravel Sanctum token authentication

### Private Chat

- Send private messages
- Receive private messages
- Real-time message broadcasting using Laravel Reverb
- Message delivery status
- Message seen status
- Typing indicator
- Message reactions
- Delete message for self
- Delete message for everyone
- Send text messages
- Send image messages
- Send video messages
- Send audio messages
- Send files
- Send location messages

### Chat Settings

- Pin conversation
- Unpin conversation
- Archive conversation
- Unarchive conversation
- Mute conversation
- Unmute conversation
- Block user
- Unblock user

### Group Chat

- Create groups
- View groups
- View group details
- Send group messages
- Real-time group messages
- Add group members
- Remove group members
- Promote group member to admin
- Delete groups
- Delete group messages
- Group image support

### Notifications

- In-app notifications
- Firebase Cloud Messaging notifications
- Save FCM token
- Push notification when receiving messages

### Admin Panel API

- Admin dashboard statistics
- Manage users
- Ban users
- Unban users
- Delete users
- View groups
- Delete groups
- Remove group members
- Manage group messages

### AI Chat

- AI chat endpoint
- OpenAI API integration

## Technologies Used

- Laravel
- PHP
- MySQL
- Laravel Sanctum
- Laravel Reverb
- Laravel Broadcasting
- Firebase Cloud Messaging
- Twilio Verify
- OpenAI API
- REST API
- MySQL Database
- Laravel Storage

## Requirements

Make sure the following tools are installed:

- PHP 8.2 or higher
- Composer
- MySQL
- Node.js
- Laravel CLI
- Git

## Installation

Clone the project:

```bash
git clone https://github.com/your-username/chat-app-backend.git
cd chat-app-backend
```

Install PHP dependencies:

```bash
composer install
```

Create the environment file:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

## Environment Configuration

Update your `.env` file:

```env
APP_NAME="Chat App"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://127.0.0.1:5173

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

## Database Setup

Create a MySQL database:

```sql
CREATE DATABASE `chat-app`;
```

Run migrations:

```bash
php artisan migrate
```

Run seeders if available:

```bash
php artisan db:seed
```

Create the storage symbolic link:

```bash
php artisan storage:link
```

Clear cached configuration:

```bash
php artisan optimize:clear
```

## Sanctum Setup

Install Sanctum if it is not already installed:

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

Make sure protected API routes use:

```php
auth:sanctum
```

Example:

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
});
```

## Reverb Setup

Install Laravel Reverb:

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

Start the Reverb server:

```bash
php artisan reverb:start --host=127.0.0.1 --port=8080
```

Start Laravel server:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

## Broadcasting Authentication

Broadcasting authentication is handled through:

```txt
/broadcasting/auth
```

Make sure broadcasting routes are enabled in Laravel.

If you have CORS issues, create or update:

```txt
config/cors.php
```

Example:

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

## Firebase Setup

Create a Firebase project and generate a Firebase Admin SDK service account file.

Place the file inside:

```txt
storage/app/firebase/firebase_file.json
```

Then add this to `.env`:

```env
FIREBASE_CREDENTIALS=storage/app/firebase/firebase_file.json
```

The backend uses this file to send push notifications through Firebase Cloud Messaging.

Important: never commit the Firebase service account JSON file to GitHub.

## Twilio Verify Setup

Install Twilio SDK:

```bash
composer require twilio/sdk
```

Add Twilio credentials to `.env`:

```env
TWILIO_SID=
TWILIO_TOKEN=
TWILIO_VERIFY_SERVICE=
```

These values are used for OTP verification and resend OTP functionality.

## OpenAI Setup

Add your OpenAI API key to `.env`:

```env
OPENAI_API_KEY=
```

This key is used by the AI chat endpoint.

## Queue Setup

The project uses the database queue driver:

```env
QUEUE_CONNECTION=database
```

Create the jobs table if needed:

```bash
php artisan queue:table
php artisan migrate
```

Run the queue worker:

```bash
php artisan queue:work
```

## Common Commands

Run Laravel server:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

Run Reverb server:

```bash
php artisan reverb:start --host=127.0.0.1 --port=8080
```

Run queue worker:

```bash
php artisan queue:work
```

Clear cache:

```bash
php artisan optimize:clear
```

Run migrations:

```bash
php artisan migrate
```

Reset database:

```bash
php artisan migrate:fresh --seed
```

Create storage link:

```bash
php artisan storage:link
```

## API Route Overview

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
POST   /api/save-fcm-token
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
POST   /api/groups/{id}/messages
GET    /api/groups/{id}/messages
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

## Authentication Header

Protected routes require a Bearer token:

```txt
Authorization: Bearer YOUR_TOKEN
Accept: application/json
```

## File Upload Notes

For uploading images, videos, audio, or files, use `multipart/form-data`.

Example message upload fields:

```txt
receiver_id
type
message
file
```

Supported message types:

```txt
text
image
video
audio
file
location
```

## Project Structure

```txt
app/
├── Events/
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       ├── Admin/
│   │       ├── AuthController.php
│   │       ├── MessageController.php
│   │       ├── GroupController.php
│   │       ├── ChatSettingController.php
│   │       └── AiChatController.php
├── Models/
│   ├── User.php
│   ├── Message.php
│   ├── MessageReaction.php
│   ├── ChatGroup.php
│   ├── GroupMember.php
│   ├── GroupMessage.php
│   ├── ChatSetting.php
│   └── UserNotification.php
├── Notifications/
├── Providers/
└── Services/
```

## Security Notes

- Do not commit `.env` to GitHub.
- Do not commit Firebase service account files.
- Do not expose Twilio credentials.
- Do not expose OpenAI keys.
- Use HTTPS in production.
- Rotate any secret key that was exposed publicly.
- Use role middleware to protect admin routes.
- Use Sanctum middleware for authenticated API routes.

## Production Notes

Before deployment:

```bash
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
php artisan storage:link
```

Use a process manager such as Supervisor for:

```bash
php artisan queue:work
php artisan reverb:start
```

Production `.env` should use:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
FRONTEND_URL=https://your-frontend-domain.com
REVERB_SCHEME=https
```
