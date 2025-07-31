import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { decrypt } from '@/lib/encryption';
import LogoutButton from '../components/LogoutButton';
import CreateNoteForm from '../components/CreateNoteForm';
import NotesList from '../components/NotesList';

// This tells Next.js to always render this page dynamically
export const dynamic = 'force-dynamic';

export default async function NotesPage() {
  const supabase = createClient();

  // 1. Check for active user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // If no user, redirect to the login page
    return redirect('/login');
  }

  // 2. Fetch all notes for the user from the database
  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });

  // 3. Decrypt the content of each note securely on the server
  const decryptedNotes = notes?.map(note => ({
    ...note,
    content: note.content ? decrypt(note.content) : '',
  })) || [];

  // 4. Render the page structure using our theme variables
  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 bg-background">
      <div className="w-full max-w-4xl">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Notes</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user.user_metadata.full_name || user.email}</p>
          </div>
          <LogoutButton />
        </header>
        <main>
          <CreateNoteForm />
          <NotesList notes={decryptedNotes} />
        </main>
      </div>
    </div>
  );
}
