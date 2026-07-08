<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GroupMessage extends Model
{
    use HasFactory;

    protected $fillable = [

        'group_id',

        'sender_id',

        'message',

        'type',

        'file',

        'latitude',

        'longitude',
    ];

    /*
    =========================================
    GROUP
    =========================================
    */

    public function group()
    {
        return $this->belongsTo(ChatGroup::class, 'group_id');
    }

    /*
    =========================================
    SENDER
    =========================================
    */

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}