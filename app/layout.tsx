import type { Metadata } from "next";
// 1. Import all three fonts from next/font/google
import { Architects_Daughter, Fira_Code } from "next/font/google";
import "./globals.css";

// 2. Configure all the fonts and assign them CSS variables
const architectsDaughter = Architects_Daughter({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sans', // Assign to the --font-sans variable
});


const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono', // Assign to the --font-mono variable
});


export const metadata: Metadata = {
  title: "Notes App",
  description: "Create and share your notes and scribbles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Apply all font variables to the body for global access */}
      <body className={`${architectsDaughter.variable} ${firaCode.variable}`}>
        {children}
      </body>
    </html>
  );
}
