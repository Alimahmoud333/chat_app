<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MessageReaction extends Model
{
    use HasFactory;

    protected $fillable = [

        'message_id',

        'user_id',

        'reaction',
    ];

    /*
    =========================================
    MESSAGE
    =========================================
    */

    public function message()
    {
        return $this->belongsTo(Message::class);
    }

    /*
    =========================================
    USER
    =========================================
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}