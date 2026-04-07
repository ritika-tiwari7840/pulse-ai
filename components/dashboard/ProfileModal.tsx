'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Activity, Target, Utensils, HeartPulse, Scale, Ruler } from 'lucide-react';
import { OnboardingData } from '@/context/OnboardingContext';

export default function ProfileModal() {
  const [profile, setProfile] = useState<Partial<OnboardingData> | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('pulseai_survey');
    if (savedData) {
      try {
        setProfile(JSON.parse(savedData));
      } catch (err) {
        console.error('Failed to parse profile data', err);
      }
    }
  }, []);

  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-primary/20 hover:border-primary/50 transition-all p-0 focus:ring-0">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary font-black italic">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border shadow-2xl overflow-hidden">
        {!profile ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">No Profile Found</h3>
              <p className="text-muted-foreground text-sm px-6">
                You skipped the onboarding process. Complete the form to see your personalized metrics here.
              </p>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black italic tracking-tight flex items-center gap-2">
                <User className="w-6 h-6 text-primary" />
                USER PROFILE
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-6 space-y-6">
              {/* Header Info */}
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarFallback className="text-2xl font-black bg-background italic">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold text-foreground leading-tight">
                    {profile.name || 'Anonymous User'}
                  </h3>
                  <p className="text-muted-foreground font-medium text-sm">
                    {profile.age || '??'} years old
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Height & Weight */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm font-bold">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Ruler className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase text-[10px] tracking-widest">Height</p>
                      <p className="text-foreground">{profile.height || '--'} cm</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm font-bold">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase text-[10px] tracking-widest">Weight</p>
                      <p className="text-foreground">{profile.weight || '--'} kg</p>
                    </div>
                  </div>
                </div>

                {/* Target & Activity */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm font-bold">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase text-[10px] tracking-widest">Target</p>
                      <p className="text-foreground">{profile.targetWeight || '--'} kg</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm font-bold">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase text-[10px] tracking-widest">Level</p>
                      <p className="text-foreground capitalize">{profile.activityLevel?.replace('_', ' ') || '--'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                 {/* Goals */}
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-muted-foreground">
                      <Target className="w-3 h-3" /> Fitness Goals
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.fitnessGoals?.length ? profile.fitnessGoals.map((goal, i) => (
                        <Badge key={i} variant="secondary" className="font-bold uppercase text-[10px] bg-primary/5 border-primary/20">
                          {goal.replace('_', ' ')}
                        </Badge>
                      )) : <span className="text-xs text-muted-foreground italic">None specified</span>}
                    </div>
                 </div>

                 {/* Diet */}
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-muted-foreground">
                      <Utensils className="w-3 h-3" /> Dietary Preferences
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {profile.dietaryPreferences?.length ? profile.dietaryPreferences.map((diet, i) => (
                        <Badge key={i} variant="outline" className="font-bold border-2">
                          {diet}
                        </Badge>
                      )) : <span className="text-xs text-muted-foreground italic">None specified</span>}
                    </div>
                 </div>

                 {/* Health Issues */}
                 {profile.healthIssues && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-muted-foreground">
                        <HeartPulse className="w-3 h-3 text-destructive" /> Health Considerations
                      </div>
                      <p className="text-sm font-medium text-foreground bg-destructive/5 p-3 rounded-xl border border-destructive/20">
                        {profile.healthIssues}
                      </p>
                    </div>
                 )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
