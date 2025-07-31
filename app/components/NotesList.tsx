'use client';

import { useState } from 'react';
import { deleteNote, togglePublicStatus } from '@/app/notes/actions';
import type { Database } from '@/lib/database.types';
import Image from 'next/image';
import { Trash2, Globe, Lock, Copy, Calendar, FileText, Palette, Wand2 } from 'lucide-react';
import SummaryModal from './SummaryModal'; // Import the summary modal

// The note type from the server now includes 'type' and 'content' can be a data URL
type DecryptedNote = Omit<Database['public']['Tables']['notes']['Row'], 'content'> & {
  content: string;
};

export default function NotesList({ notes }: { notes: DecryptedNote[] }) {
  // State for custom pop-up notifications
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  // State for loading indicators on buttons
  const [loadingNoteId, setLoadingNoteId] = useState<number | null>(null);
  // State to manage the AI summary modal
  const [selectedNoteForSummary, setSelectedNoteForSummary] = useState<DecryptedNote | null>(null);

  // Helper function to show a popup message for 3 seconds
  const showPopup = (message: string) => {
    setPopupMessage(message);
    setTimeout(() => {
      setPopupMessage(null);
    }, 3000);
  };

  const handleDelete = async (noteId: number) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const result = await deleteNote(noteId);
      if (result?.error) {
        showPopup(`Error: ${result.error}`);
      }
    }
  };

  const handleTogglePublic = async (noteId: number, currentState: boolean) => {
    setLoadingNoteId(noteId); // Start loading
    await togglePublicStatus(noteId, currentState);
    setLoadingNoteId(null); // Stop loading
  };

  const handleCopyLink = (noteId: number) => {
    const url = `${window.location.origin}/public/${noteId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        showPopup('Public link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err);
        showPopup('Failed to copy link.');
      });
  };

  return (
    <div className="mt-12 relative">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Your Notes & Scribbles</h2>
        {notes && notes.length > 0 && (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-muted text-muted-foreground">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </span>
        )}
      </div>

      {notes && notes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="group relative flex flex-col bg-card border border-border/50 rounded-xl shadow-sm hover:shadow-lg hover:border-border transition-all duration-200 overflow-hidden"
            >
              {/* Note Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {note.type === 'scribble' ? (
                        <Palette className="w-3 h-3 text-primary" />
                      ) : (
                        <FileText className="w-3 h-3 text-primary" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground truncate">{note.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                        note.is_public
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {note.is_public ? (
                        <><Globe className="w-3 h-3" /> Public</>
                      ) : (
                        <><Lock className="w-3 h-3" /> Private</>
                      )}
                    </span>
                  </div>
                </div>

                {/* Note Content */}
                <div className="mb-4">
                  {note.type === 'scribble' ? (
                    <div className="relative w-full aspect-video bg-white rounded-lg overflow-hidden border border-border/30">
                      <Image
                        src={note.content || '/placeholder.svg'}
                        alt={note.title || 'Scribble'}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <p className="text-muted-foreground whitespace-pre-wrap line-clamp-4 text-sm leading-relaxed">
                        {note.content}
                      </p>
                      {note.content && note.content.length > 200 && (
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card to-transparent"></div>
                      )}
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                  <Calendar className="w-3 h-3" />
                  {new Date(note.created_at).toLocaleString()}
                </div>
              </div>

              {/* Note Actions */}
              <div className="px-6 pb-6 mt-auto">
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>

                  <div className="flex items-center gap-2">
                    {note.type === 'text' && (
                      <button
                        onClick={() => setSelectedNoteForSummary(note)}
                        className="inline-flex items-center justify-center p-2 text-sm font-medium rounded-lg text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/20 transition-colors"
                        title="Summarize with AI"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {note.is_public && (
                      <button
                        onClick={() => handleCopyLink(note.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy Link
                      </button>
                    )}

                    <button
                      onClick={() => handleTogglePublic(note.id, note.is_public || false)}
                      disabled={loadingNoteId === note.id}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingNoteId === note.id ? (
                        <svg className="animate-spin h-3.5 w-3.5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : note.is_public ? (
                        <><Lock className="w-3.5 h-3.5" /> Make Private</>
                      ) : (
                        <><Globe className="w-3.5 h-3.5" /> Make Public</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No notes yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Create your first note or scribble above to get started organizing your thoughts.
          </p>
        </div>
      )}

      {/* Custom Popup component for copy link notifications */}
      {popupMessage && (
        <div className="fixed bottom-5 right-5 bg-accent text-accent-foreground py-2 px-4 rounded-lg shadow-lg transition-transform transform animate-in fade-in slide-in-from-bottom">
          <p>{popupMessage}</p>
        </div>
      )}

      {/* Render the Summary Modal when a note is selected */}
      {selectedNoteForSummary && (
        <SummaryModal
          noteContent={selectedNoteForSummary.content}
          noteTitle={selectedNoteForSummary.title || 'Note'}
          onClose={() => setSelectedNoteForSummary(null)}
        />
      )}
    </div>
  );
}
