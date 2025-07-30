'use client';

import { createNote } from '@/app/notes/actions';
import { useRef } from 'react';

export default function CreateNoteForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleCreateNote = async (formData: FormData) => {
    // We clear the form on the client side for a faster UI response
    const currentForm = formRef.current;
    if (currentForm) {
      // Manually get data before reset
      const title = (currentForm.elements.namedItem('title') as HTMLInputElement).value;
      const content = (currentForm.elements.namedItem('content') as HTMLTextAreaElement).value;

      if (title && content) {
        currentForm.reset();
      }
    }

    const result = await createNote(formData);
    if (result?.error) {
      alert(result.error);
      // Note: In a real app, you might want to restore form content on error
    }
  };

  return (
    <form
      ref={formRef}
      action={handleCreateNote}
      className="p-6 mb-8 space-y-4 bg-white border border-gray-200 rounded-lg"
    >
      <h2 className="text-xl font-semibold text-black">Create a New Note</h2>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          // --- CHANGE HERE ---
          className="block w-full px-3 py-2 mt-1 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          name="content"
          id="content"
          rows={4}
          required
          // --- CHANGE HERE ---
          className="block w-full px-3 py-2 mt-1 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
      >
        Create Note
      </button>
    </form>
  );
}
