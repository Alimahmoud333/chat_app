<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\ChatSettingController;
use App\Http\Controllers\Api\AiChatController;

use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\Admin\GroupAdminController;

/*
|--------------------------------------------------------------------------
| PUBLIC AUTH ROUTES
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {

    /*
    =========================================
    REGISTER
    =========================================
    */

    Route::post(
        'register',
        [AuthController::class, 'register']
    );

    /*
    =========================================
    LOGIN
    =========================================
    */

    Route::post(
        'login',
        [AuthController::class, 'login']
    );

    /*
    =========================================
    OTP
    =========================================
    */

    Route::post(
        'verify-otp',
        [AuthController::class, 'verifyOtp']
    );

    Route::post(
        'resend-otp',
        [AuthController::class, 'resendOtp']
    );

    /*
    =========================================
    PASSWORD RESET
    =========================================
    */

    Route::post(
        'forgot-password',
        [AuthController::class, 'forgotPassword']
    );

    Route::post(
        'reset-password',
        [AuthController::class, 'resetPassword']
    );
});

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | AUTH USER ROUTES
    |--------------------------------------------------------------------------
    */

    Route::prefix('auth')->group(function () {

        /*
        =========================================
        PROFILE
        =========================================
        */

        Route::get(
            'profile',
            [AuthController::class, 'profile']
        );

        Route::post(
            'update-profile',
            [AuthController::class, 'updateProfile']
        );

        /*
        =========================================
        CHANGE PASSWORD
        =========================================
        */

        Route::post(
            'change-password',
            [AuthController::class, 'changePassword']
        );

        /*
        =========================================
        SAVE FCM TOKEN
        =========================================
        */

Route::post('/auth/save-fcm-token', [AuthController::class, 'saveFcmToken']);

        /*
        =========================================
        LOGOUT
        =========================================
        */

        Route::post(
            'logout',
            [AuthController::class, 'logout']
        );
    });

    /*
    |--------------------------------------------------------------------------
    | PRIVATE CHAT ROUTES
    |--------------------------------------------------------------------------
    */

    Route::prefix('chat')->group(function () {

        /*
        =========================================
        USERS
        =========================================
        */

        Route::get(
            'users',
            [MessageController::class, 'users']
        );

        /*
        =========================================
        CONVERSATIONS
        =========================================
        */

        Route::get(
            'conversations',
            [MessageController::class, 'conversations']
        );

        Route::get(
            'conversation/{userId}',
            [MessageController::class, 'conversation']
        );

        /*
        =========================================
        SEND MESSAGE
        =========================================
        */

        Route::post(
            'send-message',
            [MessageController::class, 'send']
        );

        /*
        =========================================
        TYPING
        =========================================
        */

        Route::post(
            'typing',
            [MessageController::class, 'typing']
        );

        /*
        =========================================
        REACTION
        =========================================
        */

        Route::post(
            'react-message',
            [MessageController::class, 'react']
        );

        /*
        =========================================
        SEARCH
        =========================================
        */

        Route::post(
            'search-messages',
            [MessageController::class, 'search']
        );

        /*
        =========================================
        DELETE
        =========================================
        */

        Route::delete(
            'delete-message/{id}',
            [MessageController::class, 'delete']
        );

        Route::delete(
            'delete-for-everyone/{id}',
            [MessageController::class, 'deleteForEveryone']
        );
    });

    /*
    |--------------------------------------------------------------------------
    | GROUP CHAT ROUTES
    |--------------------------------------------------------------------------
    */

    Route::prefix('groups')->group(function () {

        /*
        =========================================
        CREATE GROUP
        =========================================
        */

        Route::post(
            'create',
            [GroupController::class, 'create']
        );

        /*
        =========================================
        MY GROUPS
        =========================================
        */

        Route::get(
            'my-groups',
            [GroupController::class, 'myGroups']
        );

        /*
        =========================================
        GROUP DETAILS
        =========================================
        */

        Route::get(
            '{groupId}',
            [GroupController::class, 'details']
        );

        /*
        =========================================
        GROUP MESSAGES
        =========================================
        */

        Route::get(
            '{groupId}/messages',
            [GroupController::class, 'messages']
        );

        Route::post(
            '{groupId}/messages',
            [GroupController::class, 'sendMessage']
        );

        /*
        =========================================
        MEMBERS
        =========================================
        */

        Route::post(
            '{groupId}/members',
            [GroupController::class, 'addMember']
        );

        Route::delete(
            '{groupId}/members/{userId}',
            [GroupController::class, 'removeMember']
        );

        /*
        =========================================
        DELETE GROUP
        =========================================
        */

        Route::delete(
            '{groupId}',
            [GroupController::class, 'delete']
        );
    });

    /*
    |--------------------------------------------------------------------------
    | CHAT SETTINGS ROUTES
    |--------------------------------------------------------------------------
    */

    Route::prefix('chat-settings')->group(function () {

        /*
        =========================================
        PIN / UNPIN
        =========================================
        */

        Route::post(
            '{userId}/pin',
            [ChatSettingController::class, 'pin']
        );

        Route::post(
            '{userId}/unpin',
            [ChatSettingController::class, 'unpin']
        );

        /*
        =========================================
        ARCHIVE / UNARCHIVE
        =========================================
        */

        Route::post(
            '{userId}/archive',
            [ChatSettingController::class, 'archive']
        );

        Route::post(
            '{userId}/unarchive',
            [ChatSettingController::class, 'unarchive']
        );

        /*
        =========================================
        MUTE / UNMUTE
        =========================================
        */

        Route::post(
            '{userId}/mute',
            [ChatSettingController::class, 'mute']
        );

        Route::post(
            '{userId}/unmute',
            [ChatSettingController::class, 'unmute']
        );

        /*
        =========================================
        BLOCK / UNBLOCK
        =========================================
        */

        Route::post(
            '{userId}/block',
            [ChatSettingController::class, 'block']
        );

        Route::post(
            '{userId}/unblock',
            [ChatSettingController::class, 'unblock']
        );
    });

    /*
    |--------------------------------------------------------------------------
    | AI CHAT
    |--------------------------------------------------------------------------
    */

    Route::post(
        'ai-chat',
        [AiChatController::class, 'ask']
    );
});

