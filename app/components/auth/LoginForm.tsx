// components/auth/LoginForm.tsx
import React, { useState } from "react";

interface LoginFormProps {
  title?: string;
  onSubmit: (formData: { email: string; password: string }) => void;
  isLoading?: boolean;
  error?: string;
  signupUrl?: string;
  userType?: string;
  onBack?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  title = "Login",
  onSubmit,
  isLoading = false,
  error,
  signupUrl,
  onBack,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        {title}
      </h2>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="flex justify-between items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
        {signupUrl && (
          <a href={signupUrl} className="hover:underline">
            Sign Up
          </a>
        )}
        {onBack && (
          <button onClick={onBack} className="hover:underline">
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
