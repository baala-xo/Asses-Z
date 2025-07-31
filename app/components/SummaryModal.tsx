'use client';

import { useEffect, useState } from 'react';
import { summarizeNote } from '@/app/notes/actions';
import { X, Wand2 } from 'lucide-react';

interface SummaryModalProps {
  noteContent: string;
  noteTitle: string;
  onClose: () => void;
}

export default function SummaryModal({ noteContent, noteTitle, onClose }: SummaryModalProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSummary = async () => {
      setIsLoading(true);
      setError(null);
      const result = await summarizeNote(noteContent);
      if (result.error) {
        setError(result.error);
      } else if (result.summary) {
        setSummary(result.summary);
      }
      setIsLoading(false);
    };

    getSummary();
  }, [noteContent]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg p-6 mx-4 bg-card border border-border rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wand2 className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-card-foreground">AI Summary of "{noteTitle}"</h2>
        </div>

        <div className="mt-4 min-h-[150px]">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating summary...</span>
              </div>
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {!isLoading && !error && <p className="text-foreground">{summary}</p>}
        </div>
      </div>
    </div>
  );
}
