import React, { useState } from 'react';
import { Button } from '../ui/button';
import authenticator from 'authenticator';
import bcrypt from 'bcryptjs';

interface Props {
  storedCredentials: {
    username: string;
    password: string;
    twoFactorSecret: string;
  };
  onLogin: () => void;
}

export const AdminLogin: React.FC<Props> = ({ storedCredentials, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [error, setError] = useState('');

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username !== storedCredentials.username) {
      setError('Invalid credentials');
      return;
    }

    const passwordMatch = await bcrypt.compare(password, storedCredentials.password);
    if (!passwordMatch) {
      setError('Invalid credentials');
      return;
    }

    setStep('2fa');
  };

  const handleTwoFactorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const isValid = authenticator.verifyToken(storedCredentials.twoFactorSecret, twoFactorToken);
      
      if (isValid) {
        onLogin();
      } else {
        setError('Invalid 2FA code');
      }
    } catch (err) {
      setError('Error validating 2FA code');
    }
  };

  if (step === '2fa') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h2 className="text-2xl font-bold text-center mb-4">
              Enter 2FA Code
            </h2>
          </div>

          <form className="space-y-6" onSubmit={handleTwoFactorSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter the 6-digit code from your authenticator app
              </label>
              <input
                type="text"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="000000"
                value={twoFactorToken}
                onChange={(e) => setTwoFactorToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setStep('credentials')}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="w-full"
                disabled={twoFactorToken.length !== 6}
              >
                Verify
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-2xl font-bold text-center mb-4">
            Admin Login
          </h2>
        </div>

        <form className="space-y-6" onSubmit={handleCredentialsSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            className="w-full"
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
};