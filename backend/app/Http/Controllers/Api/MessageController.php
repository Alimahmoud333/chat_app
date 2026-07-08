<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Message;
use App\Models\ChatSetting;
use App\Models\MessageReaction;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

use App\Events\UserTyping;
use App\Events\MessageSeen;
use App\Events\MessageDelivered;
use App\Events\PrivateMessageSent;
use App\Services\FirebaseNotificationService;

class MessageController extends Controller
{
    /*
    =========================================
    USERS LIST
    =========================================
    */

    public function users(Request $request)
    {
        /*
        AI USER
        */

        $aiUser = User::where(
            'email',
            'ai@chat.com'
        )

        ->select(
            'id',
            'name',
            'email',
            'profile_image',
            'is_online',
            'last_seen',
            'role'
        )

        ->first();

        /*
        NORMAL USERS
        */

        $users = User::where(
            'id',
            '!=',
            auth()->id()
        )

        ->where(
            'email',
            '!=',
            'ai@chat.com'
        )

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

        ->select(
            'id',
            'name',
            'email',
            'profile_image',
            'is_online',
            'last_seen',
            'role'
        )

        ->latest()

        ->paginate(20);

        /*
        ADD AI USER FIRST PAGE ONLY
        */

        if (
            $aiUser
            &&
            $users->currentPage() == 1
        ) {

            $collection = $users->getCollection();

            $collection->prepend(
                $aiUser
            );

            $users->setCollection(
                $collection
            );
        }

        return response()->json([

            'status' => true,

            'users' => $users,
        ]);
    }

