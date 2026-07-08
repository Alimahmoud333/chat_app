<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ChatSetting extends Model
{
    use HasFactory;

    protected $fillable = [

        'user_id',

        'target_user_id',

        'is_pinned',

        'is_archived',

        'is_muted',

        'is_blocked',
    ];

    protected $casts = [

        'is_pinned' => 'boolean',

        'is_archived' => 'boolean',

        'is_muted' => 'boolean',

        'is_blocked' => 'boolean',
    ];

    /*
    =========================================
    OWNER USER
    =========================================
    */

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /*
    =========================================
    TARGET USER
    =========================================
    */

    public function targetUser()
    {
        return $this->belongsTo(User::class, 'target_user_id');
    }
}