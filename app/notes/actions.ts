'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { encrypt } from '@/lib/encryption';

/**
 * Creates a new note with encrypted content.
 */
export async function createNote(formData: FormData) {
  console.log('--- Create Note action started ---'); // Log when the action starts

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('Error: User is not logged in.'); // Log if user isn't found
    return { error: 'You must be logged in to create a note.' };
  }

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  console.log('Received data:', { title, content }); // Log the data from the form

  // Encrypt the content before inserting
  const encryptedContent = encrypt(content);

  const { error } = await supabase.from('notes').insert({
    title,
    content: encryptedContent, // Save the encrypted content
    user_id: user.id,
  });

  if (error) {
    // IMPORTANT: Log any error from Supabase
    console.error('Supabase insert error:', error);
    return { error: 'Failed to create note.' };
  }

  console.log('--- Note created successfully in database ---'); // Log on success

  revalidatePath('/');
  return { success: 'Note created successfully.' };
}

/**
 * Updates an existing note with encrypted content.
 */
export async function updateNote(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to update a note.' };
  }

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  // Encrypt the content before updating
  const encryptedContent = encrypt(content);

  const { error } = await supabase
    .from('notes')
    .update({ title, content: encryptedContent }) // Save the encrypted content
    .match({ id: id });

  if (error) {
    console.error('Error updating note:', error);
    return { error: 'Failed to update note.' };
  }

  revalidatePath('/');
  revalidatePath(`/notes/${id}/edit`);
  redirect('/');
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

  // RLS ensures the user can only delete their own notes
  const { error } = await supabase.from('notes').delete().match({ id: noteId });

  if (error) {
    console.error('Error deleting note:', error);
    return { error: 'Failed to delete note.' };
  }

  revalidatePath('/');
  return { success: 'Note deleted successfully.' };
}


export async function togglePublicStatus(noteId: number, currentState: boolean) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to change a note\'s status.' };
  }

  // RLS ensures the user can only update their own notes.
  const { error } = await supabase
    .from('notes')
    .update({ is_public: !currentState }) // Flip the current state
    .match({ id: noteId, user_id: user.id }); // Extra check for ownership

  if (error) {
    console.error('Error toggling public status:', error);
    return { error: 'Failed to update note status.' };
  }

  revalidatePath('/'); // Refresh the homepage to show the change
  return { success: 'Note status updated.' };
}