/*
|--------------------------------------------------------------------------
| ADMIN ONLY ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth:sanctum',
    'role:admin',
])
->prefix('admin')
->group(function () {

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD
    |--------------------------------------------------------------------------
    */

    Route::get(
        'dashboard',
        [AdminController::class, 'dashboard']
    );

    /*
    |--------------------------------------------------------------------------
    | USERS MANAGEMENT
    |--------------------------------------------------------------------------
    */

    Route::get(
        'users',
        [AdminController::class, 'users']
    );

    Route::post(
        'users/{id}/ban',
        [AdminController::class, 'banUser']
    );

    Route::post(
        'users/{id}/unban',
        [AdminController::class, 'unbanUser']
    );

    Route::delete(
        'users/{id}',
        [AdminController::class, 'deleteUser']
    );

    /*
    |--------------------------------------------------------------------------
    | GROUPS MANAGEMENT
    |--------------------------------------------------------------------------
    */

    Route::get(
        'groups',
        [GroupAdminController::class, 'groups']
    );

    Route::get(
        'groups/{id}',
        [GroupAdminController::class, 'show']
    );

    Route::delete(
        'groups/{id}',
        [GroupAdminController::class, 'deleteGroup']
    );

    Route::delete(
        'groups/{groupId}/members/{userId}',
        [GroupAdminController::class, 'removeMember']
    );

    Route::put(
        'groups/{groupId}/members/{userId}/make-admin',
        [GroupAdminController::class, 'makeAdmin']
    );

    Route::delete(
        'groups/{groupId}/messages',
        [GroupAdminController::class, 'deleteMessages']
    );
});