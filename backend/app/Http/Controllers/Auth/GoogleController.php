<?php


// app/Http/Controllers/Auth/GoogleController.php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function handleGoogleLogin(Request $request)
    {
        $token = $request->input('token');

        try {
            $user = Socialite::driver('google')->stateless()->userFromToken($token);

            // Handle user data and authentication

            return response()->json(['success' => true, 'message' => 'Login successful']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Login failed'], 400);
        }
    }
}
















// namespace App\Http\Controllers\Auth;

// use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
// use Socialite;
// use Auth;

// class GoogleController extends Controller
// {
//     public function redirectToGoogle(){
//         return Socialite::driver('google')->redirect();
//     }

//     public function handleGoogleCallback(){
//         $user = Socialite::driver('google')->user();
//         return response()->json([
//             'id' => $user->getId(),
//             'name' => $user->getName(),
//             'email' => $user->getEmail(),
//             'token' => $user->token,
//             'avatar' => $user->getAvatar(),
//         ]); 
//     }
// }
