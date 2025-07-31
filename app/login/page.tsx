import { AuthForm } from './auth-form';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card border border-border rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-card-foreground">Sign In</h1>
        <AuthForm />
      </div>
    </div>
  );
}
