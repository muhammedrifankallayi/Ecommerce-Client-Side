import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const otpSchema = z.object({
  otp: z.string().min(6, 'Please enter the complete 6-digit code').max(6, 'OTP must be exactly 6 digits'),
});

type OTPForm = z.infer<typeof otpSchema>;

const OTPPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [countdown, setCountdown] = React.useState(60);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Countdown timer for resend button
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = async (data: OTPForm) => {
    setIsLoading(true);
    try {
      // Simulate OTP verification API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Verification successful!",
        description: "Your account has been verified successfully.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      // Simulate resend OTP API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "OTP sent!",
        description: "A new verification code has been sent to your email.",
      });
      setCountdown(60);
    } catch (error) {
      toast({
        title: "Failed to resend",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4">
      <div className="w-full max-w-md">
        <Card className="glass-card backdrop-blur-lg border-white/20 shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold gradient-text">Verify Your Email</CardTitle>
            <CardDescription className="text-muted-foreground">
              We've sent a 6-digit verification code to your email address. Please enter it below to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-center block">Enter verification code</FormLabel>
                      <FormControl>
                        <div className="flex justify-center">
                          <InputOTP
                            maxLength={6}
                            value={field.value}
                            onChange={field.onChange}
                            className="gap-2"
                          >
                            <InputOTPGroup className="gap-2">
                              <InputOTPSlot index={0} className="w-12 h-12 text-lg font-semibold" />
                              <InputOTPSlot index={1} className="w-12 h-12 text-lg font-semibold" />
                              <InputOTPSlot index={2} className="w-12 h-12 text-lg font-semibold" />
                              <InputOTPSlot index={3} className="w-12 h-12 text-lg font-semibold" />
                              <InputOTPSlot index={4} className="w-12 h-12 text-lg font-semibold" />
                              <InputOTPSlot index={5} className="w-12 h-12 text-lg font-semibold" />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      <FormMessage className="text-center" />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading || form.watch('otp').length !== 6}
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </form>
            </Form>

            {/* Resend OTP Section */}
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              
              {countdown > 0 ? (
                <p className="text-sm text-muted-foreground">
                  You can resend the code in {countdown}s
                </p>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="flex items-center gap-2"
                >
                  {isResending ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {isResending ? "Sending..." : "Resend Code"}
                </Button>
              )}
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OTPPage;