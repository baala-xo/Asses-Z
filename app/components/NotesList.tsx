'use client';

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
      <h2 className="text-xl font-semibold text-foreground">Your Notes</h2>
      {notes && notes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div key={note.id} className="flex flex-col p-4 bg-card border border-border rounded-lg shadow">
              {/* Note Body */}
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-card-foreground">{note.title}</h3>
                <p className="mt-2 text-muted-foreground whitespace-pre-wrap">{note.content}</p>
              </div>

              {/* Note Footer */}
              <div className="pt-4 mt-4 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${note.is_public ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {note.is_public ? 'Public' : 'Private'}
                    </span>
                    <p className="text-xs text-muted-foreground">{new Date(note.created_at).toLocaleString()}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-x-2">
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="px-2 py-1 text-xs font-semibold rounded text-destructive-foreground bg-destructive hover:bg-destructive/90"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="flex items-center gap-x-2">
                    {note.is_public && (
                        <button onClick={() => handleCopyLink(note.id)} className="px-2 py-1 text-xs rounded text-secondary-foreground bg-secondary hover:bg-secondary/90">
                            Copy Link
                        </button>
                    )}
                    <button onClick={() => handleTogglePublic(note.id, note.is_public || false)} className="px-2 py-1 text-xs rounded text-muted-foreground bg-muted hover:bg-muted/90">
                      {note.is_public ? 'Make Private' : 'Make Public'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-muted-foreground">You have no notes yet. Create one above!</p>
      )}
    </div>
  );
}
