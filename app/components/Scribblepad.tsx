'use client';

import { useRef, useEffect, useState } from 'react';
import { createScribbleNote } from '@/app/notes/actions';

export default function ScribblePad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [title, setTitle] = useState('');

  // Set canvas size on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = 300; // Fixed height for the canvas
    }
  }, []);

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if ('touches' in event) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    }
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const coords = getCoordinates(event);
    if (!ctx || !coords) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const coords = getCoordinates(event);
    if (!ctx || !coords) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = '#000'; // Black color for drawing
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || !title) {
      alert('Please provide a title for your scribble.');
      return;
    }

    // Get the canvas content as a PNG data URL
    const dataUrl = canvas.toDataURL('image/png');

    const result = await createScribbleNote(dataUrl, title);
    if (result?.error) {
      alert(result.error);
    } else {
      // Clear the canvas and title on success
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setTitle('');
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="p-6 mt-8 space-y-4 bg-card border border-border rounded-lg"
    >
      <h2 className="text-xl font-semibold text-card-foreground">Create a New Scribble</h2>
      <div>
        <label htmlFor="scribble-title" className="block text-sm font-medium text-muted-foreground">
          Scribble Title
        </label>
        <input
          type="text"
          id="scribble-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="block w-full px-3 py-2 mt-1 bg-input border-border rounded-md shadow-sm text-foreground focus:ring-ring focus:border-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground">
          Draw here
        </label>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full mt-1 bg-white border rounded-md cursor-crosshair border-border"
        ></canvas>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 font-bold rounded-md text-primary-foreground bg-primary hover:bg-primary/90"
      >
        Save Scribble
      </button>
    </form>
  );
}