      /*
    =========================================
    SEND MESSAGE
    =========================================
    */
    public function send(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'nullable|string',
            'type' => 'required|in:text,image,video,file,audio,location',
            'file' => 'nullable|file|max:51200',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'reply_to' => 'nullable|exists:messages,id',
            'is_forwarded' => 'nullable|boolean',
        ]);

        if ($request->receiver_id == auth()->id()) {
            return response()->json([
                'status' => false,
                'message' => 'Cannot message yourself',
            ], 422);
        }

        if (in_array($request->type, ['image','video','audio','file']) && !$request->hasFile('file')) {
            return response()->json([
                'status' => false,
                'message' => 'File required',
            ], 422);
        }

        $blocked = ChatSetting::where('user_id', $request->receiver_id)
            ->where('target_user_id', auth()->id())
            ->where('is_blocked', true)
            ->exists();

        if ($blocked) {
            return response()->json([
                'status' => false,
                'message' => 'You are blocked',
            ], 403);
        }

        DB::beginTransaction();

        try {
            $filePath = null;
            if ($request->hasFile('file')) {
                $filePath = $request->file('file')->store('messages','public');
            }

            $message = Message::create([
                'sender_id' => auth()->id(),
                'receiver_id' => $request->receiver_id,
                'message' => $request->message,
                'type' => $request->type,
                'file' => $filePath,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'reply_to' => $request->reply_to,
                'is_forwarded' => $request->is_forwarded ?? false,
            ]);

            $message->update([
                'is_delivered' => true,
                'delivered_at' => now(),
            ]);

           
            $message->load(['sender','receiver','replyMessage','reactions.user']);

            /*
            =========================================
            FIREBASE NOTIFICATION
            =========================================
            */
            $receiver = User::find($request->receiver_id);

            if ($receiver?->fcm_token) {
                app(FirebaseNotificationService::class)->send(
                    $receiver->fcm_token,
                    auth()->user()->name,
                    $request->message ?? 'Sent a file',
                    [
                        'type' => 'chat',
                        'sender_id' => (string) auth()->id(),
                        'receiver_id' => (string) $receiver->id,
                    ]
                );
            }

            
            broadcast(new MessageDelivered($message))->toOthers();
            broadcast(new PrivateMessageSent($message))->toOthers();

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => $message,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    
    /*
    =========================================
    CONVERSATION
    =========================================
    */

    public function conversation($userId)
    {
        $messages = Message::where(

                function ($q) use ($userId) {

                    $q->where(
                        'sender_id',
                        auth()->id()
                    )

                    ->where(
                        'receiver_id',
                        $userId
                    );
                }

            )

            ->orWhere(

                function ($q) use ($userId) {

                    $q->where(
                        'sender_id',
                        $userId
                    )

                    ->where(
                        'receiver_id',
                        auth()->id()
                    );
                }
            )

            ->with([

                'sender',

                'receiver',

                'replyMessage',

                'reactions.user'
            ])

            ->oldest()

            ->paginate(30);

        /*
        =========================================
        MARK SEEN
        =========================================
        */

        $seenMessages = Message::where(
            'sender_id',
            $userId
        )

        ->where(
            'receiver_id',
            auth()->id()
        )

        ->where(
            'is_seen',
            false
        )

        ->get();

        foreach ($seenMessages as $message) {

            $message->update([

                'is_seen' => true,

                'seen_at' => now(),
            ]);

            broadcast(
                new MessageSeen($message)
            )->toOthers();
        }

        return response()->json([

            'status' => true,

            'messages' => $messages,
        ]);
    }

    /*
    =========================================
    CONVERSATIONS LIST
    =========================================
    */
public function conversations()
{
    $userId = auth()->id();

    /*
    =========================================
    GET ALL USER MESSAGES
    =========================================
    */

    $messages = Message::where(
            'sender_id',
            $userId
        )

        ->orWhere(
            'receiver_id',
            $userId
        )

        ->with([
            'sender',
            'receiver',
        ])

        ->latest()

        ->get();

    /*
    =========================================
    UNIQUE USERS
    =========================================
    */

    $conversationUsers = [];

    foreach ($messages as $message) {

        $otherUser = $message->sender_id == $userId
            ? $message->receiver
            : $message->sender;

        if (! $otherUser) {
            continue;
        }

        if (! isset($conversationUsers[$otherUser->id])) {

            /*
            =========================================
            LAST MESSAGE
            =========================================
            */

            $lastMessage = Message::where(

                    function ($q) use ($userId, $otherUser) {

                        $q->where(
                            'sender_id',
                            $userId
                        )

                        ->where(
                            'receiver_id',
                            $otherUser->id
                        );
                    }
                )

                ->orWhere(

                    function ($q) use ($userId, $otherUser) {

                        $q->where(
                            'sender_id',
                            $otherUser->id
                        )

                        ->where(
                            'receiver_id',
                            $userId
                        );
                    }
                )

                ->with([
                    'sender',
                    'receiver',
                ])

                ->latest()

                ->first();

            /*
            =========================================
            UNREAD COUNT
            =========================================
            */

            $unread = Message::where(
                    'sender_id',
                    $otherUser->id
                )

                ->where(
                    'receiver_id',
                    $userId
                )

                ->where(
                    'is_seen',
                    false
                )

                ->count();

            /*
            =========================================
            CHAT SETTING
            =========================================
            */

            $setting = ChatSetting::where(
                    'user_id',
                    $userId
                )

                ->where(
                    'target_user_id',
                    $otherUser->id
                )

                ->first();

            /*
            =========================================
            PUSH
            =========================================
            */

            $conversationUsers[$otherUser->id] = [

                'user' => $otherUser,

                'last_message' => $lastMessage,

                'unread_count' => $unread,

                'setting' => [

                    'is_pinned' => (bool) optional($setting)->is_pinned,

                    'is_archived' => (bool) optional($setting)->is_archived,

                    'is_muted' => (bool) optional($setting)->is_muted,

                    'is_blocked' => (bool) optional($setting)->is_blocked,
                ],
            ];
        }
    }

    /*
    =========================================
    SORT PINNED FIRST
    =========================================
    */

    $conversations = array_values($conversationUsers);

    usort($conversations, function ($a, $b) {

        $aPinned = $a['setting']['is_pinned'] ?? false;

        $bPinned = $b['setting']['is_pinned'] ?? false;

        if ($aPinned && ! $bPinned) {
            return -1;
        }

        if (! $aPinned && $bPinned) {
            return 1;
        }

        $aTime = optional($a['last_message'])->created_at;

        $bTime = optional($b['last_message'])->created_at;

        return strtotime($bTime) <=> strtotime($aTime);
    });

    return response()->json([

        'status' => true,

        'conversations' => $conversations,
    ]);
}
    /*
    =========================================
    DELETE MESSAGE
    =========================================
    */

    public function delete($id)
    {
        $message = Message::where(
            'id',
            $id
        )

        ->where(
            'sender_id',
            auth()->id()
        )

        ->firstOrFail();

        /*
        DELETE FILE
        */

        if ($message->file) {

            Storage::disk('public')
                ->delete(
                    $message->file
                );
        }

        $message->delete();

        return response()->json([

            'status' => true,

            'message' => 'Deleted',
        ]);
    }

    /*
    =========================================
    DELETE FOR EVERYONE
    =========================================
    */

    public function deleteForEveryone($id)
    {
        $message = Message::where(
            'id',
            $id
        )

        ->where(
            'sender_id',
            auth()->id()
        )

        ->firstOrFail();

        /*
        =========================================
        DELETE FILE
        =========================================
        */

        if ($message->file) {

            Storage::disk('public')
                ->delete(
                    $message->file
                );
        }

        /*
        =========================================
        UPDATE MESSAGE
        =========================================
        */

        $message->update([

            'deleted_for_everyone' => true,

            'message' => null,

            'file' => null,
        ]);

        return response()->json([

            'status' => true,

            'message' =>
                'Deleted for everyone',
        ]);
    }

    /*
    =========================================
    ADD REACTION
    =========================================
    */

    public function react(Request $request)
    {
        $request->validate([

            'message_id' =>
                'required|exists:messages,id',

            'reaction' =>
                'required|string|max:20',
        ]);

        $reaction = MessageReaction::updateOrCreate(

            [

                'message_id' =>
                    $request->message_id,

                'user_id' =>
                    auth()->id(),
            ],

            [

                'reaction' =>
                    $request->reaction,
            ]
        );

        return response()->json([

            'status' => true,

            'reaction' => $reaction,
        ]);
    }

    /*
    =========================================
    SEARCH
    =========================================
    */

    public function search(Request $request)
    {
        $request->validate([

            'search' =>
                'required|string',

            'user_id' =>
                'nullable|exists:users,id',
        ]);

        $messages = Message::where(

                function ($q) {

                    $q->where(
                        'sender_id',
                        auth()->id()
                    )

                    ->orWhere(
                        'receiver_id',
                        auth()->id()
                    );
                }
            )

            /*
            =========================================
            SEARCH INSIDE CONVERSATION
            =========================================
            */

            ->when(

                $request->user_id,

                function ($q) use ($request) {

                    $q->where(

                        function ($query)
                        use ($request) {

                            $query->where(

                                    function ($qq)
                                    use ($request) {

                                        $qq->where(
                                            'sender_id',
                                            auth()->id()
                                        )

                                        ->where(
                                            'receiver_id',
                                            $request->user_id
                                        );
                                    }
                                )

                                ->orWhere(

                                    function ($qq)
                                    use ($request) {

                                        $qq->where(
                                            'sender_id',
                                            $request->user_id
                                        )

                                        ->where(
                                            'receiver_id',
                                            auth()->id()
                                        );
                                    }
                                );
                        }
                    );
                }
            )

            ->where(
                'message',
                'LIKE',
                '%' . $request->search . '%'
            )

            ->with([

                'sender',

                'receiver'
            ])

            ->latest()

            ->paginate(20);

        return response()->json([

            'status' => true,

            'messages' => $messages,
        ]);
    }

    /*
    =========================================
    TYPING
    =========================================
    */

    public function typing(Request $request)
    {
        $request->validate([

            'receiver_id' =>
                'required|exists:users,id',
        ]);

        broadcast(

            new UserTyping(
                auth()->id(),
                $request->receiver_id
            )

        )->toOthers();

        return response()->json([

            'status' => true,
        ]);
    }
}