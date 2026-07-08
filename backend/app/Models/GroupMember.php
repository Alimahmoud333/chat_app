<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GroupMember extends Model
{
    use HasFactory;

    protected $fillable = [

        'group_id',

        'user_id',

        'is_admin',
    ];

    protected $casts = [

        'is_admin' => 'boolean',
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
    USER
    =========================================
    */

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}