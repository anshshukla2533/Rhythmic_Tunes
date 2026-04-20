import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Music2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Auth() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { document.title = 'Sign in — RhythmicTunes'; }, []);
  useEffect(() => { if (user) nav('/'); }, [user, nav]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (tab === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: name || email.split('@')[0] },
          },
        });
        if (error) throw error;
        toast({ title: 'Account created', description: 'You are signed in.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: 'Welcome back!' });
      }
      nav('/');
    } catch (err: any) {
      toast({ title: 'Authentication error', description: err.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <Music2 className="size-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold">RhythmicTunes</span>
        </Link>

        <div className="glass-card rounded-3xl p-8">
          <h1 className="font-display text-2xl font-bold text-center">
            {tab === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-muted-foreground text-center mt-1 mb-6">
            {tab === 'signin' ? 'Sign in to keep listening.' : 'Start building your library today.'}
          </p>

          <Tabs value={tab} onValueChange={(v: any) => setTab(v)}>
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <form onSubmit={onSubmit} className="space-y-4">
              <TabsContent value="signup" className="m-0 space-y-4">
                <Input placeholder="Display name" value={name} onChange={e => setName(e.target.value)} />
              </TabsContent>
              <Input type="email" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
              <Input type="password" placeholder="Password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} autoComplete={tab === 'signin' ? 'current-password' : 'new-password'} />
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
                {busy ? '…' : tab === 'signin' ? 'Sign in' : 'Create account'}
              </Button>
            </form>
          </Tabs>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-foreground underline">Continue browsing without signing in</Link>
        </p>
      </div>
    </div>
  );
}
