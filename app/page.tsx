import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-background text-foreground p-4">
      <header className="mb-8">
        <h1 className="text-5xl font-bold">Welcome to Your Notes App</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The simple, secure, and elegant way to keep track of your thoughts.
        </p>
      </header>
      <main className="mb-8">
        <div className="p-8 border rounded-lg bg-card border-border">
          <h2 className="text-2xl font-semibold text-card-foreground">Features You'll Love</h2>
          <ul className="mt-4 space-y-2 text-left list-disc list-inside text-muted-foreground">
            <li>End-to-End Encryption for your privacy.</li>
            <li>Create, read, and delete notes with ease.</li>
            <li>Share notes securely with a public link.</li>
            <li>Clean and modern user interface.</li>
          </ul>
        </div>
      </main>
      <footer>
        <Link
          href="/notes"
          className="px-8 py-4 text-lg font-bold rounded-md text-primary-foreground bg-primary hover:bg-primary/90"
        >
          Try Now
        </Link>
      </footer>
    </div>
  );
}
