<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Message;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Events\PrivateMessageSent;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use OpenAI\Laravel\Facades\OpenAI;

class AiChatController extends Controller
{
    /*
    =========================================
    AI CHAT
    =========================================
    */

    public function ask(Request $request)
    {
        /*
        =========================================
        VALIDATION
        =========================================
        */

        $request->validate([

            'message' => [
                'required',
                'string',
                'max:2000',
            ],
        ]);

        /*
        =========================================
        CREATE OR GET AI USER
        =========================================
        */

        $aiUser = User::firstOrCreate(
            [
                'email' => 'ai@chat.com',
            ],
            [
                'name' => 'AI Assistant',

                'password' => Hash::make(
                    Str::random(32)
                ),

                'phone' => 'ai-' . time(),

                'phone_verified_at' => now(),

                'email_verified_at' => now(),

                'role' => 'user',

                'is_online' => true,
            ]
        );

        /*
        =========================================
        SAVE USER MESSAGE
        =========================================
        */

        $userMessage = Message::create([

            'sender_id' => auth()->id(),

            'receiver_id' => $aiUser->id,

            'message' => $request->message,

            'type' => 'text',

            'is_seen' => true,

            'seen_at' => now(),

            'is_delivered' => true,

            'delivered_at' => now(),
        ]);

        /*
        =========================================
        OPENAI RESPONSE
        =========================================
        */

        try {

            $response = OpenAI::chat()->create([

                'model' => 'gpt-4.1-mini',

                'messages' => [

                    [
                        'role' => 'system',
                        'content' => 'You are a helpful AI assistant inside a chat app. Keep answers short, clear, and useful.',
                    ],

                    [
                        'role' => 'user',
                        'content' => $request->message,
                    ],
                ],

                'max_tokens' => 300,

                'temperature' => 0.7,
            ]);

            $aiReply = $response
                ->choices[0]
                ->message
                ->content;

        } catch (\Exception $e) {

            /*
            =========================================
            SAVE FALLBACK AI MESSAGE
            =========================================
            */

            $aiReply = 'AI service is currently unavailable. Please check OpenAI API key, billing, quota, or model name.';

            $aiMessage = Message::create([

                'sender_id' => $aiUser->id,

                'receiver_id' => auth()->id(),

                'message' => $aiReply,

                'type' => 'text',

                'is_seen' => false,

                'is_delivered' => true,

                'delivered_at' => now(),
            ]);

            return response()->json([

                'status' => false,

                'message' => 'AI service error',

                'reply' => $aiReply,

                'error' => $e->getMessage(),

                'user_message' => $userMessage->load([
                    'sender',
                    'receiver',
                ]),

                'ai_message' => $aiMessage->load([
                    'sender',
                    'receiver',
                ]),
            ], 500);
        }

        /*
        =========================================
        SAVE AI REPLY
        =========================================
        */

        $aiMessage = Message::create([

            'sender_id' => $aiUser->id,

            'receiver_id' => auth()->id(),

            'message' => $aiReply,

            'type' => 'text',

            'is_seen' => false,

            'is_delivered' => true,

            'delivered_at' => now(),
        ]);

        /*
        =========================================
        BROADCAST REALTIME MESSAGE
        =========================================
        */

        broadcast(
            new PrivateMessageSent($aiMessage)
        )->toOthers();

        /*
        =========================================
        RESPONSE
        =========================================
        */

        return response()->json([

            'status' => true,

            'message' => 'AI reply generated successfully',

            'reply' => $aiReply,

            'user_message' => $userMessage->load([
                'sender',
                'receiver',
            ]),

            'ai_message' => $aiMessage->load([
                'sender',
                'receiver',
            ]),
        ]);
    }
}
