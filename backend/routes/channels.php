<?php

use App\Models\GroupMember;
use Illuminate\Support\Facades\Broadcast;

/*
=========================================
PRIVATE CHAT
=========================================
*/

Broadcast::channel('chat.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

/*
=========================================
GROUP CHAT
=========================================
*/

Broadcast::channel('group.{groupId}', function ($user, $groupId) {

    return GroupMember::where('group_id', $groupId)
        ->where('user_id', $user->id)
        ->exists();
});