<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [

        'sender_id',

        'receiver_id',

        'message',

        'type',

        'file',

        'latitude',

        'longitude',

        'is_seen',

        'seen_at',

        'is_delivered',

        'delivered_at',

        'reply_to',

        'is_forwarded',

        'deleted_for_everyone',
    ];

    protected $casts = [

        'is_seen' => 'boolean',

        'seen_at' => 'datetime',

        'is_delivered' => 'boolean',

        'delivered_at' => 'datetime',

        'is_forwarded' => 'boolean',

        'deleted_for_everyone' => 'boolean',
    ];

    /*
    =========================================
    SENDER
    =========================================
    */

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /*
    =========================================
    RECEIVER
    =========================================
    */

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    /*
    =========================================
    REPLY MESSAGE
    =========================================
    */

    public function replyMessage()
    {
        return $this->belongsTo(Message::class, 'reply_to');
    }

    /*
    =========================================
    REACTIONS
    =========================================
    */

    public function reactions()
    {
        return $this->hasMany(MessageReaction::class);
    }
}