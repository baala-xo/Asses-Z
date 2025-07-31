'use client';

import { createClient } from '@/lib/supabase/client';

export function AuthForm() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full px-4 py-2 font-bold rounded-md text-primary-foreground bg-primary hover:bg-primary/90"
    >
      Sign In with Google
    </button>
  );
}
