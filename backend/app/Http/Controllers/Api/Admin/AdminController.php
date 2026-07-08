<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use App\Models\ChatGroup;
use App\Models\Message;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

class AdminController extends Controller
{
    /*
    =========================================
    DASHBOARD
    =========================================
    */
public function dashboard()
{
    $statistics = [
        'users_count' => User::count(),

        'admins_count' => User::where(
            'role',
            'admin'
        )->count(),

        'online_users' => User::where(
            'is_online',
            true
        )->count(),

        'banned_users' => User::where(
            'is_banned',
            true
        )->count(),

        'groups_count' => ChatGroup::count(),

        'messages_count' => Message::count(),
    ];

    $latestUsers = User::select(
            'id',
            'name',
            'email',
            'profile_image',
            'role',
            'is_online',
            'is_banned',
            'created_at'
        )
        ->latest()
        ->take(5)
        ->get();

    $latestGroups = ChatGroup::with([
            'admin:id,name,email,profile_image',
            'members:id,name,email,profile_image',
        ])
        ->select(
            'id',
            'name',
            'image',
            'admin_id',
            'created_at'
        )
        ->withCount('members')
        ->latest()
        ->take(5)
        ->get();

    return response()->json([
        'status' => true,
        'statistics' => $statistics,
        'latest_users' => $latestUsers,
        'latest_groups' => $latestGroups,
    ]);
}
    /*
    =========================================
    USERS LIST
    =========================================
    */

    public function users(Request $request)
    {
        $users = User::when(

                $request->search,

                function ($q)
                use ($request) {

                    $q->where(

                        'name',

                        'LIKE',

                        '%'.$request->search.'%'
                    );
                }
            )

            ->select(

                'id',

                'name',

                'email',

                'profile_image',

                'role',

                'is_online',

                'last_seen',

                'is_banned',

                'created_at'
            )

            ->latest()

            ->paginate(20);

        return response()->json([

            'status' => true,

            'users' => $users,
        ]);
    }

    /*
    =========================================
    BAN USER
    =========================================
    */

    public function banUser($id)
    {
        $user = User::findOrFail($id);

        /*
        PREVENT BANNING ADMIN
        */

        if ($user->role == 'admin') {

            return response()->json([

                'status' => false,

                'message' =>
                    'Cannot ban admin',
            ], 403);
        }

        $user->update([

            'is_banned' => true,
        ]);

        return response()->json([

            'status' => true,

            'message' =>
                'User banned',
        ]);
    }

    /*
    =========================================
    UNBAN USER
    =========================================
    */

    public function unbanUser($id)
    {
        $user = User::findOrFail($id);

        $user->update([

            'is_banned' => false,
        ]);

        return response()->json([

            'status' => true,

            'message' =>
                'User unbanned',
        ]);
    }



    /*
    =========================================
    DELETE USER
    =========================================
    */

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);

        /*
        PREVENT DELETE ADMIN
        */

        if ($user->role == 'admin') {

            return response()->json([

                'status' => false,

                'message' =>
                    'Cannot delete admin',
            ], 403);
        }

        /*
        DELETE PROFILE IMAGE
        */

        if ($user->profile_image) {

            \Storage::disk('public')
                ->delete(
                    $user->profile_image
                );
        }

        /*
        DELETE USER
        */

        $user->delete();

        return response()->json([

            'status' => true,

            'message' =>
                'User deleted',
        ]);
    }
}