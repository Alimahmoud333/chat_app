<?php

namespace App\Http\Controllers\Api;

use App\Models\ChatGroup;
use App\Models\GroupMember;
use App\Models\GroupMessage;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Events\GroupMessageSent;

class GroupController extends Controller
{
    /*
    =========================================
    CREATE GROUP
    =========================================
    */

    public function create(Request $request)
    {
        $request->validate([

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'image' => [
                'nullable',
                'image',
                'max:2048',
            ],

            'members' => [
                'required',
                'array',
                'min:1',
            ],

            'members.*' => [
                'exists:users,id',
            ],
        ]);

        /*
        =========================================
        UPLOAD GROUP IMAGE
        =========================================
        */

        $imagePath = null;

        if ($request->hasFile('image')) {

            $imagePath = $request
                ->file('image')
                ->store('groups', 'public');
        }

        /*
        =========================================
        CREATE GROUP
        =========================================
        */

        $group = ChatGroup::create([

            'name' => $request->name,

            'image' => $imagePath,

            'admin_id' => auth()->id(),
        ]);

        /*
        =========================================
        ADD CREATOR AS ADMIN
        =========================================
        */

        GroupMember::firstOrCreate(
            [
                'group_id' => $group->id,
                'user_id' => auth()->id(),
            ],
            [
                'is_admin' => true,
            ]
        );

        /*
        =========================================
        ADD MEMBERS
        =========================================
        */

        foreach ($request->members as $memberId) {

            if ((int) $memberId === auth()->id()) {
                continue;
            }

            GroupMember::firstOrCreate(
                [
                    'group_id' => $group->id,
                    'user_id' => $memberId,
                ],
                [
                    'is_admin' => false,
                ]
            );
        }

        return response()->json([

            'status' => true,

            'message' => 'Group created successfully',

            'group' => $group->load([
                'members',
                'admin',
            ]),
        ], 201);
    }

    /*
    =========================================
    MY GROUPS
    =========================================
    */

    public function myGroups()
    {
        $groups = ChatGroup::whereHas('members', function ($q) {

            $q->where('user_id', auth()->id());

        })
        ->with([
            'members',
            'admin',
        ])
        ->latest()
        ->paginate(20);

        return response()->json([

            'status' => true,

            'groups' => $groups,
        ]);
    }

    /*
    =========================================
    GROUP DETAILS
    =========================================
    */

    public function details($groupId)
    {
        $isMember = GroupMember::where('group_id', $groupId)
            ->where('user_id', auth()->id())
            ->exists();

        if (! $isMember) {

            return response()->json([
                'status' => false,
                'message' => 'You are not a member of this group',
            ], 403);
        }

        $group = ChatGroup::with([
            'members',
            'admin',
        ])->findOrFail($groupId);

        return response()->json([

            'status' => true,

            'group' => $group,
        ]);
    }

    /*
    =========================================
    SEND GROUP MESSAGE
    =========================================
    */

