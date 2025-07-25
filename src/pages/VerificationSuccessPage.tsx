import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';

const VerificationSuccessPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email') || 'your email';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="glass-card backdrop-blur-lg border-white/20 shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold gradient-text">Account Created Successfully!</CardTitle>
            <CardDescription className="text-muted-foreground">
              We've sent a verification email to complete your registration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Verification email sent to:</span>
              </div>
              <p className="font-medium text-foreground">{email}</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-blue-900">Next Steps:</h3>
                <ol className="text-sm text-blue-800 space-y-2 text-left">
                  <li className="flex items-start space-x-2">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>Check your email inbox (and spam folder)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>Click the verification link in the email</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>Return here to log in to your account</span>
                  </li>
                </ol>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => window.location.href = '/login'} 
                className="w-full bg-primary hover:bg-primary/90"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Continue to Login
              </Button>
              
              <div className="text-center">
                <Link 
                  to="/resend-verification" 
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Didn't receive the email? Resend verification
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Already have an account?
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/login'}
                  className="w-full"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Having trouble? Check your spam folder or contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationSuccessPage; 