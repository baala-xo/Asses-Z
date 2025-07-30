// app/notes/[id]/edit/edit-form.tsx
'use client';

import { updateNote } from '@/app/notes/actions';
import { Database } from '@/lib/database.types';

type Note = Database['public']['Tables']['notes']['Row'];

export default function EditNoteForm({ note }: { note: Note }) {
  return (
    <form
      action={updateNote}
      className="p-6 space-y-4 bg-gray-100 border border-gray-300 rounded-lg"
    >
      {/* Hidden input to pass the note ID */}
      <input type="hidden" name="id" value={note.id} />
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          defaultValue={note.title}
          required
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          name="content"
          id="content"
          defaultValue={note.content ?? ''}
          rows={6}
          required
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
      >
        Update Note
      </button>
    </form>
  );
}