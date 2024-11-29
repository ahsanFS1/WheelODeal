import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useAdminStore } from '../../store/adminStore';
import { Settings } from 'lucide-react';

export const AdminSetup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const setCredentials = useAdminStore((state) => state.setCredentials);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setCredentials({
      username,
      password
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121218] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#D3D3DF] flex items-center justify-center gap-2">
            <Settings className="w-8 h-8 text-[#C33AFF]" />
            Create Admin Account
          </h2>
          <p className="mt-2 text-center text-sm text-[#D3D3DF]/60">
            This is a one-time setup. No additional admin accounts can be created.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#C33AFF]/20 placeholder-[#D3D3DF]/40 text-[#D3D3DF] rounded-lg bg-[#1B1B21] focus:outline-none focus:ring-2 focus:ring-[#C33AFF] focus:border-transparent"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#C33AFF]/20 placeholder-[#D3D3DF]/40 text-[#D3D3DF] rounded-lg bg-[#1B1B21] focus:outline-none focus:ring-2 focus:ring-[#C33AFF] focus:border-transparent"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#C33AFF]/20 placeholder-[#D3D3DF]/40 text-[#D3D3DF] rounded-lg bg-[#1B1B21] focus:outline-none focus:ring-2 focus:ring-[#C33AFF] focus:border-transparent"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <Button
              className="group relative w-full flex justify-center
               py-2 px-4 border border-transparent text-sm 
               font-medium rounded-lg text-white bg-purple-900
                hover:bg-purple-900/90 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 
                focus:ring-[#C33AFF]"
              type="submit"
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};