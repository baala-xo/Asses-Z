// app/notes/[id]/edit/page.tsx

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import EditNoteForm from './edit-form';
import { decrypt } from '@/lib/encryption'; // Import decrypt

export const dynamic = 'force-dynamic';

export default async function EditNotePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: note } = await supabase.from('notes').select('*').eq('id', params.id).single();

  if (!note) {
    notFound();
  }

  // Decrypt the content before passing it to the form
  const decryptedNote = {
    ...note,
    content: note.content ? decrypt(note.content) : '',
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <div className="w-full max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold">Edit Note</h1>
        <EditNoteForm note={decryptedNote} />
      </div>
    </div>
  );
}