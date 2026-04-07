import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ProfileModal from './ProfileModal';

export default function DashboardHeader() {
  const router = useRouter();

  return (
    <div className="bg-card border-b border-border px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="space-y-1">
        <h2 className="text-xl font-black italic tracking-tight text-foreground uppercase">
          Welcome to Pulse<span className="text-primary italic">AI</span>
        </h2>
        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase">
          Track your progress • Build your streak
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end mr-2">
          <span className="text-xs font-black uppercase text-muted-foreground">My Profile</span>
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Status: Active</span>
        </div>
        <ProfileModal />
      </div>
    </div>
  );
}
