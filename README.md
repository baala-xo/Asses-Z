Features Checklist
[x] Authentication: Users can sign in/out via Google OAuth. Routes are protected.

[x] CRUD Operations:

[x] Create: Users can create new notes.

[x] Read: Users can view a list of their notes.

[ ] Update: Users can edit their notes. (Temporarily disabled to resolve a build-specific type error during deployment).

[x] Delete: Users can delete their notes.

[x] Encryption: Note content is encrypted at rest in the database.

[x] Public Notes: Users can make notes public and share them via a unique URL.

[x] Deployment: The application is deployed and live on Vercel.

Encryption Technique and Flow
To ensure data privacy, the content of each note is encrypted before it is stored in the database. This means that even if someone gained direct access to the database, the note content would be unreadable.

Technique Used: AES (Advanced Encryption Standard), a symmetric encryption algorithm, implemented via the crypto-js library.

How it Works
The encryption and decryption process is handled entirely on the server-side to protect the secret key.

Creating/Updating a Note:

A user submits a note with a title and plain text content.

The server receives the plain text.

Before saving to the database, the server uses a secret key (stored only on the server) to encrypt the note's content.

Only the encrypted text is stored in the Supabase database.

Reading a Note:

When a user requests their notes, the server fetches the encrypted content from the database.

The server uses the same secret key to decrypt the content back into plain text.

The decrypted, readable plain text is then sent to the user's browser to be displayed.

Key Management
The ENCRYPTION_SECRET_KEY is a 32-character random string that acts as the password for the encryption. It is stored securely as an environment variable:

Locally in the .env.local file (which is not committed to Git).

In production on the Vercel project settings.

This ensures the key is never exposed in the client-side code or in the Git repository.
