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

export async function createScribbleNote(content: string, title: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to save a scribble.' };
  }

  // Note: We are not encrypting the scribble data URL as it's not plain text.
  // For higher security, this could be encrypted, but it would require decryption on the client before rendering.
  const { error } = await supabase.from('notes').insert({
    title,
    content, // The content is the base64 data URL from the canvas
    user_id: user.id,
    type: 'scribble', // Set the type to 'scribble'
  });

  if (error) {
    console.error('Error creating scribble note:', error);
    return { error: 'Failed to save scribble.' };
  }

  revalidatePath('/notes');
  return { success: 'Scribble saved successfully.' };
}


export async function summarizeNote(content: string) {
  const apiKey = process.env.TOGETHER_AI_API_KEY;
  if (!apiKey) {
    return { error: 'AI API key is not configured.' };
  }

  if (!content || content.trim().length < 50) {
      return { error: 'Note is too short to summarize.' };
  }

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          {
            role: 'system',
            content: 'You are an expert summarizer. Provide a concise summary of the following text.',
          },
          {
            role: 'user',
            content: `Please summarize this note:\n\n${content}`,
          },
        ],
        max_tokens: 150, // Limit the length of the summary
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Together AI API Error:', errorBody);
      return { error: `Failed to get summary. Status: ${response.status}` };
    }

    const result = await response.json();
    const summary = result.choices[0]?.message?.content;

    if (!summary) {
        return { error: 'Could not extract summary from AI response.' };
    }

    return { summary };

  } catch (error) {
    console.error('Error summarizing note:', error);
    return { error: 'An unexpected error occurred while summarizing.' };
  }
}
