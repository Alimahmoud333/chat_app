<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;

    protected $fillable = [

        'name',

        'email',

        'email_verified_at',

        'password',

        'profile_image',

        'bio',

        'phone',

        'phone_verified_at',

        'role',

        'is_online',

        'last_seen',

        'is_banned',

        'fcm_token',
    ];

    protected $hidden = [

        'password',

        'remember_token',

        'fcm_token',
    ];

    protected function casts(): array
    {
        return [

            'email_verified_at' => 'datetime',

            'phone_verified_at' => 'datetime',

            'last_seen' => 'datetime',

            'password' => 'hashed',

            'is_online' => 'boolean',

            'is_banned' => 'boolean',
        ];
    }

    /*
    =========================================
    SENT PRIVATE MESSAGES
    =========================================
    */

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    /*
    =========================================
    RECEIVED PRIVATE MESSAGES
    =========================================
    */

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    /*
    =========================================
    GROUPS CREATED BY USER
    =========================================
    */

    public function createdGroups()
    {
        return $this->hasMany(ChatGroup::class, 'admin_id');
    }

    /*
    =========================================
    GROUP MEMBERSHIPS
    =========================================
    */

    public function groupMemberships()
    {
        return $this->hasMany(GroupMember::class);
    }

    /*
    =========================================
    MESSAGE REACTIONS
    =========================================
    */

    public function reactions()
    {
        return $this->hasMany(MessageReaction::class);
    }

    /*
    =========================================
    NOTIFICATIONS
    =========================================
    */

    public function notifications()
    {
        return $this->hasMany(UserNotification::class);
    }
}