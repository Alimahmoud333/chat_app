<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;

class FirebaseNotificationService
{
    protected $messaging;

    public function __construct()
    {
        $factory = (new Factory)
            ->withServiceAccount(
                config('firebase.credentials.file')
            );

        $this->messaging = $factory->createMessaging();
    }

    public function send($token, $title, $body, $data = [])
    {
        if (!$token) {
            return false;
        }

        try {

            $message = CloudMessage::withTarget('token', $token)
                ->withNotification(
                    Notification::create($title, $body)
                )
                ->withData($data);

            return $this->messaging->send($message);

        } catch (\Exception $e) {

            \Log::error('FCM Error: ' . $e->getMessage());

            return false;
        }
    }
}