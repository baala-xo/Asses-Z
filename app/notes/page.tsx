import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { decrypt } from '@/lib/encryption';
import LogoutButton from '../components/LogoutButton';
import CreateNoteForm from '../components/CreateNoteForm';
import NotesList from '../components/NotesList';
import ScribblePad from '../components/ScribblePad';

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

  // --- CHANGE HERE: Add a try-catch block for robust decryption ---
  const processedNotes = notes?.map(note => {
    let content = note.content || '';
    if (note.type === 'text' && note.content) {
      try {
        // Attempt to decrypt only text notes
        content = decrypt(note.content);
      } catch (e) {
        // If decryption fails, log the error and use the raw content
        console.error(`Failed to decrypt note ID ${note.id}:`, e);
        // The content remains the original, un-decrypted content
      }
    }
    return { ...note, content };
  }) || [];

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 bg-background">
      <div className="w-full max-w-4xl">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Notes</h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {user.user_metadata.full_name || user.email}
            </p>
          </div>
          <LogoutButton />
        </header>
        <main>
          <CreateNoteForm />
          <ScribblePad />
          <NotesList notes={processedNotes} />
        </main>
      </div>
    </div>
  );
}
