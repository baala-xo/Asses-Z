'use client';

import { useState } from 'react';
import CreateNoteForm from './CreateNoteForm';
import ScribblePad from './Scribblepad';

export default function NoteCreationTabs() {
  const [activeTab, setActiveTab] = useState('note'); // 'note' or 'scribble'

  const tabStyle = "px-4 py-2 font-semibold rounded-t-lg transition-colors duration-200";
  const activeTabStyle = "bg-card text-card-foreground";
  const inactiveTabStyle = "bg-muted text-muted-foreground hover:bg-card/80";

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Tab Buttons */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('note')}
          className={`${tabStyle} ${activeTab === 'note' ? activeTabStyle : inactiveTabStyle}`}
        >
          New Note
        </button>
        <button
          onClick={() => setActiveTab('scribble')}
          className={`${tabStyle} ${activeTab === 'scribble' ? activeTabStyle : inactiveTabStyle}`}
        >
          New Scribble
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'note' && <CreateNoteForm />}
        {activeTab === 'scribble' && <ScribblePad />}
      </div>
    </div>
  );
}
