<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Twilio\Rest\Client;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /*
    =========================================
    REGISTER
    =========================================
    */

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'unique:users,email',
            ],

            'password' => [
                'required',
                'min:6',
                'confirmed',
            ],

            'phone' => [
                'required',
                'string',
                'unique:users,phone',
            ],

            'bio' => [
                'nullable',
                'string',
            ],

            'profile_image' => [
                'nullable',
                'image',
                'max:2048',
            ],

            /*
            Important:
            User is not allowed to choose role from register.
            Admin should be created by seeder or admin panel.
            */

            'role' => [
                'prohibited',
            ],
        ]);

        if ($validator->fails()) {

            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        /*
        =========================================
        UPLOAD PROFILE IMAGE
        =========================================
        */

        $imagePath = null;

        if ($request->hasFile('profile_image')) {

            $imagePath = $request
                ->file('profile_image')
                ->store('profiles', 'public');
        }

        /*
        =========================================
        CREATE USER
        =========================================
        */

        $user = User::create([

            'name' => $request->name,

            'email' => $request->email,

            'password' => Hash::make($request->password),

            'phone' => $request->phone,

            'bio' => $request->bio,

            'profile_image' => $imagePath,

            'role' => 'user',
        ]);

        /*
        =========================================
        SEND OTP USING TWILIO VERIFY
        =========================================
        */

        $twilio = new Client(
            env('TWILIO_SID'),
            env('TWILIO_TOKEN')
        );

        $twilio->verify->v2
            ->services(env('TWILIO_VERIFY_SERVICE'))
            ->verifications
            ->create($user->phone, 'sms');

        /*
        =========================================
        CREATE TOKEN
        =========================================
        */

        $token = $user
            ->createToken('auth_token')
            ->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Registered successfully. Please verify OTP sent via SMS.',
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    /*
    =========================================
    VERIFY OTP
    =========================================
    */

    public function verifyOtp(Request $request)
    {
        $request->validate([

            'phone' => [
                'required',
                'string',
            ],

            'otp' => [
                'required',
                'digits:6',
            ],
        ]);

        $user = User::where('phone', $request->phone)
            ->firstOrFail();

        $twilio = new Client(
            env('TWILIO_SID'),
            env('TWILIO_TOKEN')
        );

        $verification = $twilio->verify->v2
            ->services(env('TWILIO_VERIFY_SERVICE'))
            ->verificationChecks
            ->create([
                'to' => $request->phone,
                'code' => $request->otp,
            ]);

        if ($verification->status !== 'approved') {

            return response()->json([
                'status' => false,
                'message' => 'Invalid or expired OTP',
            ], 422);
        }

        $user->update([
            'phone_verified_at' => now(),
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'status' => true,
            'message' => 'OTP verified successfully',
            'user' => $user,
        ]);
    }

    /*
    =========================================
    RESEND OTP
    =========================================
    */

    public function resendOtp(Request $request)
    {
        $request->validate([

            'phone' => [
                'required',
                'string',
            ],
        ]);

        $user = User::where('phone', $request->phone)
            ->firstOrFail();

        if ($user->phone_verified_at) {

            return response()->json([
                'status' => false,
                'message' => 'Phone number already verified',
            ], 422);
        }

        $twilio = new Client(
            env('TWILIO_SID'),
            env('TWILIO_TOKEN')
        );

        $twilio->verify->v2
            ->services(env('TWILIO_VERIFY_SERVICE'))
            ->verifications
            ->create($user->phone, 'sms');

        return response()->json([
            'status' => true,
            'message' => 'OTP resent via SMS',
        ]);
    }

    /*
    =========================================
    LOGIN
    =========================================
    */

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [

            'email' => [
                'required',
                'email',
            ],

            'password' => [
                'required',
            ],
        ]);

        if ($validator->fails()) {

            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)
            ->first();

        if (
            ! $user ||
            ! Hash::check($request->password, $user->password)
        ) {

            return response()->json([
                'status' => false,
                'message' => 'Invalid credentials',
            ], 401);
        }

        /*
        =========================================
        CHECK BANNED USER
        =========================================
        */

        if ($user->is_banned) {

            return response()->json([
                'status' => false,
                'message' => 'Your account has been banned',
            ], 403);
        }

        /*
        =========================================
        CHECK PHONE VERIFIED
        =========================================
        */

        if (! $user->phone_verified_at) {

            return response()->json([
                'status' => false,
                'message' => 'Please verify your phone number first',
            ], 403);
        }

        /*
        =========================================
        UPDATE ONLINE STATUS
        =========================================
        */

        $user->update([
            'is_online' => true,
        ]);

        $token = $user
            ->createToken('auth_token')
            ->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Logged in successfully',
            'token' => $token,
            'user' => $user,
        ]);
    }

    /*
    =========================================
    FORGOT PASSWORD
    =========================================
    */

    public function forgotPassword(Request $request)
    {
        $request->validate([

            'phone' => [
                'required',
                'string',
            ],
        ]);

        $user = User::where('phone', $request->phone)
            ->firstOrFail();

        $twilio = new Client(
            env('TWILIO_SID'),
            env('TWILIO_TOKEN')
        );

        $twilio->verify->v2
            ->services(env('TWILIO_VERIFY_SERVICE'))
            ->verifications
            ->create($user->phone, 'sms');

        return response()->json([
            'status' => true,
            'message' => 'OTP sent via SMS',
        ]);
    }

    /*
    =========================================
    RESET PASSWORD
    =========================================
    */

    public function resetPassword(Request $request)
    {
        $request->validate([

            'phone' => [
                'required',
                'string',
            ],

            'otp' => [
                'required',
                'digits:6',
            ],

            'password' => [
                'required',
                'min:6',
                'confirmed',
            ],
        ]);

        $user = User::where('phone', $request->phone)
            ->firstOrFail();

        $twilio = new Client(
            env('TWILIO_SID'),
            env('TWILIO_TOKEN')
        );

        $verification = $twilio->verify->v2
            ->services(env('TWILIO_VERIFY_SERVICE'))
            ->verificationChecks
            ->create([
                'to' => $request->phone,
                'code' => $request->otp,
            ]);

        if ($verification->status !== 'approved') {

            return response()->json([
                'status' => false,
                'message' => 'Invalid or expired OTP',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Password reset successfully',
        ]);
    }

    /*
    =========================================
    CHANGE PASSWORD
    =========================================
    */

    public function changePassword(Request $request)
    {
        $request->validate([

            'current_password' => [
                'required',
            ],

            'new_password' => [
                'required',
                'min:6',
                'confirmed',
            ],
        ]);

        $user = auth()->user();

        if (! Hash::check($request->current_password, $user->password)) {

            return response()->json([
                'status' => false,
                'message' => 'Current password is incorrect',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Password changed successfully',
        ]);
    }

    /*
    =========================================
    LOGOUT
    =========================================
    */

    public function logout(Request $request)
    {
        $request->user()
            ->currentAccessToken()
            ->delete();

        $request->user()->update([
            'is_online' => false,
            'last_seen' => now(),
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    /*
    =========================================
    PROFILE
    =========================================
    */

    public function profile(Request $request)
    {
        return response()->json([
            'status' => true,
            'user' => $request->user(),
        ]);
    }

    /*
    =========================================
    UPDATE PROFILE
    =========================================
    */

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [

            'name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'unique:users,phone,' . $user->id,
            ],

            'bio' => [
                'nullable',
                'string',
            ],

            'profile_image' => [
                'nullable',
                'image',
                'max:2048',
            ],
        ]);

        if ($validator->fails()) {

            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        /*
        =========================================
        UPDATE PROFILE IMAGE
        =========================================
        */

        if ($request->hasFile('profile_image')) {

            if ($user->profile_image) {

                Storage::disk('public')
                    ->delete($user->profile_image);
            }

            $imagePath = $request
                ->file('profile_image')
                ->store('profiles', 'public');

            $user->profile_image = $imagePath;
        }

        /*
        =========================================
        IF PHONE CHANGED, REQUIRE VERIFICATION AGAIN
        =========================================
        */

        if (
            $request->filled('phone') &&
            $request->phone !== $user->phone
        ) {

            $user->phone = $request->phone;

            $user->phone_verified_at = null;
        }

        if ($request->filled('name')) {
            $user->name = $request->name;
        }

        if ($request->has('bio')) {
            $user->bio = $request->bio;
        }

        $user->save();

        return response()->json([
            'status' => true,
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    /*
    =========================================
    SAVE FCM TOKEN
    =========================================
    */

    public function saveFcmToken(Request $request)
    {
        $request->validate([

            'fcm_token' => [
                'required',
                'string',
            ],
        ]);

        auth()->user()->update([
            'fcm_token' => $request->fcm_token,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'FCM token saved successfully',
        ]);
    }
}