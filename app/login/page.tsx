'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, ArrowRight, UserPlus, LogIn, CheckCircle2, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authState, setAuthState] = useState<'initial' | 'signup' | 'login'>('initial');
  const [isPhoneView, setIsPhoneView] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const state = searchParams.get('state') as 'signup' | 'login';
    if (state === 'signup' || state === 'login') {
      setAuthState(state);
    }
  }, [searchParams]);

  const handleAuth = async (method: 'google' | 'phone') => {
    setIsLoading(true);
    const signup = authState === 'signup';
    
    // Simulate auth action
    setTimeout(() => {
      const type = method === 'google' ? 'google' : 'phone';
      localStorage.setItem('pulseai_user_token', `mock_${type}_token`);
      
      const message = signup ? 'Account created successfully!' : 'Logged in successfully!';
      toast.success(message);

      if (signup) {
        router.push('/onboarding');
      } else {
        const onboarded = localStorage.getItem('pulseai_onboarding_complete');
        if (onboarded) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      }
      setIsLoading(false);
    }, 1200);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast.error('Please enter a phone number');
      return;
    }
    handleAuth('phone');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background font-sans overflow-hidden">
      {/* Left Column: Branding & Features */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-[#0a0a0a] p-12 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 opacity-50" />
        
        <div className="relative z-10 max-w-md space-y-10 animate-in fade-in slide-in-from-left-10 duration-1000">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-3xl font-black text-white italic">P</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter italic">PulseAI</h1>
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl font-bold leading-[1.1] tracking-tight">
              Achieve Your <span className="text-primary italic">Potential</span>.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed font-medium">
              Join our community of athletes and health enthusiasts today.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            {[
              "AI Form Correction",
              "Smart Meal Plans",
              "Progress Tracking",
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-semibold">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Auth UI */}
      <div className="flex items-center justify-center p-6 bg-white dark:bg-zinc-950">
        <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in-95 duration-500">
          
          <div className="text-center space-y-4">
             {authState !== 'initial' && (
               <button 
                onClick={() => { setAuthState('initial'); setIsPhoneView(false); }}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors font-bold mb-4"
               >
                 <ChevronLeft className="w-4 h-4" /> Back
               </button>
             )}
            <h3 className="text-4xl font-black tracking-tight text-foreground uppercase">
              {authState === 'initial' ? 'Get Started' : authState === 'signup' ? 'Sign Up' : 'Login'}
            </h3>
            <p className="text-muted-foreground font-bold tracking-tight">
              {authState === 'initial' 
                ? 'Choose how you want to join PulseAI' 
                : `Continue to your PulseAI ${authState === 'signup' ? 'profile' : 'account'}`}
            </p>
          </div>

          <div className="space-y-6">
            {authState === 'initial' ? (
              <div className="grid gap-6 animate-in slide-in-from-bottom-5 duration-500">
                <Button 
                  size="lg"
                  onClick={() => setAuthState('signup')}
                  className="w-full h-16 text-lg font-black group bg-primary hover:bg-primary/90 shadow-xl"
                >
                  <UserPlus className="w-6 h-6 mr-3" />
                  SIGN UP
                  <ArrowRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                </Button>

                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => setAuthState('login')}
                  className="w-full h-16 text-lg font-black group border-4 border-foreground hover:bg-foreground hover:text-white transition-all shadow-lg"
                >
                  <LogIn className="w-6 h-6 mr-3" />
                  LOG IN
                </Button>
              </div>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-right-10 duration-500">
                {!isPhoneView ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full h-14 text-base font-black border-2 hover:bg-zinc-50 transition-all flex items-center justify-center gap-3 bg-white dark:bg-zinc-900 shadow-sm"
                      onClick={() => handleAuth('google')}
                      disabled={isLoading}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      CONTINUE WITH GOOGLE
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full h-14 text-base font-black border-2 hover:bg-zinc-50 transition-all flex items-center justify-center gap-3 bg-white dark:bg-zinc-900 shadow-sm"
                      onClick={() => setIsPhoneView(true)}
                      disabled={isLoading}
                    >
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      CONTINUE WITH PHONE
                    </Button>

                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/80" />
                      </div>
                      <div className="relative flex justify-center text-xs font-black uppercase">
                        <span className="bg-white dark:bg-zinc-950 px-2 text-muted-foreground">SECURE</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handlePhoneSubmit} className="space-y-5 animate-in slide-in-from-bottom-5 duration-500">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-black uppercase">Phone Number</Label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">+1</div>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="000 000 0000"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="h-14 pl-12 font-bold border-2 focus:ring-primary shadow-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsPhoneView(false)}
                        className="flex-shrink-0 font-bold"
                        disabled={isLoading}
                      >
                        Back
                      </Button>
                      <Button type="submit" className="w-full h-12 font-black shadow-xl" disabled={isLoading}>
                        {isLoading ? 'Processing...' : (authState === 'signup' ? 'SIGN UP' : 'LOG IN')}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
