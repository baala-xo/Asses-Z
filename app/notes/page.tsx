import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { decrypt } from '@/lib/encryption';
import LogoutButton from '../components/LogoutButton';
import NotesList from '../components/NotesList';
import NoteCreationTabs from '../components/NoteCreationTabs'; // 1. Import the new component

export const dynamic = 'force-dynamic';

export default async function NotesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }

  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });

  const processedNotes = notes?.map(note => {
    let content = note.content || '';
    if (note.type === 'text' && note.content) {
      try {
        content = decrypt(note.content);
      } catch (e) {
        console.error(`Failed to decrypt note ID ${note.id}:`, e);
      }
    }
    return { ...note, content };
  }) || [];

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 bg-background">
      <div className="w-full max-w-4xl">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">note - Z</h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {user.user_metadata.full_name || user.email} 💜
            </p>
          </div>
          <LogoutButton />
        </header>
        <main>
          {/* 2. Replace the old forms with the new tab component */}
          <NoteCreationTabs />
          <NotesList notes={processedNotes} />
        </main>
      </div>
    </div>
  );
}
