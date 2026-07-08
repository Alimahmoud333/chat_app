<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\ChatGroup;
use App\Models\GroupMessage;
use App\Models\GroupMember;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Storage;

class GroupAdminController extends Controller
{
    /*
    =========================================
    ALL GROUPS
    =========================================
    */
public function groups(Request $request)
{
    $groups = ChatGroup::with([
            'admin:id,name,email,profile_image',
            'members:id,name,email,profile_image',
        ])

        ->withCount('members')

        ->when(
            $request->search,
            function ($q) use ($request) {
                $q->where(
                    'name',
                    'LIKE',
                    '%' . $request->search . '%'
                );
            }
        )

        ->latest()

        ->paginate(20);

    return response()->json([
        'status' => true,
        'groups' => $groups,
    ]);
}
    /*
    =========================================
    SHOW GROUP
    =========================================
    */
public function show($id)
{
    $group = ChatGroup::with([

        'members',

        'messages.sender'
    ])

    ->findOrFail($id);

    return response()->json([

        'status' => true,

        'group' => $group,
    ]);
}
    /*
    =========================================
    DELETE GROUP
    =========================================
    */

    public function deleteGroup($id)
    {
        $group = ChatGroup::findOrFail($id);

        /*
        DELETE GROUP IMAGE
        */

        if ($group->image) {

            Storage::disk('public')
                ->delete(
                    $group->image
                );
        }

        /*
        DELETE GROUP FILES
        */

$messages = GroupMessage::where(
    'group_id',
    $group->id
)->get();
        foreach ($messages as $message) {

            if ($message->file) {

                Storage::disk('public')
                    ->delete(
                        $message->file
                    );
            }
        }

        /*
        DELETE GROUP
        */

        $group->delete();

        return response()->json([

            'status' => true,

            'message' =>
                'Group deleted',
        ]);
    }

    /*
    =========================================
    REMOVE MEMBER
    =========================================
    */

    public function removeMember(
        $groupId,
        $userId
    )
    {
        $member = GroupMember::where(

                'group_id',
                $groupId
            )

            ->where(
                'user_id',
                $userId
            )

            ->firstOrFail();

        $member->delete();

        return response()->json([

            'status' => true,

            'message' =>
                'Member removed',
        ]);
    }

    /*
    =========================================
    MAKE GROUP ADMIN
    =========================================
    */

    public function makeAdmin(
        $groupId,
        $userId
    )
    {
        $member = GroupMember::where(

                'group_id',
                $groupId
            )

            ->where(
                'user_id',
                $userId
            )

            ->firstOrFail();
//updated
        $member->update([

            'is_admin' => true,
        ]);

        return response()->json([

            'status' => true,

            'message' =>
                'Member promoted to admin',
        ]);
    }

    /*
    =========================================
    DELETE GROUP MESSAGES
    =========================================
    */
public function deleteMessages($groupId)
{
    $messages = GroupMessage::where(
        'group_id',
        $groupId
    )->get();

    foreach ($messages as $message) {

        if ($message->file) {

            Storage::disk('public')
                ->delete(
                    $message->file
                );
        }

        $message->delete();
    }

    return response()->json([

        'status' => true,

        'message' => 'Group messages deleted',
    ]);
}
}