import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { decrypt } from '@/lib/encryption';
import { Database } from '@/lib/database.types';

// This tells Next.js to render pages on demand
export const dynamic = 'force-dynamic';

// --- CHANGE HERE: Use a more robust type definition for Page Props ---
type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function PublicNotePage({ params }: Props) {
  // Create a generic Supabase client for unauthenticated access
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch the note by its ID
  // RLS Policy: This will only return a note if 'is_public' is true.
  const { data: note } = await supabase
    .from('notes')
    .select('*')
    .eq('id', params.id)
    .eq('is_public', true) // Explicitly check for public status
    .single();

  // If the note doesn't exist or isn't public, show a 404 page
  if (!note) {
    notFound();
  }

  // Decrypt the content before displaying it
  const decryptedContent = note.content ? decrypt(note.content) : '';

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 py-12">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">{note.title}</h1>
        <p className="mb-6 text-sm text-gray-500">
          Published on: {new Date(note.created_at).toLocaleDateString()}
        </p>
        <div className="prose max-w-none">
            {/* Using a div with whitespace-pre-wrap to render content with formatting */}
            <div className="whitespace-pre-wrap text-gray-800">{decryptedContent}</div>
        </div>
      </div>
    </div>
  );
}
