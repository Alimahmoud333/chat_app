<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ChatGroup extends Model
{
    use HasFactory;

    protected $fillable = [

        'name',

        'image',

        'admin_id',
    ];

    /*
    =========================================
    GROUP CREATOR
    =========================================
    */

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /*
    =========================================
    MEMBERS
    =========================================
    */

    public function members()
    {
        return $this->belongsToMany(
            User::class,
            'group_members',
            'group_id',
            'user_id'
        )
        ->withPivot('is_admin')
        ->withTimestamps();
    }

    /*
    =========================================
    MEMBERSHIP ROWS
    =========================================
    */

    public function groupMembers()
    {
        return $this->hasMany(GroupMember::class, 'group_id');
    }

    /*
    =========================================
    MESSAGES
    =========================================
    */

    public function messages()
    {
        return $this->hasMany(GroupMessage::class, 'group_id');
    }
}