    public function sendMessage(Request $request, $groupId)
    {
        $request->validate([

            'message' => [
                'nullable',
                'string',
            ],

            'type' => [
                'required',
                'in:text,image,video,file,audio,location',
            ],

            'file' => [
                'nullable',
                'file',
                'max:51200',
            ],

            'latitude' => [
                'nullable',
                'numeric',
            ],

            'longitude' => [
                'nullable',
                'numeric',
            ],
        ]);

        /*
        =========================================
        CHECK MEMBERSHIP
        =========================================
        */

        $isMember = GroupMember::where('group_id', $groupId)
            ->where('user_id', auth()->id())
            ->exists();

        if (! $isMember) {

            return response()->json([
                'status' => false,
                'message' => 'You are not a member of this group',
            ], 403);
        }

        /*
        =========================================
        REQUIRE FILE FOR FILE TYPES
        =========================================
        */

        if (
            in_array($request->type, [
                'image',
                'video',
                'audio',
                'file',
            ])
            &&
            ! $request->hasFile('file')
        ) {

            return response()->json([
                'status' => false,
                'message' => 'File is required for this message type',
            ], 422);
        }

        /*
        =========================================
        REQUIRE LOCATION FOR LOCATION TYPE
        =========================================
        */

        if (
            $request->type === 'location'
            &&
            (
                ! $request->filled('latitude') ||
                ! $request->filled('longitude')
            )
        ) {

            return response()->json([
                'status' => false,
                'message' => 'Latitude and longitude are required for location message',
            ], 422);
        }

        /*
        =========================================
        UPLOAD FILE
        =========================================
        */

        $filePath = null;

        if ($request->hasFile('file')) {

            $filePath = $request
                ->file('file')
                ->store('group-messages', 'public');
        }

        /*
        =========================================
        CREATE MESSAGE
        =========================================
        */

        $message = GroupMessage::create([

            'group_id' => $groupId,

            'sender_id' => auth()->id(),

            'message' => $request->message,

            'type' => $request->type,

            'file' => $filePath,

            'latitude' => $request->latitude,

            'longitude' => $request->longitude,
        ]);

        $message->load([
            'sender',
            'group',
        ]);

        /*
        =========================================
        BROADCAST REALTIME
        =========================================
        */

        broadcast(
            new GroupMessageSent($message)
        )->toOthers();

        return response()->json([

            'status' => true,

            'message' => $message,
        ], 201);
    }

    /*
    =========================================
    GROUP MESSAGES
    =========================================
    */

    public function messages($groupId)
    {
        $isMember = GroupMember::where('group_id', $groupId)
            ->where('user_id', auth()->id())
            ->exists();

        if (! $isMember) {

            return response()->json([
                'status' => false,
                'message' => 'You are not a member of this group',
            ], 403);
        }

        $messages = GroupMessage::where('group_id', $groupId)
            ->with([
                'sender',
            ])
            ->oldest()
            ->paginate(30);

        return response()->json([

            'status' => true,

            'messages' => $messages,
        ]);
    }

    /*
    =========================================
    ADD MEMBER
    =========================================
    */

    public function addMember(Request $request, $groupId)
    {
        $request->validate([

            'user_id' => [
                'required',
                'exists:users,id',
            ],
        ]);

        /*
        =========================================
        ONLY GROUP ADMIN
        =========================================
        */

        $admin = GroupMember::where('group_id', $groupId)
            ->where('user_id', auth()->id())
            ->where('is_admin', true)
            ->exists();

        if (! $admin) {

            return response()->json([
                'status' => false,
                'message' => 'Only group admin can add members',
            ], 403);
        }

        $member = GroupMember::firstOrCreate(
            [
                'group_id' => $groupId,
                'user_id' => $request->user_id,
            ],
            [
                'is_admin' => false,
            ]
        );

        return response()->json([

            'status' => true,

            'message' => 'Member added successfully',

            'member' => $member,
        ]);
    }

    /*
    =========================================
    REMOVE MEMBER
    =========================================
    */

    public function removeMember($groupId, $userId)
    {
        /*
        =========================================
        ONLY GROUP ADMIN
        =========================================
        */

        $admin = GroupMember::where('group_id', $groupId)
            ->where('user_id', auth()->id())
            ->where('is_admin', true)
            ->exists();

        if (! $admin) {

            return response()->json([
                'status' => false,
                'message' => 'Only group admin can remove members',
            ], 403);
        }

        $group = ChatGroup::findOrFail($groupId);

        if ((int) $group->admin_id === (int) $userId) {

            return response()->json([
                'status' => false,
                'message' => 'Cannot remove group creator',
            ], 403);
        }

        GroupMember::where('group_id', $groupId)
            ->where('user_id', $userId)
            ->delete();

        return response()->json([

            'status' => true,

            'message' => 'Member removed successfully',
        ]);
    }

    /*
    =========================================
    DELETE GROUP
    =========================================
    */

    public function delete($groupId)
    {
        $group = ChatGroup::where('id', $groupId)
            ->where('admin_id', auth()->id())
            ->firstOrFail();

        $group->delete();

        return response()->json([

            'status' => true,

            'message' => 'Group deleted successfully',
        ]);
    }
}