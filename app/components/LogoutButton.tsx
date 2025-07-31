'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // Redirect to login page after logout
    router.refresh(); // Refresh the page to clear any cached user data
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 font-bold text-destructive-foreground bg-destructive rounded-md hover:bg-destructive/90"
    >
      Logout
    </button>
  );
}
