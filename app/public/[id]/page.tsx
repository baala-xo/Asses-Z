import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { decrypt } from '@/lib/encryption';
import { Database } from '@/lib/database.types';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function PublicNotePage({ params }: Props) {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: note } = await supabase
    .from('notes')
    .select('*')
    .eq('id', params.id)
    .eq('is_public', true)
    .single();

  if (!note) {
    notFound();
  }

  // --- CHANGE HERE: Robustly process content based on type ---
  let finalContent = note.content || '';
  if (note.type === 'text' && note.content) {
    try {
      finalContent = decrypt(note.content);
    } catch (e) {
      console.error(`Failed to decrypt public note ID ${note.id}:`, e);
    }
  }

  return (
    <div className="flex justify-center min-h-screen bg-background py-12">
      <div className="w-full max-w-2xl p-8 bg-card border border-border rounded-lg shadow-md">
        <h1 className="mb-4 text-3xl font-bold text-card-foreground">{note.title}</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Published on: {new Date(note.created_at).toLocaleDateString()}
        </p>
        <div className="prose max-w-none">
          {/* Conditionally render image or text */}
          {note.type === 'scribble' ? (
            <div className="relative w-full mt-2 aspect-video bg-white rounded-md overflow-hidden">
                <Image src={finalContent} alt={note.title || 'Scribble'} layout="fill" objectFit="contain" />
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-foreground">{finalContent}</div>
          )}
        </div>
      </div>
    </div>
  );
}
