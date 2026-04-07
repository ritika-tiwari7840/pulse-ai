'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserPlus, LogIn, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('pulseai_user_token');
    const onboarded = localStorage.getItem('pulseai_onboarding_complete');
    
    if (token && onboarded) {
      router.replace('/dashboard');
    } else {
      setIsReady(true);
    }
  }, [router]);

  if (!isReady) return null;

  return (
    <div className="min-h-screen bg-background font-sans overflow-hidden flex flex-col items-center justify-center p-6 text-center relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-3xl space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Logo Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-[2rem] flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
            <span className="text-4xl font-black text-white italic">P</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter italic text-foreground">
            Pulse<span className="text-primary italic">AI</span>
          </h1>
          <p className="text-muted-foreground text-xl font-medium tracking-tight uppercase">
            Your Personal AI Fitness Revolution
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-muted-foreground/80">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            AI FORM ANALYSIS
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            SMART MEAL PLANS
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            LIVE COACHING
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid sm:grid-cols-2 gap-6 w-full max-w-lg mx-auto">
          <Button 
            size="lg"
            onClick={() => router.push('/login?state=signup')}
            className="h-20 text-xl font-black group bg-primary hover:bg-primary/90 shadow-[0_20px_50px_rgba(255,100,0,0.2)] rounded-2xl border-none transition-all active:scale-95"
          >
            <UserPlus className="w-6 h-6 mr-3" />
            SIGN UP
            <ArrowRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
          </Button>

          <Button 
            size="lg"
            variant="outline"
            onClick={() => router.push('/login?state=login')}
            className="h-20 text-xl font-black group border-4 border-foreground hover:bg-foreground hover:text-white rounded-2xl transition-all active:scale-95 shadow-xl"
          >
            <LogIn className="w-6 h-6 mr-3" />
            LOG IN
          </Button>
        </div>

        <p className="text-muted-foreground text-sm font-semibold max-w-sm mx-auto leading-relaxed">
          The only app you need to transform your body and track every milestone with AI precision.
        </p>
      </div>

      <footer className="absolute bottom-8 text-xs font-bold text-muted-foreground tracking-widest uppercase">
        © 2024 PulseAI Technologies
      </footer>
    </div>
  );
}