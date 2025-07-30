'use client';

import Link from 'next/link';
import { deleteNote, togglePublicStatus } from '@/app/notes/actions';
import { Database } from '@/lib/database.types';

type DecryptedNote = Omit<Database['public']['Tables']['notes']['Row'], 'content'> & {
    content: string;
};

export default function NotesList({ notes }: { notes: DecryptedNote[] }) {
  const handleDelete = async (noteId: number) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const result = await deleteNote(noteId);
      if (result?.error) {
        alert(`Error: ${result.error}`);
      }
    }
  };

  const handleTogglePublic = async (noteId: number, currentState: boolean) => {
    await togglePublicStatus(noteId, currentState);
  };

  const handleCopyLink = (noteId: number) => {
    const url = `${window.location.origin}/public/${noteId}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Public link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-white">Your Notes</h2>
      {notes && notes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div key={note.id} className="flex flex-col p-4 bg-white border rounded-lg shadow">
              {/* Note Body */}
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-black">{note.title}</h3>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">{note.content}</p>
              </div>

              {/* Note Footer */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${note.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {note.is_public ? 'Public' : 'Private'}
                    </span>
                    <p className="text-xs text-gray-400">{new Date(note.created_at).toLocaleString()}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-x-2">
                    {/* EDIT BUTTON HAS BEEN REMOVED */}
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="flex items-center gap-x-2">
                    {note.is_public && (
                        <button onClick={() => handleCopyLink(note.id)} className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded hover:bg-blue-200">
                            Copy Link
                        </button>
                    )}
                    <button onClick={() => handleTogglePublic(note.id, note.is_public || false)} className="px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                      {note.is_public ? 'Make Private' : 'Make Public'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-500">You have no notes yet. Create one above!</p>
      )}
    </div>
  );
}
