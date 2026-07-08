<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;

use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

use Illuminate\Foundation\Events\Dispatchable;

use Illuminate\Broadcasting\InteractsWithSockets;

use Illuminate\Queue\SerializesModels;

class UserTyping implements ShouldBroadcastNow
{
    use Dispatchable,
        InteractsWithSockets,
        SerializesModels;

    public $senderId;

    public $receiverId;

    public function __construct(
        $senderId,
        $receiverId
    ) {

        $this->senderId = $senderId;

        $this->receiverId = $receiverId;
    }

    public function broadcastOn(): array
    {
        return [

            new PrivateChannel(
                'chat.' . $this->receiverId
            ),
        ];
    }

    public function broadcastAs(): string
    {
        return 'user.typing';
    }

    public function broadcastWith(): array
    {
        return [

            'sender_id' => $this->senderId,
        ];
    }
}