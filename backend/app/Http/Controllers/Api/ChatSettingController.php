<?php

namespace App\Http\Controllers\Api;

use App\Models\ChatSetting;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

class ChatSettingController extends Controller
{
    /*
    =========================================
    PIN CHAT
    =========================================
    */

    public function pin($userId)
    {
        $setting = ChatSetting::updateOrCreate(

            [

                'user_id' =>
                    auth()->id(),

                'target_user_id' =>
                    $userId,
            ],

            [

                'is_pinned' => true,
            ]
        );

        return response()->json([

            'status' => true,

            'setting' => $setting,
        ]);
    }

    /*
    =========================================
    UNPIN CHAT
    =========================================
    */

    public function unpin($userId)
    {
        $setting = ChatSetting::where(

            'user_id',
            auth()->id()

        )->where(

            'target_user_id',
            $userId

        )->first();

        if ($setting) {

            $setting->update([

                'is_pinned' => false,
            ]);
        }

        return response()->json([

            'status' => true,
        ]);
    }

    /*
    =========================================
    ARCHIVE CHAT
    =========================================
    */

    public function archive($userId)
    {
        $setting = ChatSetting::updateOrCreate(

            [

                'user_id' =>
                    auth()->id(),

                'target_user_id' =>
                    $userId,
            ],

            [

                'is_archived' => true,
            ]
        );

        return response()->json([

            'status' => true,

            'setting' => $setting,
        ]);
    }

    /*
    =========================================
    UNARCHIVE
    =========================================
    */

    public function unarchive($userId)
    {
        $setting = ChatSetting::where(

            'user_id',
            auth()->id()

        )->where(

            'target_user_id',
            $userId

        )->first();

        if ($setting) {

            $setting->update([

                'is_archived' => false,
            ]);
        }

        return response()->json([

            'status' => true,
        ]);
    }

    /*
    =========================================
    MUTE CHAT
    =========================================
    */

    public function mute($userId)
    {
        $setting = ChatSetting::updateOrCreate(

            [

                'user_id' =>
                    auth()->id(),

                'target_user_id' =>
                    $userId,
            ],

            [

                'is_muted' => true,
            ]
        );

        return response()->json([

            'status' => true,

            'setting' => $setting,
        ]);
    }

    /*
    =========================================
    UNMUTE CHAT
    =========================================
    */

    public function unmute($userId)
    {
        $setting = ChatSetting::where(

            'user_id',
            auth()->id()

        )->where(

            'target_user_id',
            $userId

        )->first();

        if ($setting) {

            $setting->update([

                'is_muted' => false,
            ]);
        }

        return response()->json([

            'status' => true,
        ]);
    }

    /*
    =========================================
    BLOCK USER
    =========================================
    */

    public function block($userId)
    {
        $setting = ChatSetting::updateOrCreate(

            [

                'user_id' =>
                    auth()->id(),

                'target_user_id' =>
                    $userId,
            ],

            [

                'is_blocked' => true,
            ]
        );

        return response()->json([

            'status' => true,

            'setting' => $setting,
        ]);
    }

    /*
    =========================================
    UNBLOCK USER
    =========================================
    */

    public function unblock($userId)
    {
        $setting = ChatSetting::where(

            'user_id',
            auth()->id()

        )->where(

            'target_user_id',
            $userId

        )->first();

        if ($setting) {

            $setting->update([

                'is_blocked' => false,
            ]);
        }

        return response()->json([

            'status' => true,
        ]);
    }
}