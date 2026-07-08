<?php

namespace App\Events;

use App\Models\GroupMessage;

use Illuminate\Broadcasting\Channel;

use Illuminate\Queue\SerializesModels;

use Illuminate\Broadcasting\PrivateChannel;

use Illuminate\Foundation\Events\Dispatchable;

use Illuminate\Broadcasting\InteractsWithSockets;

use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class GroupMessageSent implements ShouldBroadcastNow
{
    use Dispatchable,
        InteractsWithSockets,
        SerializesModels;

    public $message;

    public function __construct(GroupMessage $message)
    {
        $this->message = $message;
    }

    /*
    =========================================
    CHANNEL
    =========================================
    */

    public function broadcastOn(): array
    {
        return [

            new PrivateChannel(
                'group.' . $this->message->group_id
            ),
        ];
    }

    /*
    =========================================
    EVENT NAME
    =========================================
    */

    public function broadcastAs(): string
    {
        return 'group.message.sent';
    }

    /*
    =========================================
    DATA
    =========================================
    */

    public function broadcastWith(): array
    {
        return [

            'message' => $this->message
                ->load([
                    'sender',
                    'group'
                ]),
        ];
    }
}