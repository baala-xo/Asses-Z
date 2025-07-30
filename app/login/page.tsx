// app/login/page.tsx

import { AuthForm } from './auth-form';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Sign In</h1>
        <AuthForm />
      </div>
    </div>
  );
}