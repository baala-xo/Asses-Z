'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { encrypt } from '@/lib/encryption';

/**
 * Creates a new note with encrypted content.
 */
export async function createNote(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to create a note.' };
  }

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  const encryptedContent = encrypt(content);

  const { error } = await supabase.from('notes').insert({
    title,
    content: encryptedContent,
    user_id: user.id,
  });

  if (error) {
    console.error('Supabase insert error:', error);
    return { error: 'Failed to create note.' };
  }

  revalidatePath('/notes');
  return { success: 'Note created successfully.' };
}

/**
 * Deletes a note.
 */
export async function deleteNote(noteId: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to delete a note.' };
  }

  const { error } = await supabase.from('notes').delete().match({ id: noteId });

  if (error) {
    console.error('Error deleting note:', error);
    return { error: 'Failed to delete note.' };
  }

  revalidatePath('/notes');
  return { success: 'Note deleted successfully.' };
}

/**
 * Toggles the public status of a note.
 */
export async function togglePublicStatus(noteId: number, currentState: boolean) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to change a note\'s status.' };
  }

  const { error } = await supabase
    .from('notes')
    .update({ is_public: !currentState })
    .match({ id: noteId, user_id: user.id });

  if (error) {
    console.error('Error toggling public status:', error);
    return { error: 'Failed to update note status.' };
  }

  revalidatePath('notes');
  return { success: 'Note status updated.' };
}


