# note - Z - A Full-Stack Next.js Application

This is a modern, full-stack notes application built with Next.js and Supabase. It allows users to securely create, manage, and share text notes and hand-drawn scribbles. The application features a clean, themed UI with a focus on security and user experience.

**Live Application:** [https://asses-z.vercel.app/](https://asses-z.vercel.app/)

---

## Features

- **User Authentication**: Secure sign-in with Google OAuth.
- **Note Creation**: Users can create both standard text notes and hand-drawn scribbles.
- **AI Summarization**: Instantly summarize long text notes using the Mistral AI model.
- **CRUD Operations**: Full Create, Read, and Delete functionality for all notes.
- **End-to-End Encryption**: Text note content is encrypted on the server before being stored, ensuring user privacy.
- **Public Sharing**: Users can make any note public and share it via a unique, read-only link.
- **Themed UI**: A modern and consistent UI built with a custom theme using Tailwind CSS.
- **Custom Fonts**: Uses "Architect's Daughter" for a unique, handwritten feel.

---

## Tech Stack & Libraries

This project was built using a modern, full-stack TypeScript environment.

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Backend & Database**: [Supabase](https://supabase.io/) (PostgreSQL, Auth, Row Level Security)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - with a custom theme using TweakCN [a no code theme editor] (https://tweakcn.com/)
- **Encryption**: [crypto-js](https://github.com/brix/crypto-js) for AES encryption
- **UI Components**: [Lucide React](https://lucide.dev/) for icons

---

## Encryption Flow

Security is a core feature of this application. All text-based notes are encrypted to protect user privacy.

- **Technique**: The application uses **AES (Advanced Encryption Standard)** for symmetric encryption.
- **Process**:
  1.  When a user creates or updates a text note, the content is sent to the server.
  2.  On the server, the content is encrypted using a secret key that is stored securely as an environment variable.
  3.  Only the **encrypted text** is ever saved to the database.
  4.  When a user views their notes, the encrypted text is fetched from the database, decrypted on the server, and then the readable content is sent to the browser.
- **Note**: Scribble notes (which are image data) are not encrypted in the current version to maintain performance.

---

## Getting Started Locally

To run this project on your local machine:

1.  **Clone the repository:**

    ```bash
    git clone [your-repo-link]
    cd [your-repo-name]
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    - Create a file named `.env.local` in the root of the project.
    - Add your Supabase URL, Anon Key, and a custom Encryption Key:
      ```ini
      NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
      NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
      ENCRYPTION_SECRET_KEY=YOUR_32_CHARACTER_SECRET_KEY
      ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.
