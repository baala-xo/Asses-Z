'use client';

import { createNote } from '@/app/notes/actions';
import { useRef } from 'react';

export default function CreateNoteForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleCreateNote = async (formData: FormData) => {
    // We clear the form on the client side for a faster UI response
    const currentForm = formRef.current;
    if (currentForm) {
      // Manually get data before reset to check if form is filled
      const title = (currentForm.elements.namedItem('title') as HTMLInputElement).value;
      const content = (currentForm.elements.namedItem('content') as HTMLTextAreaElement).value;

      if (title && content) {
        currentForm.reset();
      }
    }

    const result = await createNote(formData);
    if (result?.error) {
      alert(result.error);
      // Note: In a real app, you might want to restore the form data upon error.
    }
  };

  return (
    <form
      ref={formRef}
      action={handleCreateNote}
      className="p-6 mb-8 space-y-4 bg-card border border-border rounded-lg"
    >
      <h2 className="text-xl font-semibold text-card-foreground">Create a New Note</h2>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-muted-foreground">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          className="block w-full px-3 py-2 mt-1 bg-input border-border rounded-md shadow-sm text-foreground focus:ring-ring focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-muted-foreground">
          Content
        </label>
        <textarea
          name="content"
          id="content"
          rows={4}
          required
          className="block w-full px-3 py-2 mt-1 bg-input border-border rounded-md shadow-sm text-foreground focus:ring-ring focus:border-primary"
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 font-bold text-primary-foreground bg-primary rounded-md hover:bg-primary/90"
      >
        Create Note
      </button>
    </form>
  );
}
