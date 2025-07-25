import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

const EmailVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resendMessage, setResendMessage] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email for the correct link.');
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await authService.verifyEmail(verificationToken);
      setStatus('success');
      setMessage(response.message);
    } catch (error: unknown) {
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Email verification failed. Please try again.';
      setMessage(errorMessage);
    }
  };

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setResendStatus('loading');
    try {
      const response = await authService.resendVerification({ email });
      setResendStatus('success');
      setResendMessage(response.message);
      setShowResendForm(false);
    } catch (error: unknown) {
      setResendStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification email.';
      setResendMessage(errorMessage);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-lg font-medium">Verifying your email...</p>
            <p className="text-sm text-muted-foreground">Please wait while we verify your email address.</p>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <h2 className="text-2xl font-bold text-green-600">Email Verified Successfully!</h2>
            <p className="text-center text-muted-foreground">{message}</p>
            <div className="flex space-x-4">
              <Button onClick={() => navigate('/login')} className="bg-green-600 hover:bg-green-700">
                Continue to Login
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Go to Home
              </Button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-12 w-12 text-red-600" />
            <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
            <p className="text-center text-muted-foreground">{message}</p>
            
            {!showResendForm ? (
              <div className="flex space-x-4">
                <Button onClick={() => setShowResendForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </Button>
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Back to Login
                </Button>
              </div>
            ) : (
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="text-lg">Resend Verification Email</CardTitle>
                  <CardDescription>
                    Enter your email address to receive a new verification link.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleResendVerification} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    
                    {resendStatus === 'success' && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>{resendMessage}</AlertDescription>
                      </Alert>
                    )}
                    
                    {resendStatus === 'error' && (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>{resendMessage}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button 
                        type="submit" 
                        disabled={resendStatus === 'loading'}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        {resendStatus === 'loading' ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Send Verification Email'
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowResendForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Email Verification</h1>
          <p className="mt-2 text-sm text-gray-600">
            We're verifying your email address to complete your registration.
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerificationPage; 