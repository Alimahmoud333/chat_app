<?php

namespace App\Events;

use App\Models\Message;

use Illuminate\Broadcasting\Channel;

use Illuminate\Queue\SerializesModels;

use Illuminate\Broadcasting\PrivateChannel;

use Illuminate\Foundation\Events\Dispatchable;

use Illuminate\Broadcasting\InteractsWithSockets;

use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class PrivateMessageSent implements ShouldBroadcastNow
{
    use Dispatchable,
        InteractsWithSockets,
        SerializesModels;

    public $message;

    public function __construct(Message $message)
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
                'chat.' . $this->message->receiver_id
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
        return 'private.message.sent';
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
                    'receiver'
                ]),
        ];
    }
}