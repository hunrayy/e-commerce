<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    //
    //function to generate a random 6 digit code
    private function generateVerificationCode(){
        return rand(100000, 999999);
    }

    //function to create a JWT token
    private function createToken($payload, $expiresIn){
        $key = env('JWT_SECRET');
        $payload['exp'] = time() + $expiresIn; // Token expiration time in seconds

        return JWT::encode($payload, $key, 'HS256');
    }

    //function to send email verification code
    public function sendEmailVerificationCode(Request $request){
        $email = $request->email;
        $verificationCode = $this->generateVerificationCode();

        //use PHPMailer to send the email
        $mail = new PHPMailer(true);

        try{
            // Server settings
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = env('MAIL_USERNAME');
            $mail->Password = env('MAIL_PASSWORD');
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;

            // Recipients
            $mail->setFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
            $mail->addAddress($email);

            // Content
            $mail->isHTML(true);
            $mail->Subject = 'Email Verification Code';
            $mail->Body = '<h4>Your Email Verification code is ' . $verificationCode . '</h4>';

            $mail->send();

            // Hash the generated code using JWT and send it as the response
            $hashedCode = $this->createToken(['code' => $verificationCode], 300); // Token expires in 5 minutes
            // Return the response
            return response()->json([
                'code' => 'success',
                'message' => 'Email verification code sent successfully',
                'verificationCode' => $hashedCode,
                'generatedToken' => $this->createToken(['email' => $email, 'verificationCode' => $verificationCode], 300),
            ]);
            
        }catch (Exception $e) {
            return response()->json([
                'code' => 'error',
                'message' => 'An error occurred while sending the verification code',
                'reason' => $mail->ErrorInfo
            ]);
        }

    }

    //function to verify the code sent
    public function verifyEmailVerificationCode(Request $request){
        //validation rules
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'verificationCode' => 'required|string',
            'verificationCodeFromCookie' => 'required|string'
        ]);
        if($validator->fails()){
            return response()->json([
                'code' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 400);
        }
        $email = $request->input('email');
        $verificationCode = $request->input('verificationCode');
        $authHeader = $request->header('Authorization');
        if ($authHeader) {
            // Split the header to extract the token
            list($bearer, $verificationCodeFromCookie) = explode(' ', $authHeader);
    
            // Check if the header starts with 'Bearer'
            if (strcasecmp($bearer, 'Bearer') === 0) {
                // Perform action with the token token extracted
                try{
                    //verify the token (JWT)
                    $decoded = JWT::decode($verificationCodeFromCookie, env('JWT_SECRET'), ['HS256']);
                    $decodedArray = (array)$decoded;
        
                    if($decodedArray['code'] === $verificationCode){
                        //if the verification code matches, create a new token
                        $payload = ['email' => $email];
                        $createAccountToken = $this->createToken($payload, 20 * 60); // 20 minutes
        
                        return response()->json([
                            'code' => 'success',
                            'message' => 'Email Successfully verified, proceed to register',
                            'createAccountToken' => $createAccountToken
                        ]);
        
                    }else{
                        return response()->json([
                            'code' => 'error',
                            'message' => 'Invalid verification code'
                        ]);
                    }
                }catch(ExpiredException $e){
                    return response()->json([
                        'code' => 'error',
                        'message' => 'Verification code has expired',
                        'reason' => $e->getMessage()
                    ]);
                }catch (\Exception $e) {
                    return response()->json([
                        'code' => 'error',
                        'message' => 'An error occurred while verifying token',
                        'reason' => $e->getMessage()
                    ], 500);
                }
            } else {
                return response()->json([
                    'code' => 'error',
                    'message' => 'Authorization type must be Bearer',
                ], 400);
            }
        } else {
            return response()->json([
                'code' => 'error',
                'message' => 'Authorization header not provided',
            ], 400);
        }
        



    }
}
